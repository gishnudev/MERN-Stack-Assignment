import { Link } from "react-router-dom";
import { useMetaMask } from "../../hooks/useMetaMask";

const Navbar = () => {
  const { account } = useMetaMask();

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-400">ESC</h1>
      <div>
        <Link to="/" className="mr-6 hover:text-blue-400">Home</Link>
        <Link to="/marketplace" className="mr-6 hover:text-blue-400">Marketplace</Link>
        <Link to="/dashboard" className="mr-6 hover:text-blue-400">Dashboard</Link>
      </div>
      <div className="bg-gray-700 px-4 py-2 rounded-md">
        {account ? `${account.substring(0, 6)}...${account.slice(-4)}` : "Not Connected"}
      </div>
    </nav>
  );
};

export default Navbar;
