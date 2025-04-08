import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  NFT_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  TOKEN_CONTRACT_ABI,
} from "../config/contractConfig";

export function useMetaMask() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          console.log("🚀 Provider initialized:", web3Provider); // Before setting state
          setProvider(web3Provider);
  
          const web3Signer = await web3Provider.getSigner();
          console.log("✅ Signer initialized:", web3Signer); // Before setting state
          setSigner(web3Signer);
        } catch (error) {
          console.error("❌ Error initializing MetaMask:", error);
        }
      } else {
        console.error("❌ MetaMask is not installed!");
      }
    };
    init();
  }, []);
  

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("🦊 MetaMask is not installed! Please install it.");
    }
  };

  // Function to create NFT contract instance
  const getNFTContract = () => {
    if (!signer) return null;
    return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  };

  // Function to create ERC-20 contract instance
  const getTokenContract = () => {
    if (!signer) return null;
    return new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
  };

  return { 
    account, 
    isConnected, 
    connectWallet, 
    getNFTContract, 
    getTokenContract 
  };
}
