import Exchange from '../models/Exchange.js';



export const requestExchange = async (req, res, next) => {
    try {
        const exchange = new Exchange({ ...req.body, requester: req.user._id });
        await exchange.save();
        res.status(201).json(exchange);
    } catch (error) {
        next(error);
    }
};

export const getUserExchanges = async (req, res, next) => {
    try {
        const exchanges = await Exchange.find({ $or: [{ requester: req.user._id }, { provider: req.user._id }] })
            .populate("skill provider requester", "name profilePic");
        res.json(exchanges);
    } catch (error) {
        next(error);
    }
};

export const acceptExchange = async (req, res, next) => {
    try {
        const exchange = await Exchange.findByIdAndUpdate(req.params.id, { status: "Accepted" }, { new: true });
        res.status(200).json(exchange);
    } catch (error) {
        next(error);
    }
};

export const declineExchange = async (req, res, next) => {
    try {
        const exchange = await Exchange.findByIdAndUpdate(req.params.id, { status: "Cancelled" }, { new: true });
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

        if (exchange.requester.toString() !== req.user._id.toString() && exchange.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to complete this exchange" });
        }

        exchange.status = "Completed";
        
        await exchange.save();

        return res.status(200).json({
            message: "Exchange marked as completed",
            exchange
        });
    } catch (error) {
        next(error);
    }
};



export const getExchangeHistory = async (req, res, next) => {
    try {
        const exchanges = await Exchange.find({
            $or: [{ requester: req.user._id }, { provider: req.user._id }],
            status: { $in: ['Completed', 'Cancelled'] }
        })
        .populate("skill provider requester", "name profilePic");
        res.json(exchanges);
    } catch (error) {
        next(error);
    }
};
