import mongoose from "mongoose";


const SkillSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      category: { type: String, required: true },
      proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
      description: String,
      exchangeType: { type: String, enum: ["In-Person", "Online", "Both"], required: true },
      availability: { type: String, enum: ["Weekdays", "Weekends", "Flexible"], required: true },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, 
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      
    },
    
    { timestamps: true }
  );
  
  SkillSchema.index({ location: "2dsphere" });
  
  const Skill = mongoose.model("Skill", SkillSchema);
  export default Skill;
  