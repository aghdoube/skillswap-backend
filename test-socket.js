import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const testUserId = "test-user-123";
const receiverId = "test-receiver-456"; 

socket.on("connect", () => {
  console.log("Connected to server with socket ID:", socket.id);
  
  socket.emit("joinRoom", testUserId);
});

socket.on("roomJoined", (data) => {
  //console.log("Room joined status:", data);
  
  if (data.success) {
    //console.log("Sending test message...");
    socket.emit("sendMessage", {
      sender: testUserId,
      receiver: receiverId,
      text: "This is a test message"
    });
  }
});

socket.on("messageSent", (response) => {
  //console.log("Message sent confirmation:", response);
  
  if (response.messageId) {
    setTimeout(() => {
      //console.log("Marking message as read...");
      socket.emit("markAsRead", response.messageId);
    }, 2000);
  }
});

socket.on("receiveMessage", (message) => {
  //console.log("New message received:", message);
});

socket.on("messageRead", (data) => {
  console.log("Message read confirmation:", data);
  
  setTimeout(() => {
    console.log("Test complete, disconnecting...");
    socket.disconnect();
  }, 1000);
});

socket.on("messageError", (error) => {
  console.error("Message error:", error);
});

socket.on("readError", (error) => {
  console.error("Read error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});