import ActivityLog from "../models/ActivityLogs.js";

export const logActivity = async (userId, action, details, ipAddress) => {
  try {
    await ActivityLog.create({ user: userId, action, details, ipAddress });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const getAllLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

export const getUserLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    next(error);  }
};
