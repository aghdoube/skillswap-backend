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
import activityLogRoutes from "./src/routes/activityLogRoutes.js";
import banRoutes from "./src/routes/banRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import conversationRoutes from "./src/routes/conversationRoutes.js";
import Notification from "./src/routes/notificationRoutes.js";
import Message from "./src/models/Message.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
app.use("/api/activityLogs", activityLogRoutes);
app.use("/api/bans", banRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/notifications", notificationRoutes);

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      socket.emit("roomJoined", { userId, success: true });
    } else {
      socket.emit("roomJoined", { success: false, error: "Missing userId" });
    }
  });

  socket.on("sendMessage", async (messageData) => {
    try {
      if (!messageData.sender || !messageData.receiver || !messageData.text) {
        socket.emit("messageError", {
          error: "Missing required message fields",
        });
        return;
      }

      const message = new Message({
        sender: messageData.sender,
        receiver: messageData.receiver,
        text: messageData.text,
      });

      await message.save();

      io.to(messageData.receiver).emit("receiveMessage", message);

      socket.emit("messageSent", {
        success: true,
        messageId: message._id,
        message: "Message sent successfully",
      });
    } catch (error) {
      socket.emit("messageError", { error: "Failed to save or send message" });
    }
  });

  socket.on(
    "sendNotification",
    async ({ userId, receiverId, type, message }) => {
      const newNotification = new Notification({
        userId: receiverId,
        type,
        message,
      });

      await newNotification.save();

      io.to(receiverId).emit("getNotification", {
        _id: newNotification._id,
        message,
        type,
        createdAt: newNotification.createdAt,
      });
    }
  );

  socket.on("markAsRead", async (messageId) => {
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
        socket.emit("messageRead", {
          success: true,
          messageId,
          info: "Message was already marked as read",
        });
      }
    } catch (error) {
      socket.emit("readError", { error: "Failed to mark message as read" });
    }
  });

  socket.on("getUnreadCount", async (userId) => {
    try {
      const count = await Message.countDocuments({
        receiver: userId,
        read: false,
      });
      socket.emit("unreadCount", { count });
    } catch (error) {
      socket.emit("unreadCountError", { error: "Failed to get unread count" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket server is running and listening for connections`);
});