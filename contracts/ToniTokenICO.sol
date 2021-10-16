// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

// Import the token contract to use it on the ICO contract.
import './ToniToken.sol';

contract ToniTokenICO {

    // Variable to store the administrator's address.
    address admin;      // not public because it's not to be exposed
    // Variable to store the token price.
    uint256 public tokenPrice;     // token price has to defined in wei
    // Variable to store the number of tokens sold.
    uint256 public tokensSold;

    // Contract type variable to store the ToniToken contract.
    ToniToken public tokenContract;

    // To be triggered when tokens are sold.
    event Sell(
        address _buyer,
        uint256 _amount
    );

    // Only runs when contract is deployed.
    constructor(ToniToken _tokenContract, uint256 _tokenPrice) public {
        // Administrator will be the account deploying the contract.
        admin = msg.sender;
        // Access the ToniToken contract.
        tokenContract = _tokenContract;
        // Assign the token price.
        tokenPrice = _tokenPrice;
    }

    // Multiplies two numbers safely in solidity.
    // Copied from DS-Math library.
    // https://github.com/dapphub/ds-math
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // Allows an account to buy a number of tokens.
    function buyTokens(uint256 _numberOfTokens) public payable {    // "payable" to enable ether transactions
        // Correct ether value (in wei) of the required tokens.
        uint256 _correctValue = multiply(_numberOfTokens, tokenPrice);
        
        // Throws exception if the value the buyer is sending is different from the correct value.
        require(msg.value == _correctValue);
        // Throws exception if contract does not have enough tokens.
        require(_numberOfTokens <= tokenContract.balanceOf(address(this)));    // address(this) accesses this contract's address
        // Throws exception if no transfer was made.
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // Update the number of tokens sold.
        tokensSold += _numberOfTokens;
        
        // Emit a "Sell" event.
        emit Sell(msg.sender, _numberOfTokens);
    }

    // Ends the token sale (can only be called by the admin).
    function endSale() public {
        // Throws exception if function is not called by the admin.
        require(msg.sender == admin);
        // Transfer the remaining tokens to the admin.
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // Destroy the ICO contract when sale ends.
    }
}
