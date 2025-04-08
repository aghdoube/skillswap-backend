import express from "express";
import {protection} from "../middleware/authMiddleware.js";
import {addCategory, getCategories} from "../controller/categoryController.js";


const router = express.Router();

router.post("/", protection, addCategory);
router.get("/", protection, getCategories);

export default router;