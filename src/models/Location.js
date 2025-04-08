import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
  coordinates: {
    type: { 
        type: String, 
        enum: ["Point"], 
        default: "Point" },
    coordinates: { 
        type: [Number], 
        required: true }, 
  },
}, { timestamps: true });

locationSchema.index({ coordinates: "2dsphere" });

export default mongoose.model("Location", locationSchema);
