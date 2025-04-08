// import { ethers } from "ethers";
// import { useState } from "react";
// import { useContract } from "../../hooks/useContract";
// import { uploadToIPFS } from "../../hooks/uploadToIPFS";

// const Dashboard = () => {
//   const { contract, signer } = useContract();
//   const [file, setFile] = useState(null);
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const mintNFT = async () => {
//     if (!contract || !signer || !file || !name || !description || !price) {
//       alert("⚠ Please fill all fields and upload a file.");
//       return;
//     }

//     try {
//       console.log("⏳ Uploading to IPFS...");
//       const ipfsHash = await uploadToIPFS(file, { name, description });

//       console.log("🔹 Minting NFT with IPFS Hash:", ipfsHash);
//       const tx = await contract.mintProductNFT(ipfsHash, ethers.parseEther(price));
//       await tx.wait();

//       alert("🎉 NFT Minted Successfully!");
//     } catch (error) {
//       console.error("🚨 Error minting NFT:", error);
//       alert("⚠ NFT Minting Failed!");
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//   <h1 className="text-3xl font-bold text-center">🛠️ Mint Your NFT</h1>

//   <div className="max-w-lg mx-auto mt-6 p-4 border rounded-lg shadow-lg bg-gray-100">
//     <input 
//       type="file" 
//       onChange={handleFileChange} 
//       className="mb-2 w-full p-2 border border-gray-300 rounded bg-white text-black"
//     />
    
//     <input 
//       type="text" 
//       placeholder="Name" 
//       value={name} 
//       onChange={(e) => setName(e.target.value)} 
//       className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
//     />
    
//     <textarea 
//       placeholder="Description" 
//       value={description} 
//       onChange={(e) => setDescription(e.target.value)} 
//       className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
//     ></textarea>
    
//     <input 
//       type="text" 
//       placeholder="Price in ETH" 
//       value={price} 
//       onChange={(e) => setPrice(e.target.value)} 
//       className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
//     />

//     <button 
//       onClick={mintNFT} 
//       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-full"
//     >
//       🚀 Mint NFT
//     </button>
//   </div>
// </div>

//   );
// };

// export default Dashboard;

import { ethers } from "ethers";
import { useState } from "react";
import { useContract } from "../../hooks/useContract";
import { uploadToIPFS } from "../../hooks/uploadToIPFS";

const Dashboard = () => {
  const { contract, signer } = useContract();
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const mintNFT = async () => {
    if (!contract || !signer || !file || !name || !description || !price) {
      alert("⚠ Please fill all fields and upload a file.");
      return;
    }

    try {
      const parsedPrice = ethers.parseEther(price);
      if (parsedPrice <= 0n) {
        alert("⚠ Price must be greater than zero.");
        return;
      }

      console.log("⏳ Uploading to IPFS...");
      const ipfsHash = await uploadToIPFS(file, { name, description });

      console.log("🟢 File uploaded to IPFS:", ipfsHash);
      console.log("🔹 Minting NFT with IPFS Hash:", ipfsHash);

      const MANUFACTURER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MANUFACTURER"));
      const account = await signer.getAddress();
      const isManufacturer = await contract.hasRole(MANUFACTURER_ROLE, account);

      if (!isManufacturer) {
        alert("❌ You are not a MANUFACTURER. Cannot mint.");
        return;
      }

      const tx = await contract.mintProductNFT(ipfsHash, parsedPrice);
      await tx.wait();

      alert("🎉 NFT Minted Successfully!");
    } catch (error) {
      console.error("🚨 Error minting NFT:", error);
      alert("⚠ NFT Minting Failed! Check console for details.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">🛠️ Mint Your NFT</h1>

      <div className="max-w-lg mx-auto mt-6 p-4 border rounded-lg shadow-lg bg-gray-100">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2 w-full p-2 border border-gray-300 rounded bg-white text-black"
        />

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
        ></textarea>

        <input
          type="text"
          placeholder="Price in ETH"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded bg-white text-black placeholder-gray-500 mb-2"
        />

        <button
          onClick={mintNFT}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-full"
        >
          🚀 Mint NFT
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
