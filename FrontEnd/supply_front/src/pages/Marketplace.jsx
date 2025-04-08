// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { useMetaMask } from "../../hooks/useMetaMask";

// const Marketplace = () => {
//   const { account, isConnected, connectWallet, getNFTContract } = useMetaMask();
//   const [contract, setContract] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [buying, setBuying] = useState(null);
//   const [userRole, setUserRole] = useState(null); // Stores user role (Distributor or Buyer)

//   // 🏷️ LocalStorage Helpers for Status Tracking
//   const getStoredStatus = (productId) => {
//     return localStorage.getItem(`product_status_${productId}`) || "Pending";
//   };

//   const setStoredStatus = (productId, status) => {
//     localStorage.setItem(`product_status_${productId}`, status);
//   };

//   useEffect(() => {
//     if (isConnected) {
//       const nftContract = getNFTContract();
//       if (nftContract) {
//         setContract(nftContract);
//         fetchUserRole(); // Fetch user role when connected
//       } else {
//         setError("❌ Failed to load contract.");
//       }
//     }
//   }, [isConnected]);

//   // 🔹 Fetch User Role (Distributor or Buyer)
//   const fetchUserRole = async () => {
//   if (!contract || !account) return;
//   try {
//     const DISTRIBUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR"));
//     const isDistributor = await contract.hasRole(DISTRIBUTOR_ROLE, account);
//     if (!isDistributor) {
//       alert("❌ You are not a Distributor!");
//       return;
//     }
//   } catch (error) {
//     console.error("⚠️ Error fetching role:", error);
//   }
// };


//   // 🔹 Fetch NFTs from the blockchain
//   const fetchNFTs = async () => {
//     if (!contract) {
//       setError("❌ Contract not connected!");
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log("⏳ Fetching NFTs from blockchain...");
//       const mintEvents = await contract.queryFilter(contract.filters.ProductMinted());

//       if (!mintEvents.length) {
//         setError("⚠️ No products found.");
//         setLoading(false);
//         return;
//       }

//       let nfts = [];

//       for (let event of mintEvents) {
//         try {
//           const { productId, manufacturer, ipfsHash, price } = event.args;

//           const owner = await contract.ownerOf(productId);
//           const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.replace("ipfs://", "")}`;

//           console.log(`🌐 Fetching metadata from: ${ipfsUrl}`);
//           const response = await fetch(ipfsUrl);
//           if (!response.ok) throw new Error("IPFS fetch failed");

//           const metadata = await response.json();

//           const nft = {
//             id: BigInt(productId).toString(),
//             name: metadata.name || "Unknown Product",
//             image: metadata.image || "https://via.placeholder.com/150",
//             description: metadata.description || "No description available.",
//             price: ethers.formatEther(price),
//             owner,
//             manufacturer,
//             status: getStoredStatus(productId), // Load status from localStorage
//           };

//           nfts.push(nft);
//         } catch (err) {
//           console.warn(`⚠️ Token fetch failed:`, err);
//         }
//       }

//       setProducts(nfts);
//       setLoading(false);
//     } catch (err) {
//       console.error("🚨 Error fetching NFTs:", err);
//       setError("❌ Error fetching NFTs");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (contract) fetchNFTs();
//   }, [contract]);

//   // ✅ Buy NFT Function
//   const buyNFT = async (productId, price) => {
//     if (!account) return alert("⚠️ Connect your wallet first!");

//     if (!contract) return alert("❌ Contract is not initialized!");

//     setBuying(productId); // Show loading state
//     try {
//       const tx = await contract.buyProduct(productId, {
//         value: ethers.parseEther(price.toString()), // Convert price to Ether
//       });
//       await tx.wait();
//       alert("🎉 Purchase Successful!");
//       fetchNFTs(); // Refresh UI
//     } catch (error) {
//       console.error("🚨 Transaction failed:", error);
//       alert("❌ Transaction Failed!");
//     }
//     setBuying(null); // Reset loading state
//   };

//   // ✅ Distributor: Update Status
//   const updateStatus = async (productId, newStatus) => {
//     setStoredStatus(productId, newStatus);
//     fetchNFTs(); // Refresh UI
//     alert(`✅ Product ${productId} marked as ${newStatus}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">🛒 Marketplace</h1>

//       {!isConnected && (
//         <button
//           className="mb-6 px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg font-semibold"
//           onClick={connectWallet}
//         >
//           🔗 Connect Wallet
//         </button>
//       )}

//       {loading && <p className="text-yellow-400">⏳ Loading products...</p>}
//       {error && <p className="text-red-400">{error}</p>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((nft) => (
//           <div key={nft.id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
//             <img
//               src={nft.image || "https://via.placeholder.com/150"}
//               alt={nft.name}
//               className="w-full h-48 object-cover rounded-md"
//               onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
//             />
//             <h3 className="text-xl font-bold mt-3">{nft.name}</h3>
//             <p className="text-gray-400 text-sm">{nft.description}</p>
//             <p className="mt-2 font-bold text-green-400">💰 {nft.price} ETH</p>
//             <p className="text-sm text-gray-300">👤 Owner: {nft.owner}</p>
//             <p className="text-sm text-gray-300">🏭 Manufacturer: {nft.manufacturer}</p>
//             <p className={`mt-2 font-bold ${nft.status === "Delivered" ? "text-green-500" : "text-yellow-500"}`}>
//               📦 Status: {nft.status || "Pending"}
//             </p>

//             <button
//               className={`mt-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg w-full ${
//                 buying === nft.id ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               onClick={() => buyNFT(nft.id, nft.price)}
//               disabled={buying === nft.id}
//             >
//               {buying === nft.id ? "Processing..." : "Buy Product"}
//             </button>

