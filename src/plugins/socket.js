import { io } from "socket.io-client";

console.log("Socket client initializing with URL:", import.meta.env.VITE_API_URL || "http://localhost:3002");

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3002", {
  withCredentials: true,
  transports: ["websocket", "polling"], 
  autoConnect: false, 
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  auth: (cb) => {
    const token = localStorage.getItem('auth_token');
    console.log("Socket auth token available:", !!token);
    cb({ token });
  }
});

socket.on("connect", () => {
  console.log("Socket connected successfully with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});


export default socket;

export const connectSocket = () => {
  if (!socket.connected) {
    console.log("Manually connecting socket...");
    socket.connect();
  }
};