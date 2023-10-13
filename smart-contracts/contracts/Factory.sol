// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NFT.sol";

contract Factory {
    event CollectionCreated(address collection, string name, string symbol);
    event TokenMinted(address collection, address recipient, uint256 tokenId, string tokenUri);

    function deployNFT(string memory name, string memory symbol) public returns (address) {
        NFT t = new NFT(name, symbol, msg.sender);
        
        emit CollectionCreated(address(t), name, symbol);

        return address(t);
    }

    function mintNFT(address _nftAddress, address _recipient, uint256 _tokenId) external {
        string memory uri = NFT(_nftAddress).safeMint(_recipient, _tokenId);
        emit TokenMinted(_nftAddress, _recipient, _tokenId, uri);
    }
}
