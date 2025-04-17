import Exchange from "../models/Exchange.js";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Conversation from "../models/Conversation.js";

export const requestExchange = async (req, res, next) => {
  try {
    const { provider, skill, schedule } = req.body;

    if (!provider || !skill) {
      return res
        .status(400)
        .json({ message: "Provider and skill are required" });
    }

    const providerUser = await User.findById(provider);
    if (!providerUser) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const skillFull = providerUser.skillsOffered.find(
      (item) => item._id.toString() === skill
    );
    console.log(skillFull);
    if (!skillFull) {
      return res
        .status(404)
        .json({ message: "Skill not found for this provider" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, provider] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, provider],
      });
      await conversation.save();
    }

    const exchange = new Exchange({
      requester: req.user._id,
      provider,
      skill: skillFull.skill,
      schedule,
      status: "Pending",
      relatedConversation: conversation._id,
    });

    await exchange.save();

    res.status(201).json({
      ...exchange.toObject(),
      conversationId: conversation._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserExchanges = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {
      $or: [{ requester: req.user._id }, { provider: req.user._id }],
    };

    if (status) {
      query.status = status;
    }

    const exchanges = await Exchange.find(query)
      .populate({
        path: "skill",
        select: "title description category",
      })
      .populate({
        path: "provider",
        select: "name profilePic",
      })
      .populate({
        path: "requester",
        select: "name profilePic",
      })
      .populate({
        path: "relatedConversation",
        select: "participants lastMessage",
      })
      .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    next(error);
  }
};

export const getExchangeDetails = async (req, res, next) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate("skill")
      .populate("provider")
      .populate("requester")
      .populate("relatedConversation");

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    res.json(exchange);
  } catch (error) {
    next(error);
  }
};

export const getExchangeHistory = async (req, res, next) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ requester: req.user._id }, { provider: req.user._id }],
    })
      .populate("skill")
      .populate("provider")
      .populate("requester")
      .populate("relatedConversation")
      .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (error) {
    next(error);
  }
};

export const getExchangeMessages = async (req, res, next) => {
  try {
    const exchange = await Exchange.findById(req.params.id).populate(
      "relatedConversation"
    );

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    if (
      !exchange.requester.equals(req.user._id) &&
      !exchange.provider.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this exchange" });
    }

    res.json({
      exchangeId: exchange._id,
      conversationId: exchange.relatedConversation._id,
      message:
        "Fetch messages using your messaging service with the conversationId",
    });
  } catch (error) {
    next(error);
  }
};

export const acceptExchange = async (req, res, next) => {
  try {
    const exchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true }
    );
    res.status(200).json(exchange);
  } catch (error) {
    next(error);
  }
};

export const declineExchange = async (req, res, next) => {
  try {
    const exchange = await Exchange.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    res.status(200).json(exchange);
  } catch (error) {
    next(error);
  }
};

export const completeExchange = async (req, res, next) => {
  try {
    const exchangeId = req.params.id;

    const exchange = await Exchange.findById(exchangeId);

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    if (
      exchange.requester.toString() !== req.user._id.toString() &&
      exchange.provider.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to complete this exchange" });
    }

    exchange.status = "Completed";

    await exchange.save();

    return res.status(200).json({
      message: "Exchange marked as completed",
      exchange,
    });
  } catch (error) {
    next(error);
  }
};
