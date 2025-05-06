import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3002",{
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
    upgrade: false,
    pingTimeout: 20000,
    pingInterval: 25000
}); 

export default socket;