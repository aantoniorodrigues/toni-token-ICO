// Creates an abstraction of the contracts to interact with it in a JavaScript environment.
let ToniToken = artifacts.require("ToniToken");
let ToniTokenICO = artifacts.require("ToniTokenICO");

module.exports = async (deployer) => {
  // Deploy ToniToken contract with 1M tokens of total supply.
  await deployer.deploy(ToniToken, 1000000);    // the extra arguments (100000) are passed to the contract's constructor
  
  // Define the Toni Token price to be 1e-12 ether so we can use it the ICO contract.
  let tokenPrice = 1000000;   // token price has to be defined in wei (1 wei = 1e-18 ETH)
  // Deploy ICO contract with the token address and the token price passed into the constructor.
  await deployer.deploy(ToniTokenICO, ToniToken.address, tokenPrice);
};