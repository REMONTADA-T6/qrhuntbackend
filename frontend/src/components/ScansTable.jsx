import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function ScansTable() {
  const [scans, setScans] = useState([]);
  const [latestScanId, setLatestScanId] = useState(null);
  const tbodyRef = useRef(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await axios.get("https://qr-backend-0upl.onrender.com/api/scans");
        setScans(res.data);

        if (res.data.length > 0) {
          const newestScan = res.data.reduce((prev, current) =>
            new Date(prev.scannedAt) > new Date(current.scannedAt) ? prev : current
          );
          if (newestScan._id !== latestScanId) {
            setLatestScanId(newestScan._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchScans();
    const interval = setInterval(fetchScans, 3000);
    return () => clearInterval(interval);
  }, [latestScanId]);

  // Auto-scroll to latest scan with 10 seconds delay
  useEffect(() => {
    if (tbodyRef.current) {
      const timer = setTimeout(() => {
        const latestRow = tbodyRef.current.querySelector(".latest-scan");
        if (latestRow) {
          latestRow.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [scans, latestScanId]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-[400px] rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Live Scans</h2>

      <div className="overflow-x-auto overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
        <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white sticky top-0">
            <tr>
              <th className="px-4 sm:px-10 py-2 sm:py-3 text-left text-sm sm:text-base font-semibold">
                Team
              </th>
              <th className="px-4 sm:px-10 py-2 sm:py-3 text-left text-sm sm:text-base font-semibold">
                QR Number
              </th>
              <th className="px-4 sm:px-10 py-2 sm:py-3 text-left text-sm sm:text-base font-semibold">
                Scanned At
              </th>
            </tr>
          </thead>
          <tbody ref={tbodyRef} className="divide-y divide-gray-100 text-gray-700 text-center">
            {scans.map((scan) => {
              const newestScan = scans.reduce((prev, current) =>
                new Date(prev.scannedAt) > new Date(current.scannedAt) ? prev : current
              );

              return (
                <tr
                  key={scan._id}
                  className={`${
                    scan._id === newestScan._id ? "bg-blue-100 latest-scan" : "bg-white"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">{scan.team}</td>
                  <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium">{scan.qrNumber}</td>
                  <td className="px-2 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">
                    {new Date(scan.scannedAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
