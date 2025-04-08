const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SupplyChainDeployment", (m) => {
    // Deploy ERC-20 Token
    const token = m.contract("SupplyChainToken", []);

    // Deploy ERC-721 Contract
    const supplyChain = m.contract("ElectronicSupplyChain", []);

    // Assign Manufacturer and Distributor roles
    const manufacturer = m.getAccount(0); // Change if needed
    const distributor = m.getAccount(0); // Change if needed

    m.call(supplyChain, "addManufacturer", [manufacturer]);
    m.call(supplyChain, "addDistributor", [distributor]);

    // 🔥 Fix: Use ethers.parseUnits instead of calling parseUnits on the contract
    const { ethers } = require("hardhat");
    const initialMintAmount = ethers.parseUnits("1000", 18); 

    m.call(token, "mint", [manufacturer, initialMintAmount]);

    return { token, supplyChain };
});
