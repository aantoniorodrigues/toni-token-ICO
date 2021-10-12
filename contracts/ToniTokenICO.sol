// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

// Import the ToniToken contract to use it on the ToniTokenICO contract.
import './ToniToken.sol';

contract ToniTokenICO {

    // Variable to store the administrator's address.
    address admin;      // not public because it's not to be exposed
    // Variable to store the token price.
    uint256 public tokenPrice;     // token price has to defined in wei

    // Contract type variable to store the ToniToken contract.
    ToniToken public tokenContract;

    // Only runs when contract is deployed.
    constructor(ToniToken _tokenContract, uint256 _tokenPrice) public {
        // Administrator will be the one deploying the contract.
        admin = msg.sender;
        // Access the ToniToken contract.
        tokenContract = _tokenContract;
        // Assign the token price.
        tokenPrice = _tokenPrice;
    }
}