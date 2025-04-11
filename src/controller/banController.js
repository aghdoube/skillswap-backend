import Ban from "../models/Bans.js";
import User from "../models/User.js";

export const banUser = async (req, res, next) => {
  try {
    const { userId, reason, bannedBy, expiresAt } = req.body;

    const existingBan = await Ban.findOne({ user: userId });
    if (existingBan) return res.status(400).json({ message: "User is already banned." });

    const ban = new Ban({ user: userId, reason, bannedBy, expiresAt });
    await ban.save();

    await User.findByIdAndUpdate(userId, { isBanned: true });

    res.status(201).json({ message: "User banned successfully.", ban });
  } catch (error) {
    next(error);  }
};

export const unbanUser = async (req, res, next ) => {
  try {
    const { userId } = req.params;
    await Ban.findOneAndDelete({ user: userId });

    await User.findByIdAndUpdate(userId, { isBanned: false });

    res.json({ message: "User unbanned successfully." });
  } catch (error) {
    next(error);  } 
};

export const getBannedUsers = async (req, res, next ) => {
  try {
    const bans = await Ban.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(bans);
  } catch (error) {
    next(error);  }
};
