const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http"); 
const socketIo = require("socket.io"); 
const authRoutes = require("./routes/auth");
const usersRoute = require('./routes/users');
const messagesRoute = require('./routes/messages')
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {}; 

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", async (userId) => {
    users[userId] = socket.id;
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
          seen: false
        });

        const unreadMessages = await Message.find({ 
          recipient: message.recipient, 
          sender: message.sender,
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
        { sender: senderId, recipient: recipientId, seen: false },
        { $set: { seen: true } }
      );
      
      io.to(socketId).emit("messages_marked_as_seen", { senderId });
      
      const senderSocket = users[senderId];
      if (senderSocket) {
        io.to(senderSocket).emit("messages_marked_as_seen", { senderId: recipientId });
      }
    } catch (err) {
      console.error("Error marking messages as seen:", err);
    }
  });

  socket.on("disconnect", () => {
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });
    console.log("User disconnected:", socket.id);
  });
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
})();

app.use("/api/auth", authRoutes);
app.use('/api/users',usersRoute);
app.use('/api/messages',messagesRoute);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
