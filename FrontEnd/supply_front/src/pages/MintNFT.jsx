import { useState } from "react";
import { ethers } from "ethers";
import { useContract } from "../hooks/useContract";

const MintNFT = () => {
  const { contract, signer } = useContract();
  const [ipfsHash, setIpfsHash] = useState("");
  const [price, setPrice] = useState("");

  const mintNFT = async () => {
    if (!contract || !signer) {
      console.error("❌ Contract or signer not loaded!");
      return;
    }

    try {
      console.log("⏳ Minting NFT...");
      const tx = await contract.mintProductNFT(ipfsHash, ethers.parseEther(price));
      await tx.wait();
      console.log("✅ NFT Minted!", tx);
    } catch (error) {
      console.error("🚨 Minting Error:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold">Mint NFT</h2>
      <input
        type="text"
        placeholder="IPFS Hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        className="block w-full p-2 mt-2 bg-gray-800 text-white"
      />
      <input
        type="text"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="block w-full p-2 mt-2 bg-gray-800 text-white"
      />
      <button
        onClick={mintNFT}
        className="mt-4 bg-blue-500 px-4 py-2 rounded text-white"
      >
        Mint NFT
      </button>
    </div>
  );
};

export default MintNFT;
