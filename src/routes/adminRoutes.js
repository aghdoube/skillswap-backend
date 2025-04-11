import express from "express";
import { registerAdmin, adminLogin, getAllAdmins } from "../controller/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/", getAllAdmins);

export default router;
