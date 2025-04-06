import express from "express";
import {sendmessage, getMessages} from "../controller/messageController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protection, sendmessage);
router.get("/", protection, getMessages);

export default router;
