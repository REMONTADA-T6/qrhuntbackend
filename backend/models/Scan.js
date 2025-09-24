// models/Scan.js
import mongoose from "mongoose";

const scanSchema = new mongoose.Schema({
  team: { type: String, required: true },
  qrNumber: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Scan", scanSchema);
