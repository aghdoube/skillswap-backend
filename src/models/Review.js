import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exchange",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;