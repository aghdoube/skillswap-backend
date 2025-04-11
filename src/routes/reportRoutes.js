import express from "express";
import { submitReport, getAllReports, reviewReport } from "../controller/reportController.js";

const router = express.Router();

router.post("/", submitReport);
router.get("/", getAllReports);
router.put("/:reportId", reviewReport);

export default router;
