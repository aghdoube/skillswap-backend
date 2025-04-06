import mongoose from "mongoose";

const ExchangeSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Completed", "Cancelled"],
        default: "Pending",
    },
    schedule: {
        date: Date,
        time: String,
        location: String,
    },
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: String,
            timestamp: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

const Exchange = mongoose.model("Exchange", ExchangeSchema);
export default Exchange;
