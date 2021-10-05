// Creates an abstraction of the contract to interact with it in a JavaScript environment.
const ToniToken = artifacts.require("ToniToken");

module.exports = function (deployer) {
  deployer.deploy(ToniToken, 1000000);    // the extra arguments are passed to the constructor
};