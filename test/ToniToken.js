let ToniToken = artifacts.require('ToniToken');

contract('ToniToken', (accounts) => {
    before(async () => {
        this.ToniToken = await ToniToken.deployed();
    })

    // Test to see if the smart contract is deployed correctly.
    it('deploys smart contract succesfully', async () => {
        // Get the smart contract's address.
        let address = await this.ToniToken.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    // Test to see if the total supply is correct.
    it('sets correct total supply of 1M tokens', async () => {
        // Get the smart contract's total supply.
        let totalSupply = await this.ToniToken.totalSupply();
        // Check if it's 1 million.
        assert.equal(totalSupply.toNumber(), 1000000, 'sets correct total supply');
    })

    // Test to see if the total supply was allocated to the creator's account.
    it('allocates total supply to correct account', async () => {
        // Get the account's balance of the contract's creator.
        let creatorBalance = await this.ToniToken.balanceOf(accounts[0]);
        // Check if it's set to 1 million tokens.
        assert.equal(creatorBalance.toNumber(), 1000000, 'initial supply correctly allocated');
    })

    // Test to see if the token's name and symbol are correct.
    it('sets name and symbol correctly', async () => {
        // Get token's name, symbol and standard.
        let name = await this.ToniToken.name();
        let symbol = await this.ToniToken.symbol();
        // Check if they have the correct values.
        assert.equal(name, 'ToniToken', 'token with the correct name');
        assert.equal(symbol, 'TT', 'token with the correct symbol');
    })
})