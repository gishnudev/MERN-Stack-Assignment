import { useState } from "react";
import { useMetaMask } from "../../hooks/useMetaMask";

const TransferProduct = () => {
  const { contract, account } = useMetaMask();
  const [recipient, setRecipient] = useState("");
  const [productId, setProductId] = useState("");

  const transferNFT = async () => {
    if (!contract || !account) return alert("Connect your wallet first!");

    try {
      const tx = await contract.transferProduct(productId, recipient);
      await tx.wait();
      alert("Product Transferred!");
    } catch (error) {
      console.error(error);
      alert("Transfer Failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold">Transfer Product</h2>
      <input 
        type="text" 
        placeholder="Product ID" 
        className="w-full p-3 bg-gray-700 rounded-md mb-4"
        value={productId} 
        onChange={(e) => setProductId(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Recipient Address" 
        className="w-full p-3 bg-gray-700 rounded-md mb-4"
        value={recipient} 
        onChange={(e) => setRecipient(e.target.value)} 
      />
      <button 
        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-700 rounded-lg text-lg font-semibold"
        onClick={transferNFT}
      >
        Transfer Product
      </button>
    </div>
  );
};

export default TransferProduct;
