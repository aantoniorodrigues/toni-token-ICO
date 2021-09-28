// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ToniToken {

    // Variable to store the total number of tokens.
    uint256 public totalSupply;

    constructor() public {
        // Set the total supply to one million tokens.
        totalSupply = 1000000;
    }
}