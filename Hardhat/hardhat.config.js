require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  // defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {},
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_RPC_URL}` ,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  solidity: "0.8.20",
};
