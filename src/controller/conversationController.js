import Conversation from '../models/Conversation.js';

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name email')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender receiver', select: 'name email' },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const startConversation = async (req, res, next) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  if (!recipientId) {
    return res.status(400).json({ message: "Recipient ID is required." });
  }

  try {
    // Check if conversation exists
    let convo = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!convo) {
      // Create new conversation
      convo = new Conversation({ participants: [senderId, recipientId] });
      await convo.save();
    }

    res.status(200).json(convo);
  } catch (error) {
 next(error);
  }
};

