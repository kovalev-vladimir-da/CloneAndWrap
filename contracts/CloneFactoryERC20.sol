// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";
import "./interfaces/IERC1155.sol";
import "./interfaces/IERC1155Receiver.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract CloneFactoryERC20 is ERC1155Holder {
    address immutable tokenImplementation;

    event CloneCreated(
        string indexed name,
        string indexed symbol,
        address clone
    );

    constructor(address _tokenImplementation) {
        tokenImplementation = _tokenImplementation;
    }

    function _createToken(string calldata name, string calldata symbol)
        internal
        returns (address clone)
    {
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        clone = Clones.cloneDeterministic(tokenImplementation, salt);
        IERC20(clone).initialize(name, symbol);
        emit CloneCreated(name, symbol, clone);
    }

    function wrap1155Token(
        address MultyToken,
        uint256 tokenId,
        uint256 amountDesired,
        string calldata name,
        string calldata symbol
    ) external returns (address wrapedToken) {
        require(
            IERC1155(MultyToken).balanceOf(msg.sender, tokenId) >=
                amountDesired,
            "Insufficient amount, fill up and try again"
        );

        IERC1155(MultyToken).setApprovalForAll(
            address(this),
             true
             );
        IERC1155(MultyToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amountDesired,
            "0x00"
        );

        wrapedToken = _createToken(name, symbol);

        IERC20(wrapedToken).mint(
            msg.sender,
            amountDesired
            );

        IERC1155(MultyToken).setApprovalForAll(address(this), false);
    }
}
