import Scan from "../models/Scan.js";

// Get all scans
export const getScans = async (req, res) => {
  try {
    const scans = await Scan.find().sort({ scannedAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get leaderboard (points per team)
export const getLeaderboard = async (req, res) => {
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

    const formatted = leaderboard.map(item => ({
      team: item._id,
      points: item.points
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
