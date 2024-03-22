// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "hardhat/console.sol";

contract CloneFactoryERC20 {
    address immutable tokenImplementation;

    event CloneCreated(string indexed name, string indexed symbol, address clone);

    constructor(address _tokenImplementation) {
        tokenImplementation = _tokenImplementation;
    }

    function createToken(string calldata name, string calldata symbol)
        external 
        returns (address clone)
    {
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        clone = Clones.cloneDeterministic(tokenImplementation, salt);
        IERC20(clone).initialize(name, symbol);
        emit CloneCreated(name, symbol, clone);
    }
}
