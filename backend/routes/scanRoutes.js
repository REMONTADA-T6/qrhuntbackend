import express from "express";
import Scan from "../models/Scan.js";

const router = express.Router();

// Player submits scan
router.post("/", async (req, res) => {
  try {
    const { qrNumber, team } = req.body;
    const scan = new Scan({ qrNumber, team });
    await scan.save();
    res.status(201).json({ message: "Scan saved", scan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all scans (for dashboard)
router.get("/", async (req, res) => {
  try {
    const scans = await Scan.find().sort({ scannedAt: -1 });
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await Scan.aggregate([
      {
        $group: { 
          _id: "$team", 
          points: { $sum: 1 },           // 1 point per scan
          lastScan: { $max: "$scannedAt" } // optional tie-breaker
        }
      },
      { $sort: { points: -1, lastScan: 1 } } // sort by points desc
    ]);

    // Map _id to team for frontend
    const formatted = leaderboard.map(item => ({
      team: item._id,
      points: item.points
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
