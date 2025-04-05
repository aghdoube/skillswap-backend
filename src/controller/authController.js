import User from "../models/User.js";
import jwt from "jsonwebtoken";


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
