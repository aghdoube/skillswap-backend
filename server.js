import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import skillRoutes from "./src/routes/skillRoutes.js";
import exchangeRoutes from "./src/routes/exchangeRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import locationRoutes from "./src/routes/locationRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import Message from "./src/models/Message.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
    credentials: true
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/", (req, res) => {
    res.send("SkillSwap API is running...");
});
app.use("/api/skills", skillRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/locations", locationRoutes);
app.use("/categories", categoryRoutes);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  
  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      //console.log(`User ${userId} joined room: ${userId}`);
      socket.emit("roomJoined", { userId, success: true });
    } else {
      //console.log("Join room attempt with missing userId");
      socket.emit("roomJoined", { success: false, error: "Missing userId" });
    }
  });

  socket.on("sendMessage", async (messageData) => {
    //console.log("Received sendMessage event:", messageData);
    
    try {
      if (!messageData.sender || !messageData.receiver || !messageData.text) {
        socket.emit("messageError", { error: "Missing required message fields" });
        return;
      }

      const message = new Message({
        sender: messageData.sender,
        receiver: messageData.receiver,
        text: messageData.text,
      });
      
      await message.save();
      //console.log("Message saved:", message._id);
      
      io.to(messageData.receiver).emit("receiveMessage", message);
      
      socket.emit("messageSent", { 
        success: true, 
        messageId: message._id,
        message: "Message sent successfully" 
      });
    } catch (error) {
      //console.error("Error sending message:", error);
      socket.emit("messageError", { error: "Failed to save or send message" });
    }
  });

  socket.on("markAsRead", async (messageId) => {
    //console.log("Marking message as read:", messageId);
    
    try {
      if (!messageId) {
        socket.emit("readError", { error: "Missing messageId" });
        return;
      }
      
      const message = await Message.findById(messageId);
      if (message && !message.read) {
        message.read = true;
        await message.save();
        socket.emit("messageRead", { success: true, messageId });
        io.to(message.sender).emit("messageReadByReceiver", { messageId });
      } else if (!message) {
        socket.emit("readError", { error: "Message not found" });
      } else {
        socket.emit("messageRead", { success: true, messageId, info: "Message was already marked as read" });
      }
    } catch (error) {
      //console.error("Error marking message as read:", error);
      socket.emit("readError", { error: "Failed to mark message as read" });
    }
  });

  socket.on("getUnreadCount", async (userId) => {
    try {
      const count = await Message.countDocuments({ 
        receiver: userId, 
        read: false 
      });
      socket.emit("unreadCount", { count });
    } catch (error) {
      //console.error("Error getting unread count:", error);
      socket.emit("unreadCountError", { error: "Failed to get unread count" });
    }
  });

  socket.on("disconnect", () => {
    //console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running and listening for connections`);
});


