import Skill from "../models/Skill.js";
import User from "../models/User.js";

export const addSkill = async (req, res, next) => {
  try {
    const {
      name,
      proficiency,
      category,
      exchangeType,
      availability,
      location,
    } = req.body;

    const skill = new Skill({
      user: req.user._id,
      name,
      category,
      proficiency,
      exchangeType,
      availability,
      location,
    });
    await skill.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        skillsOffered: {
          skill: skill._id,
          level: proficiency,
        },
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const getSkills = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id required" });
    }

    const providerUser = await User.findById(id);
    if (!providerUser) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json(providerUser.skillsOffered);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedSkill);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await skill.deleteOne();
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const searchSkills = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      proficiency,
      exchangeType,
      availability,
      sortBy,
      order,
      page,
      limit,
      longitude,
      latitude,
      maxDistance,
    } = req.query;

    let filters = {};
    if (keyword) filters.name = { $regex: keyword, $options: "i" };
    if (category) filters.category = category;
    if (proficiency) filters.proficiency = proficiency;
    if (exchangeType) filters.exchangeType = exchangeType;
    if (availability) filters.availability = availability;

    if (longitude && latitude && maxDistance) {
      const maxDistInMeters = parseFloat(maxDistance) * 1000;
      filters.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistInMeters,
        },
      };
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "desc" ? -1 : 1;
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skills = await Skill.find(filters)
      .populate("user", "name profilePic")
      .sort(sortOptions)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};

export const matchUsers = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const offeredSkills = user.skillsOffered.map((skill) => skill.skill);
    const wantedSkills = user.skillsWanted.map((skill) => skill.skill);

    const matchingUsers = await User.find({
      $or: [
        { "skillsOffered.skill": { $in: wantedSkills } },
        { "skillsWanted.skill": { $in: offeredSkills } },
      ],
    }).select("name email skillsOffered skillsWanted");

    return matchingUsers;
  } catch (error) {
    throw error;
  }
};
