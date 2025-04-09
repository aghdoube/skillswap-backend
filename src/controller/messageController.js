import Message from '../models/Message.js';

export const sendmessage = async (req, res, next) => {
    const {receiver, text} = req.body;
    const sender = req.user._id;
   

    try {
        if (!receiver || !text) {

            return res.status(400).json({ error: 'Receiver and text are required' });
        }
        const message = new Message({sender, receiver, text});
        await message.save();
        res.status(201).json({ 
            message: 'Message sent successfully', 
            message,

        });


    } catch (error) {
        next(error);
    }
};



export const getMessages = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate('sender', 'name email').populate('receiver', 'name email');
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};


export const deleteMessage = async (req, res, next) => {
  const { messageId } = req.params;  
  const userId = req.user._id;  

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId.toString() && message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this message" });
    }

    await message.deleteOne();

    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);  
  }
};


