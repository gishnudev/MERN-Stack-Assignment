import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../config/contractConfig";

export function useContract() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum) {
        console.error("🔴 MetaMask not detected!");
        return;
      }

      try {
        console.log("🟢 MetaMask detected!");

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Signer = await web3Provider.getSigner();
        setProvider(web3Provider);
        setSigner(web3Signer);

        const contractInstance = new ethers.Contract(
          NFT_CONTRACT_ADDRESS,
          NFT_CONTRACT_ABI,
          web3Signer
        );

        setContract(contractInstance);
        console.log("✅ Contract Loaded Successfully!");

        // 🌟 Make it accessible globally
        window.contract = contractInstance;
      } catch (error) {
        console.error("🔴 Error setting up contract:", error);
      }
    };

    initContract();
  }, []);

  return { contract, signer, provider };
}
