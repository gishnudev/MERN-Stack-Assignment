import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import DistributorDashboard from "./pages/DistributorDashboard"; // ✅ Import Distributor Dashboard
import { useContract } from "../hooks/useContract";
import { useEffect, useState } from "react";

function App() {
  const { signer } = useContract();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (signer) setIsConnected(true);
  }, [signer]);

  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        {/* 🟢 Navbar */}
        <nav className="p-4 bg-gray-800 flex justify-between">
          <h1 className="text-2xl font-bold">SupplyChain DApp</h1>
          <div>
            <Link to="/" className="mx-4">Home</Link>
            <Link to="/marketplace" className="mx-4">Marketplace</Link>
            <Link to="/dashboard" className="mx-4">Dashboard</Link>
            <Link to="/distributor-dashboard" className="mx-4">Distributor</Link> {/* 🆕 Added Link */}
          </div>
        </nav>

        {/* ⚠️ Show warning if MetaMask isn't connected */}
        {!isConnected && (
          <div className="p-4 bg-red-500 text-center">
            ⚠️ Please connect MetaMask to use this DApp.
          </div>
        )}

        {/* 🔀 Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/distributor-dashboard" element={<DistributorDashboard />} /> {/* 🆕 Added Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
