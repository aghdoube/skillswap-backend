import express from 'express';
import { getConversations, startConversation } from '../controller/conversationController.js';
import {protection} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', protection, getConversations); // /api/conversations
router.post("/", protection, startConversation);


export default router;
