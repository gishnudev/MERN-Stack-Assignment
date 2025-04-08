// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ElectronicSupplyChain is ERC721URIStorage, AccessControl {
    using Strings for uint256;

    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR");

    uint256 private _tokenIdCounter = 1; // Start from 1

    mapping(uint256 => uint256) public productPrices;

    event ProductMinted(uint256 productId, address manufacturer, string ipfsHash, uint256 price);
    event OwnershipTransferred(uint256 productId, address from, address to);
    event ProductDelivered(uint256 productId, string status);
    event PaymentReceived(uint256 productId, address buyer, uint256 amount);

    constructor() ERC721("ElectronicSupplyChain", "ESC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function addManufacturer(address manufacturer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MANUFACTURER_ROLE, manufacturer);
    }

    function addDistributor(address distributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DISTRIBUTOR_ROLE, distributor);
    }

    function mintProductNFT(string memory _ipfsHash, uint256 _price) public onlyRole(MANUFACTURER_ROLE) returns (uint256) {
        uint256 newProductId = _tokenIdCounter++;
        _mint(msg.sender, newProductId);
        _setTokenURI(newProductId, _ipfsHash);
        productPrices[newProductId] = _price;

        emit ProductMinted(newProductId, msg.sender, _ipfsHash, _price);
        return newProductId;
    }

    function buyProduct(uint256 productId) external payable {
        require(msg.value == productPrices[productId], "Incorrect ETH amount sent");
        address seller = ownerOf(productId);
        payable(seller).transfer(msg.value);

        emit PaymentReceived(productId, msg.sender, msg.value);
        _transfer(seller, msg.sender, productId);
        emit OwnershipTransferred(productId, seller, msg.sender);
    }

    function transferProduct(uint256 productId, address to) public onlyRole(DISTRIBUTOR_ROLE) {
        require(ownerOf(productId) == msg.sender, "You are not the owner");
        _transfer(msg.sender, to, productId);
        emit OwnershipTransferred(productId, msg.sender, to);
    }

    function confirmDelivery(uint256 productId, string memory status) public onlyRole(DISTRIBUTOR_ROLE) {
        emit ProductDelivered(productId, status);
    }
}
