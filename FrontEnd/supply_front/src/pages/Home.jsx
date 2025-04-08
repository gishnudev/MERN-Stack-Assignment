import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold text-blue-400">Electronic Supply Chain</h1>
      <p className="mt-4 text-lg text-gray-400">Securely track and verify electronic products using blockchain.</p>
      <div className="mt-6">
        <Link to="/marketplace" className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg font-semibold">
          Explore Marketplace
        </Link>
        <Link to="/dashboard" className="ml-4 px-6 py-3 bg-green-500 hover:bg-green-700 rounded-lg text-lg font-semibold">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;
