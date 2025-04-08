// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChainToken is ERC20, Ownable {
    constructor() ERC20("SupplyChainToken", "SCT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint initial supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
