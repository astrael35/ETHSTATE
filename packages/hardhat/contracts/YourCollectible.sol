// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YourCollectible is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
    mapping(uint256 => uint256) public assetPrices; // Maps tokenId to its price
    mapping(uint256 => bool) public listedForSale;  // Maps tokenId to sale status

    constructor() ERC721("YourCollectible", "YCB") {}

    // Mint a new item with a URI
    function mintItem(address to, string memory uri) public returns (uint256) {
        tokenIdCounter.increment();
        uint256 tokenId = tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // List an asset for sale with a specified price
    function listAssetForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "Only the owner can list this asset");
        require(_price > 0, "Price must be greater than zero");
        assetPrices[_tokenId] = _price;
        listedForSale[_tokenId] = true;
    }

    // Purchase an asset that is listed for sale
    function purchaseAsset(uint256 _tokenId) public payable {
        require(listedForSale[_tokenId], "This asset is not for sale");
        require(msg.value == assetPrices[_tokenId], "Incorrect price sent");

        address seller = ownerOf(_tokenId);
        require(seller != msg.sender, "You cannot purchase your own asset");

        // Transfer the token to the buyer
        _transfer(seller, msg.sender, _tokenId);

        // Transfer payment to the seller
        (bool success, ) = payable(seller).call{value: msg.value}("");
        require(success, "Transfer failed");

        // Update the asset status
        listedForSale[_tokenId] = false;
        assetPrices[_tokenId] = 0;
    }

    // Override required functions to support Enumerable and URI Storage extensions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, quantity);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
