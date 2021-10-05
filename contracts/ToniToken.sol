// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ToniToken {

    // Variable to store the total number of tokens.
    uint256 public totalSupply;
    // Variables to store the token's name, symbol and standard.
    string public name = 'ToniToken';
    string public symbol = 'TT';

    // Mapping to store account's balances (substitutes the mandatory "balanceOf" function).
    mapping(address => uint256) public balanceOf;

    // Only runs when the contract is deployed.
    constructor(uint256 _totalSupply) public {
        // Allocate the initial total supply to the account that deploys the contract.
        balanceOf[msg.sender] = _totalSupply;
        // Set the total supply to the number given in the constructor's argument.
        totalSupply = _totalSupply;
    }

}