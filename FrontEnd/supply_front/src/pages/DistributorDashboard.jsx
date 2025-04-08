// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { useMetaMask } from "../../hooks/useMetaMask";

// const DistributorDashboard = () => {
//   const { account, isConnected, getNFTContract } = useMetaMask();
//   const [contract, setContract] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     console.log("✅ MetaMask Connection:", isConnected);
//     if (isConnected) {
//       const nftContract = getNFTContract();
//       console.log("✅ NFT Contract Instance:", nftContract);
//       if (nftContract) {
//         setContract(nftContract);
//       }
//     }
//   }, [isConnected]);

//   // 🔹 Fetch NFTs from the blockchain
//   const fetchNFTs = async () => {
//     if (!contract) {
//       console.error("❌ Contract not connected!");
//       setError("❌ Contract not connected!");
//       setLoading(false);
//       return;
//     }
  
//     try {
//       console.log("⏳ Fetching NFTs from blockchain...");
//       const mintEvents = await contract.queryFilter(contract.filters.ProductMinted());
  
//       console.log(`📝 Mint Events Found: ${mintEvents.length}`);
  
//       if (!mintEvents.length) {
//         setError("⚠️ No products found.");
//         setLoading(false);
//         return;
//       }
  
//       let nfts = [];
  
//       for (let event of mintEvents) {
//         try {
//           const { productId, manufacturer, ipfsHash, price } = event.args;
//           console.log(`🔹 Processing Product #${productId}`);
  
//           // 🔍 Check if owner exists
//           const owner = await contract.ownerOf(productId);
//           console.log(`👤 Owner of Product #${productId}: ${owner}`);
  
//           // 🌐 Fetch metadata from IPFS
//           const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.replace("ipfs://", "")}`;
//           console.log(`🌐 Fetching metadata from: ${ipfsUrl}`);
  
//           const response = await fetch(ipfsUrl);
//           if (!response.ok) throw new Error(`IPFS fetch failed for ${ipfsUrl}`);
  
//           const metadata = await response.json();
  
//           console.log(`📜 Metadata for #${productId}:`, metadata);
  
//           nfts.push({
//             id: BigInt(productId).toString(),
//             name: metadata.name || "Unknown Product",
//             image: metadata.image || "https://via.placeholder.com/150",
//             description: metadata.description || "No description available.",
//             price: ethers.formatEther(price),
//             owner,
//             manufacturer,
//             status: localStorage.getItem(`product_status_${productId}`) || "Pending",
//           });
//         } catch (err) {
//           console.warn(`⚠️ Token fetch failed:`, err);
//         }
//       }
  
//       console.log("✅ Final Product List:", nfts);
  
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

//   // 📦 Update Product Status
//   const updateStatus = async () => {
//     if (!contract || !selectedProduct || !status) {
//       alert("⚠️ Please select a product and enter a status.");
//       return;
//     }

//     try {
//       console.log(`📝 Updating status for Product ${selectedProduct}...`);
//       const tx = await contract.confirmDelivery(selectedProduct, status);
//       await tx.wait();
//       alert("✅ Status Updated Successfully!");
//       localStorage.setItem(`product_status_${selectedProduct}`, status);
//     } catch (err) {
//       console.error("🚨 Error updating status:", err);
//       alert("❌ Status Update Failed!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-3xl font-bold mb-6">🚚 Distributor Dashboard</h1>

//       {loading && <p className="text-yellow-400">⏳ Loading your products...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="mb-4">
//         <label className="block text-lg">Select a Product:</label>
//         <select
//           className="w-full p-2 text-black rounded"
//           onChange={(e) => setSelectedProduct(e.target.value)}
//         >
//           <option value="">-- Choose Product --</option>
//           {products.map((p) => (
//             <option key={p.id} value={p.id}>
//               {p.name} (#{p.id})
//             </option>
//           ))}
//         </select>
//       </div>

//       <input
//         type="text"
//         placeholder="Enter Delivery Status"
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//         className="w-full p-2 text-black rounded mb-4"
//       />

//       <button
//         onClick={updateStatus}
//         className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-700"
//       >
//         📦 Update Status
//       </button>
//     </div>
//   );
// };

// export default DistributorDashboard;


import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../../hooks/useMetaMask";

