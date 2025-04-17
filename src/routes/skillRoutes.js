import express from "express";
import {
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  searchSkills,
} from "../controller/skillController.js";
import { protection } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protection, addSkill);
router.get("/:id", getSkills);
router.put("/:id", protection, updateSkill);
router.delete("/:id", protection, deleteSkill);
router.get("/search", searchSkills);

export default router;
