import mongoose from "mongoose";

const banSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        bannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Ban = mongoose.model("Ban", banSchema);
export default Ban;

