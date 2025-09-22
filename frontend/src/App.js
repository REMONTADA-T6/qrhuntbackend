import ScansTable from "./components/ScansTable";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">QR Hunt Organizer Dashboard</h1>
      <ScansTable />
      <Leaderboard />
    </div>
  );
}

export default App;
