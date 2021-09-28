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
        assert.equal(totalSupply.toNumber(), 1000000, 'sets correct total supply');
    })
})