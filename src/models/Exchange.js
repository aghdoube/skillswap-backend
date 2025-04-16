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
    relatedConversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    }
}, { timestamps: true });

const Exchange = mongoose.model("Exchange", ExchangeSchema);
export default Exchange;