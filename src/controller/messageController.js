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


