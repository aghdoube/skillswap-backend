import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserProfile, 
  getAllUserProfiles,
  getUserProfileById,
  getUsers 
} from "../controller/authController.js";
import { protection } from "../middleware/authMiddleware.js";
import { upload } from "../utils/Multer.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protection, getUserProfile);
router.put("/profile", protection, upload.single("profilePic"), updateUserProfile);
router.delete("/profile", protection, deleteUserProfile);
router.get("/profiles", protection, getAllUserProfiles); 
router.get("/profile/:id", protection, getUserProfileById);
router.get("/users", protection, getUsers);

export default router;




