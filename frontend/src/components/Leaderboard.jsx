// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("https://qr-backend-0upl.onrender.com/api/scans/leaderboard");
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-[300px] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
          <thead className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rank</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Team</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700 text-center">
            {leaderboard.map((team, index) => {
              // Highlight top 1 team
              const isTopTeam = index === 0;
              return (
                <tr
                  key={team._id}
                  className={`${
                    isTopTeam ? "bg-yellow-100" : "bg-white"
                  } hover:bg-yellow-50 transition-colors`}
                >
                  <td className="px-6 py-3 font-medium">{index + 1}</td>
                  <td className="px-6 py-3">{team.team}</td>
                  <td className="px-6 py-3 font-semibold">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