const DistributorDashboard = () => {
  const { account, isConnected, connectWallet, getNFTContract } = useMetaMask();
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);

  // 🧠 Generate unique localStorage key for each product
  const getStatusKey = (productId, ipfsHash) =>
    `product_status_${productId}_${ipfsHash?.slice(-6)}`;

  const getStoredStatus = (productId, ipfsHash) => {
    return localStorage.getItem(getStatusKey(productId, ipfsHash)) || "Pending";
  };

  const setStoredStatus = (productId, ipfsHash, status) => {
    localStorage.setItem(getStatusKey(productId, ipfsHash), status);
  };

  useEffect(() => {
    if (isConnected) {
      const nftContract = getNFTContract();
      if (nftContract) {
        console.log("Contract loaded successfully");
        setContract(nftContract);
        fetchUserRole(nftContract);
      } else {
        console.error("Failed to load contract");
        setError("❌ Failed to load contract.");
        setLoading(false);
      }
    }
  }, [isConnected, account]);

  const fetchUserRole = async (nftContract) => {
    if (!nftContract || !account) return;
    try {
      console.log("Fetching user role...");
      const DISTRIBUTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DISTRIBUTOR"));
      const isDistributor = await nftContract.hasRole(DISTRIBUTOR_ROLE, account);
      setUserRole(isDistributor ? "DISTRIBUTOR" : "BUYER");

      if (isDistributor) {
        fetchNFTs(nftContract);
      } else {
        setError("❌ You are not authorized as a distributor");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching role:", error);
      setError("⚠️ Error verifying distributor role");
      setLoading(false);
    }
  };

  const fetchNFTs = async (nftContract) => {
    if (!nftContract) {
      setError("❌ Contract not connected!");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching NFTs...");
      setLoading(true);
      setError("");

      const mintEvents = await nftContract.queryFilter(nftContract.filters.ProductMinted());
      console.log("Found mint events:", mintEvents.length);

      if (!mintEvents.length) {
        setError("⚠️ No products found.");
        setLoading(false);
        return;
      }

      const productPromises = mintEvents.map(async (event) => {
        try {
          const { productId, manufacturer, ipfsHash, price } = event.args;
          const owner = await nftContract.ownerOf(productId);
          const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash.replace("ipfs://", "")}`;

          const response = await fetch(ipfsUrl);
          if (!response.ok) throw new Error("IPFS fetch failed");

          const metadata = await response.json();

          const status = getStoredStatus(productId, ipfsHash);

          return {
            id: productId.toString(),
            name: metadata.name || `Product ${productId}`,
            image: metadata.image || "https://via.placeholder.com/150",
            description: metadata.description || "No description available",
            price: ethers.formatEther(price),
            owner,
            manufacturer,
            ipfsHash,
            status,
          };
        } catch (err) {
          console.warn("Failed to process product:", err);
          return null;
        }
      });

      const products = (await Promise.all(productPromises)).filter(Boolean);
      setProducts(products);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("❌ Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (productId, ipfsHash, newStatus) => {
    if (!contract || !account) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const tx = await contract.confirmDelivery(productId, newStatus);
      await tx.wait();

      setStoredStatus(productId, ipfsHash, newStatus);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, status: newStatus } : p
        )
      );
      alert(`✅ Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update failed:", err);
      alert(`❌ Failed to update status: ${err.message}`);
    }
  };

  const resetStatuses = () => {
    products.forEach((p) =>
      localStorage.removeItem(getStatusKey(p.id, p.ipfsHash))
    );
    alert("♻️ Statuses reset — please refresh");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">🚚 Distributor Dashboard</h1>
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-700 rounded-lg text-lg"
        >
          🔗 Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">🚚 Distributor Dashboard</h1>
        <p className="text-yellow-400">⏳ Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">🚚 Distributor Dashboard</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-700 rounded-lg"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚚 Distributor Dashboard</h1>
        <button
          onClick={resetStatuses}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
        >
          ♻️ Reset Statuses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
              onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
            />
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-gray-400 text-sm mt-2">{product.description}</p>
            <p className="mt-2 text-green-400">💰 {product.price} ETH</p>
            <p className="text-sm text-gray-300">Owner: {product.owner}</p>
            <p className="text-sm text-gray-300">Manufacturer: {product.manufacturer}</p>

            <p
              className={`mt-2 font-bold ${
                product.status === "Delivered"
                  ? "text-green-500"
                  : product.status === "Shipped"
                  ? "text-blue-500"
                  : "text-yellow-500"
              }`}
            >
              📦 Status: {product.status}
            </p>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => updateStatus(product.id, product.ipfsHash, "Shipped")}
                className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg"
              >
                🚚 Mark as Shipped
              </button>
              <button
                onClick={() => updateStatus(product.id, product.ipfsHash, "Delivered")}
                className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg"
              >
                ✅ Mark as Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributorDashboard;
