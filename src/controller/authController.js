import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upload } from "../utils/Multer.js";



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


const calculateProfileCompleteness = (user) => {
  let fieldsCompleted = 0;
  const totalFields = 6; 
  
  if (user.bio) fieldsCompleted++;
  if (user.location) fieldsCompleted++;
  if (user.profilePic) fieldsCompleted++;
  if (user.skillsOffered.length > 0) fieldsCompleted++;
  if (user.skillsWanted.length > 0) fieldsCompleted++;
  
  return Math.round((fieldsCompleted / totalFields) * 100);
};


export const registerUser = async (req, res, next) => {  
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.status = 400;
      return next(error);  
    }

    const newUser = await User.create({ name, email, password });
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    next(error);  
  }
};


export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      return next(error);  
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
    
  } catch (error) {
    next(error);  
  }
}

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);  
    }
    res.json(user);
  } catch (error) {
    next(error);  
  }
}



export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.skillsOffered = req.body.skillsOffered ? JSON.parse(req.body.skillsOffered) : user.skillsOffered;
    user.skillsWanted = req.body.skillsWanted ? JSON.parse(req.body.skillsWanted) : user.skillsWanted;

    if (req.file) {
      user.profilePic = `/uploads/profile_pics/${req.file.filename}`; 
    }

    user.profileCompletion = calculateProfileCompleteness(user);

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: "User profile deleted successfully",
    });
  } catch (error) {
    next(error);  
  }
};
