import express from "express";
import { banUser, unbanUser, getBannedUsers } from "../controller/banController.js";

const router = express.Router();

router.post("/", banUser);
router.delete("/:userId", unbanUser);
router.get("/", getBannedUsers);

export default router;
