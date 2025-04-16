import express from "express";
import {
    requestExchange, 
    getUserExchanges,
    acceptExchange,
    declineExchange,
    completeExchange,
    getExchangeHistory,
    getExchangeDetails,
    getExchangeMessages
} from "../controller/exchangeController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protection, requestExchange);
router.get("/", protection, getUserExchanges);
router.get("/:id", protection, getExchangeDetails);
router.get("/:id/messages", protection, getExchangeMessages);
router.put("/:id/accept", protection, acceptExchange);
router.put("/:id/decline", protection, declineExchange);
router.put("/:id/complete", protection, completeExchange);
router.get("/history", protection, getExchangeHistory);

export default router;