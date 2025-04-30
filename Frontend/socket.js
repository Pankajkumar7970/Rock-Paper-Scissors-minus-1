import { io } from "socket.io-client";

export const socket = io("https://server-q3nj.onrender.com", {
  reconnectionDelay: 1000,
});
