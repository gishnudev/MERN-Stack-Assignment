export const NFT_CONTRACT_ADDRESS = "0x09B4673108909a5541DB20D8D9B2Ed140b4d2f03";
export const TOKEN_CONTRACT_ADDRESS = "0x0628394106BCef18bF9Eabbacd8FcEb7b29Fd1f9";

import NFT_ABI from "../src/ElectronicSupplyChain.json";  // NFT contract JSON
import TOKEN_ABI from "../src/SupplyChainToken.json";  // ERC-20 contract JSON

export const NFT_CONTRACT_ABI = NFT_ABI.abi;  // ✅ Extract only the `.abi` part
export const TOKEN_CONTRACT_ABI = TOKEN_ABI.abi;  // ✅ Extract only the `.abi` part
