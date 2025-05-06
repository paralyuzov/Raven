const socketIo = require("socket.io");
const Message = require("../models/Message");
const { users, onlineUsers } = require('../state/sharedState');
const jwt = require('jsonwebtoken');

const setupSocket = (server, app) => {
  console.log("Setting up Socket.io with CORS origin:", process.env.FRONTEND_URL);
  
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
  
  const io = socketIo(server, { 
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? [process.env.FRONTEND_URL, "https://startling-dolphin-ee06b3.netlify.app"] 
        : ["http://localhost:5173", "http://localhost:4173"],
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  app.set('io', io);

  io.use((socket, next) => {
    console.log("Socket connection attempt from:", socket.handshake.address);
    console.log("Socket auth headers:", socket.handshake.headers.origin);
    
    const token = socket.handshake.auth.token;
    console.log("Socket auth token present:", !!token);
    
    if (!token) {
      console.log("Socket rejected: No auth token provided");
      return next(new Error("Authentication error"));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      console.log("Socket authenticated successfully for user:", socket.userId);
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", async (userId) => {
      users[userId] = socket.id;
      onlineUsers[userId] = true;
      
      io.emit("user_status", onlineUsers);
      
      console.log(`${userId} has joined with socket id: ${socket.id}`);

      try {
        const unreadMessages = await Message.find({ recipient: userId, seen: false });
        if (unreadMessages.length > 0) {
          io.to(socket.id).emit("unread_messages", unreadMessages);
        }
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    });

    socket.on("private_message", async (message) => {
      const recipientSocket = users[message.recipient];

      try {
        const newMessage = new Message({
          sender: message.sender,
          recipient: message.recipient,
          message: message.message,
          type: message.type || 'text',
          seen: false,
        });
        await newMessage.save();

        if (recipientSocket) {
          io.to(recipientSocket).emit("receive_message", {
            ...message,
            _id: newMessage._id,
            seen: false,
            timestamp: new Date()
          });

          const unreadMessages = await Message.find({ 
            recipient: message.recipient, 
            seen: false 
          });
          io.to(recipientSocket).emit("unread_messages", unreadMessages);
        }
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("mark_as_seen", async (data) => {
      const { senderId, recipientId, socketId } = data;

      try {
        await Message.updateMany(
          { 
            sender: senderId, 
            recipient: recipientId, 
            seen: false 
          },
          { $set: { seen: true } }
        );
        
        io.to(socketId).emit("messages_marked_as_seen", { senderId });
        
        const senderSocket = users[senderId];
        if (senderSocket) {
          io.to(senderSocket).emit("messages_marked_as_seen", { 
            senderId: recipientId,
            seen: true 
          });
        }
        
        const unreadMessages = await Message.find({ 
          recipient: recipientId, 
          seen: false 
        });
        
        io.to(socketId).emit("unread_messages", unreadMessages);
      } catch (err) {
        console.error("Error marking messages as seen:", err);
      }
    });

    socket.on("get_unread_messages", async (userId) => {
      try {
        const unreadMessages = await Message.find({ 
          recipient: userId, 
          seen: false 
        });
        
        io.to(socket.id).emit("unread_messages", unreadMessages);
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    });

    socket.on("get_online_users", () => {
      io.to(socket.id).emit("user_status", onlineUsers);
    });

    socket.on("disconnect", () => {
      Object.keys(users).forEach((userId) => {
        if (users[userId] === socket.id) {
          delete users[userId];
          delete onlineUsers[userId];
          io.emit("user_status", onlineUsers);
        }
      });
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;