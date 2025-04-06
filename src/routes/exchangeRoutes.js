import express from "express";
import {requestExchange, getUserExchanges} from "../controller/exchangeController.js";
import {protection} from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protection, requestExchange);
router.get("/", protection, getUserExchanges);

export default router;
