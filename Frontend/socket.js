import { io } from "socket.io-client";

export const socket = io("https://server-uhx1.onrender.com", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket"], // Use WebSocket for better performance
});
