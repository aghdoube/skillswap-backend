import Exchange from '../models/exchangeModel.js';


import Exchange from "../models/Exchange.js";

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

