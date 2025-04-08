import { useState } from "react";
import { ethers } from "ethers"; // ✅ Import ethers
import { useMetaMask } from "../../hooks/useMetaMask";

const BuyProduct = ({ productId, price }) => {
  const { contract, account } = useMetaMask();
  const [loading, setLoading] = useState(false);

  const buyNFT = async () => {
    if (!contract || !account) {
      alert("❌ Connect your wallet first!");
      return;
    }

    setLoading(true);
    try {
      console.log(`💰 Purchasing product ID: ${productId} for ${price} ETH...`);

      // ✅ Ensure price is a valid string before parsing
      const transaction = await contract.purchaseProduct(productId, {
        value: ethers.parseEther(price.toString()),
      });

      await transaction.wait();
      alert("🎉 Purchase Successful!");
    } catch (error) {
      console.error("🚨 Transaction failed:", error);
      alert("❌ Transaction Failed!");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold">Buy Product</h2>
      <button 
        className={`mt-6 px-6 py-3 bg-green-500 hover:bg-green-700 rounded-lg text-lg font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={buyNFT}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>
    </div>
  );
};

export default BuyProduct;
