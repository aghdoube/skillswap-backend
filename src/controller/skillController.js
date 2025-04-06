import Skill from "../models/Skill.js";

export const addSkill = async (req, res, next) => {
  try {
    const skill = new Skill({ ...req.body, user: req.user._id });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().populate("user", "name profilePic");
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};
