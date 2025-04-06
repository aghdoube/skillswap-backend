import express from "express";
import {addSkill, getSkills} from "../controller/skillController.js";
import { protection } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protection, addSkill);
router.get("/", getSkills);

export default router;

