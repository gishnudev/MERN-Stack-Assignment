import { useState } from "react";
import { useMetaMask } from "../hooks/useMetaMask";

const MintProduct = () => {
  const { contract } = useMetaMask();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const mintNFT = async () => {
    if (!contract) return alert("Smart contract not connected!");

    try {
      const tx = await contract.mintProductNFT(name, price);
      await tx.wait();
      alert("Product NFT Minted!");
    } catch (error) {
      console.error(error);
      alert("Minting failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold">Mint New Product</h2>
      <div className="mt-6 w-1/3">
        <input 
          type="text" 
          placeholder="Product Name" 
          className="w-full p-3 bg-gray-700 rounded-md mb-4"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Price (ETH)" 
          className="w-full p-3 bg-gray-700 rounded-md mb-4"
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
        />
        <button 
          className="px-6 py-3 bg-green-500 hover:bg-green-700 rounded-lg text-lg font-semibold"
          onClick={mintNFT}
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
};

export default MintProduct;
