// Creates an abstraction of the contract to interact with it in a JavaScript environment.
const ToniToken = artifacts.require("ToniToken");

module.exports = function (deployer) {
  deployer.deploy(ToniToken);
};