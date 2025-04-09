import express from "express";
import {sendmessage, getMessages, deleteMessage} from "../controller/messageController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protection, sendmessage);
router.get("/", protection, getMessages);
router.delete("/messages/:messageId", protection, deleteMessage);


export default router;
