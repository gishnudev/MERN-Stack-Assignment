import axios from "axios";

const PINATA_API_KEY = "f5d37a13dacda7434aa8";
const PINATA_SECRET_API_KEY = "8c3c7284549317b29114d59e1eee2536c378059da09644acbc424b77b46ebb78";
const PINATA_BASE_URL = "https://api.pinata.cloud/pinning/";

export async function uploadToIPFS(file, metadata) {
  try {
    // Upload the file first
    const formData = new FormData();
    formData.append("file", file);

    const fileUploadResponse = await axios.post(`${PINATA_BASE_URL}pinFileToIPFS`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const fileHash = fileUploadResponse.data.IpfsHash;
    console.log("🟢 File uploaded to IPFS:", fileHash);

    // Now upload metadata JSON
    const metadataJSON = {
      name: metadata.name,
      description: metadata.description,
      image: `https://ipfs.io/ipfs/${fileHash}`,
    };

    const metadataUploadResponse = await axios.post(`${PINATA_BASE_URL}pinJSONToIPFS`, metadataJSON, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    const metadataHash = metadataUploadResponse.data.IpfsHash;
    console.log("🟢 Metadata uploaded to IPFS:", metadataHash);

    return metadataHash;
  } catch (error) {
    console.error("🚨 Error uploading to IPFS:", error);
    throw new Error("IPFS upload failed");
  }
}
