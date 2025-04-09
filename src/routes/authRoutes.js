import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserProfile 
} from "../controller/authController.js";
import { protection } from "../middleware/authMiddleware.js";
import { upload } from "../utils/Multer.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protection, getUserProfile);
router.put("/profile", protection, upload.single("profilePic"), updateUserProfile);
router.delete("/profile", protection, deleteUserProfile);


export default router;
