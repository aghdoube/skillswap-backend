import express from "express";
import { getAllLogs, getUserLogs } from "../controller/activityLogController.js";

const router = express.Router();

router.get("/", getAllLogs);
router.get("/:userId", getUserLogs);

export default router;
