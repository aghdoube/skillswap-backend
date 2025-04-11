import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({ name, email, password: hashedPassword, role, permissions });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully.", admin });
  } catch (error) {
    next(error);  }  
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful.", token, admin });
  } catch (error) {
    next(error);  }  
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    next(error);  }  
};
