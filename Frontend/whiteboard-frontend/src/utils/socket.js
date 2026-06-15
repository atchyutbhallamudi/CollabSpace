import { io } from "socket.io-client";

const token = localStorage.getItem("token");
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const socket = io(API_BASE_URL, {
  extraHeaders: token ? { Authorization: `Bearer ${token}` } : {}, // Only send if token exists
});

export default socket;