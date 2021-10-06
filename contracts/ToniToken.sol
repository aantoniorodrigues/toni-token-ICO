// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract ToniToken {

    // Variable to store the total number of tokens.
    uint256 public totalSupply;
    // Variables to store the token's name and symbol.
    string public name = 'ToniToken';
    string public symbol = 'TT';

    // Mapping to store account's balances (substitutes the mandatory "balanceOf" function).
    mapping(address => uint256) public balanceOf;

    // Event to be triggered when a transfer is made.
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Only runs when the contract is deployed.
    constructor(uint256 _totalSupply) public {
        // Allocate the initial total supply to the account that deploys the contract.
        balanceOf[msg.sender] = _totalSupply;
        // Set the total supply to the number given in the constructor's argument.
        totalSupply = _totalSupply;
    }

    // Function to transfer tokens from one account to another.
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Throws an exception if the sender doesn't have enough tokens.
        require(balanceOf[msg.sender] >= _value);
        //Deduct the value from sender and add it to receiver.
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        // Trigger a transfer event.
        emit Transfer(msg.sender, _to, _value);
        // Return the boolean value (mandatory in ERC20 protocol).
        return true;
    }

}