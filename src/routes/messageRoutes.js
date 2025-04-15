import express from "express";
import { sendmessage, getMessages, deleteMessage, markAsRead } from "../controller/messageController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/messages", protection, sendmessage);
router.get("/", protection, getMessages);
router.delete("/messages/:messageId", protection, deleteMessage);
router.put("/read/:messageId", protection, markAsRead);
export default router;
