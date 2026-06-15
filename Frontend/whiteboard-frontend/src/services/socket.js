import io from "socket.io-client";

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
