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
    // Mapping to store account's allowance (substitutes the mandatory "allowance" function).
    mapping(address => mapping(address => uint256)) public allowance;   // mapping structure: owner => { spender: value}

    // Event to be triggered when a transfer is made.
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );
    // Event to be triggered when a delegated transfer is approved.
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // Only runs when the contract is deployed.
    constructor(uint256 _totalSupply) public {
        // Allocate the initial total supply to the account that deploys the contract.
        balanceOf[msg.sender] = _totalSupply;
        // Set the total supply to the number given in the constructor's argument.
        totalSupply = _totalSupply;
    }

    // Transfer tokens from one account to another.
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Throws an exception if the sender doesn't own enough tokens.
        require(balanceOf[msg.sender] >= _value);
        // Deduct the value from sender and add it to receiver.
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        // Trigger a "Transfer" event.
        emit Transfer(msg.sender, _to, _value);
        // Return a boolean value (mandatory in ERC20 token protocol).
        return true;
    }

    // Approves a delegated transfer.
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // Set the spender's allowance.
        allowance[msg.sender][_spender] = _value;
        // Trigger an "Approve" event.
        emit Approval(msg.sender, _spender, _value);
        // Return a boolean value (mandatory in ERC20 token protocol).
        return true;
    }

    // Transfer tokens on behalf of another account.
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // Throws an exception if the transfer value's greater than the account's balance.
        require(balanceOf[_from] >= _value);
        // Throws an exception if the spender tries to transfer more than the value it's allowed to.
        require(allowance[_from][msg.sender] >= _value);

        // Deduct the value from sender and add it to receiver.
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        // Update the allowance.
        allowance[_from][msg.sender] -= _value;

        // Trigger a "Transfer" event.
        emit Transfer(_from, _to, _value);
        // Return a boolean value (mandatory in ERC20 token protocol).
        return true;
    }
}