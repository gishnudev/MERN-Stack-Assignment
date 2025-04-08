import { useEffect } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";
import { useNavigate } from "react-router-dom";
import metaMaskLogo from "/1683020955metamask-icon-png.png"; // Make sure this image exists in `public/`

const WalletConnect = () => {
  const { account, isConnected, connectWallet } = useMetaMask();
  const navigate = useNavigate();

  // 🔥 Redirect user to home page after successful connection
  useEffect(() => {
    if (isConnected) {
      navigate("/home"); // Change to the correct home route
    }
  }, [isConnected, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Connect Your Wallet</h1>
      <p className="text-lg mb-4 text-gray-300">Use MetaMask to securely connect to our platform.</p>

      <div className="p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col items-center">
        <img src={metaMaskLogo} alt="MetaMask Logo" className="w-20 mb-4" />

        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full font-bold text-lg hover:bg-yellow-600 transition-all duration-300 flex items-center"
          >
            🦊 Connect with MetaMask
          </button>
        ) : (
          <p className="text-green-400 font-bold text-lg mt-2">
            ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;
