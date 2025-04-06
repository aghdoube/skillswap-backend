import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    proficiency: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
    },
    description: String,
    exchangeType: {
        type: String,
        enum: ["In-Person", "Online", "Both"],
        required: true,
    },
}, { timestamps: true });

const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;
