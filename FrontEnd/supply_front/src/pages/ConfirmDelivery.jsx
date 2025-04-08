import { useState } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";

const ConfirmDelivery = () => {
  const { contract, account } = useMetaMask();
  const [productId, setProductId] = useState("");
  const [status, setStatus] = useState("");

  const confirmDelivery = async () => {
    if (!contract || !account) return alert("Connect your wallet first!");

    try {
      const tx = await contract.confirmDelivery(productId, status);
      await tx.wait();
      alert("Delivery Confirmed!");
    } catch (error) {
      console.error(error);
      alert("Confirmation Failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold">Confirm Delivery</h2>
      <input 
        type="text" 
        placeholder="Product ID" 
        className="w-full p-3 bg-gray-700 rounded-md mb-4"
        value={productId} 
        onChange={(e) => setProductId(e.target.value)} 
      />
      <button 
        className="px-6 py-3 bg-green-500 hover:bg-green-700 rounded-lg text-lg font-semibold"
        onClick={confirmDelivery}
      >
        Confirm Delivery
      </button>
    </div>
  );
};

export default ConfirmDelivery;
