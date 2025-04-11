import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reportedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "resolved", "dismissed"],
            default: "pending",
        },
        adminNotes: {
            type: String,
        },
    },
    { timestamps: true } 
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