//             {/* Distributor-Only Buttons */}
//             {userRole === "DISTRIBUTOR" && (
//               <div>
//                 <button
//                   className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
//                   onClick={() => updateStatus(nft.id, "Shipped")}
//                 >
//                   🚚 Mark as Shipped
//                 </button>

//                 <button
//                   className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-full"
//                   onClick={() => updateStatus(nft.id, "Delivered")}
//                 >
//                   ✅ Mark as Delivered
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Marketplace;


import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../../hooks/useMetaMask";

const Marketplace = () => {
  const { account, isConnected, connectWallet, getNFTContract } = useMetaMask();
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buying, setBuying] = useState(null);

  useEffect(() => {
    if (isConnected) {
      const nftContract = getNFTContract();
      if (nftContract) {
        setContract(nftContract);
        fetchNFTs(nftContract);
      } else {
        setError("❌ Failed to load contract.");
      }
    }
  }, [isConnected]);

  // 🎯 Live Event Listener for ProductDelivered
  useEffect(() => {
    if (!contract) return;

    const handleStatusUpdate = (productId) => {
      console.log(`📦 Product Delivered | Product ID: ${productId}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId.toString() ? { ...p, status: "Delivered" } : p
        )
      );
    };

    contract.on("ProductDelivered", handleStatusUpdate);
    return () => contract.off("ProductDelivered", handleStatusUpdate);
  }, [contract]);

  // ✅ Improved status checker
  const fetchLatestStatusFromEvents = async (contract, productId) => {
    try {
      const events = await contract.queryFilter(contract.filters.ProductDelivered());
      const delivered = events.some(
        (event) => event.args?.productId?.toString() === productId.toString()
      );
      return delivered ? "Delivered" : "Pending";
    } catch (err) {
      console.warn(`⚠️ Failed to check delivery status for product ${productId}`, err);
      return "Pending";
    }
  };

  const fetchNFTs = async (nftContract) => {
    if (!nftContract) return;
    try {
      setLoading(true);
      const mintEvents = await nftContract.queryFilter(nftContract.filters.ProductMinted());

      if (!mintEvents.length) {
        setError("⚠️ No products found.");
        setLoading(false);
        return;
      }

      const productData = await Promise.all(
        mintEvents.map(async (event) => {
          try {
            const { productId, manufacturer, ipfsHash, price } = event.args;
            const owner = await nftContract.ownerOf(productId);
            const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.replace("ipfs://", "")}`;
            const res = await fetch(ipfsUrl);
            const metadata = await res.json();
            const status = await fetchLatestStatusFromEvents(nftContract, productId);

            return {
              id: BigInt(productId).toString(),
              name: metadata.name || "Unknown Product",
              image: metadata.image || "https://via.placeholder.com/150",
              description: metadata.description || "No description available.",
              price: ethers.formatEther(price),
              owner,
              manufacturer,
              status,
            };
          } catch (err) {
            console.warn("⚠️ Failed to load product metadata", err);
            return null;
          }
        })
      );

      setProducts(productData.filter(Boolean));
    } catch (err) {
      console.error("🚨 Error fetching NFTs:", err);
      setError("❌ Error fetching NFTs");
    } finally {
      setLoading(false);
    }
  };

  const buyNFT = async (productId, price) => {
    if (!account) return alert("⚠️ Connect your wallet first!");
    if (!contract) return alert("❌ Contract not initialized!");

    setBuying(productId);
    try {
      const tx = await contract.buyProduct(productId, {
        value: ethers.parseEther(price.toString()),
      });
      await tx.wait();
      alert("🎉 Purchase Successful!");
      fetchNFTs(contract); // refresh list and statuses
    } catch (err) {
      console.error("🚨 Transaction failed:", err);
      alert("❌ Transaction Failed!");
    }
    setBuying(null);
  };

  const availableProducts = products.filter(
    (nft) => nft.owner.toLowerCase() !== account?.toLowerCase()
  );
  const ownedProducts = products.filter(
    (nft) => nft.owner.toLowerCase() === account?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🛒 Marketplace</h1>

      {!isConnected && (
        <button
          className="mb-6 px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg font-semibold"
          onClick={connectWallet}
        >
          🔗 Connect Wallet
        </button>
      )}

      {loading && <p className="text-yellow-400">⏳ Loading products...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Available Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🆕 Available Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableProducts.map((nft) => (
            <div key={nft.id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-48 object-cover rounded-md"
                onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
              />
              <h3 className="text-xl font-bold mt-3">{nft.name}</h3>
              <p className="text-gray-400 text-sm">{nft.description}</p>
              <p className="mt-2 font-bold text-green-400">💰 {nft.price} ETH</p>
              <p className="text-sm text-gray-300">🏭 Manufacturer: {nft.manufacturer}</p>
              <p className="text-sm text-yellow-300">📦 Status: {nft.status}</p>
              <button
                className={`mt-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg w-full ${
                  buying === nft.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => buyNFT(nft.id, nft.price)}
                disabled={buying === nft.id}
              >
                {buying === nft.id ? "Processing..." : "Buy Product"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Purchased Products */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📦 Your Purchased Products</h2>
        {ownedProducts.length === 0 ? (
          <p className="text-gray-400">You haven’t purchased any products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedProducts.map((nft) => (
              <div key={nft.id} className="bg-gray-700 rounded-lg p-4 shadow">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
                <h3 className="text-xl font-bold mt-3">{nft.name}</h3>
                <p className="text-sm text-gray-400">{nft.description}</p>
                <p className="mt-2 font-bold text-green-400">💰 {nft.price} ETH</p>
                <p className="text-sm text-yellow-300">📦 Status: {nft.status}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Marketplace;
