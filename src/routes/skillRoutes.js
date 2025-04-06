import express from "express";
import {addSkills, getskills} from "../controllers/skillController.js";
import { protection } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protection, addSkills);
router.get("/", getskills);

export default router;

