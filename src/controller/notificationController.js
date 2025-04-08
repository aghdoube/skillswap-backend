import Notification from '../models/Notification.js';

export const createNotification = async (req, res, next) =>{
    try {
        const {userId, type, message} = req.body;
        const notification = new Notification({
            userId,
            type,
            message
        });
        await notification.save();
        res.status(201).json({
            message: 'Notification sent successfully',
            notification
        });
    } catch (error) {
        next(error);
    }

};


export const getNotification = async (req, res, next) => {
    try {
        const notifications = await Notification.find({userId: req.params.userId});
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

export const isRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, 
            { status: "read"},
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json({ message: "Notification marked as read", notification });
        
    } catch (error) {
        next(error);
    }
};

