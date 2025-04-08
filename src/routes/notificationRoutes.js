import express from "express";
import { createNotification, getNotification, isRead } from "../controller/notificationController.js";
import {protection} from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protection, createNotification);
router.get("/:userId", protection, getNotification);
router.put("/:id/read", protection, isRead);

export default router;