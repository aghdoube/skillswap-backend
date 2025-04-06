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
import { Server } from "socket.io";
import http from "http";







dotenv.config();

const app = express();

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




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});