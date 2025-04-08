import { useEffect, useState } from "react";
import { useContract } from "../../hooks/useContract";

const ContractTest = () => {
  const { contract, signer } = useContract();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const testBalance = async () => {
        if (contract && signer) {
          try {
            const ownerAddress = await signer.getAddress();
            console.log("Testing balanceOf for:", ownerAddress);
            const nftBalance = await contract.balanceOf(ownerAddress);
            console.log(`🎉 NFT Balance: ${nftBalance}`);
          } catch (error) {
            console.error("🚨 balanceOf Error:", error);
          }
        }
      };
      
      testBalance();
      
  }, [contract, signer]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold">🛠 Contract Test</h2>
      <p>📜 Contract Loaded at: {contract?.target}</p>
      <p>🔹 Signer Address: {signer?.address}</p>
      {balance !== null ? (
        <p>🖼️ Your NFT Balance: {balance}</p>
      ) : (
        <p>⌛ Fetching NFT Balance...</p>
      )}
    </div>
  );
};

export default ContractTest;
