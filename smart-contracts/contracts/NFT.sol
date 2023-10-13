// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    string private _uri;
    address public _factoryAddress;

    constructor(string memory name, string memory symbol, address newOwner) ERC721(name, symbol) {
        transferOwnership(newOwner);
        _factoryAddress = msg.sender;

        _uri = "http://example.com/";
    }

    function safeMint(address to, uint256 tokenId) public returns(string memory) {
        //I can keep a mapping in the Factory for the owners, and completely block access to all transactions on this contract...
        require(tx.origin == owner(), "Not owner of contract"); //yeah quick hack... 
        require(msg.sender == _factoryAddress, "Can mint only via factory"); //blocking direct access

        _safeMint(to, tokenId);

        return tokenURI(tokenId);
    }

    function setURI(string calldata uri) external onlyOwner {
        _uri = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }
}
