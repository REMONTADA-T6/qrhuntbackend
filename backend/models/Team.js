import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  points: { type: Number, default: 0 }
});

export default mongoose.model("Team", teamSchema);
