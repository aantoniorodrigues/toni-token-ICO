let ToniTokenICO = artifacts.require('ToniTokenICO');

contract('ToniTokenICO', (accounts) => {
    before(async () => {
        this.ToniTokenICO = await ToniTokenICO.deployed();
    })

    it('deploys the smart contract succesfully', async () => {
        // Get the smart contract's address.
        let address = await this.ToniTokenICO.address;
        // Check if it's a valid address.
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it('calls the token contract correctly', async () => {
        // Get the ToniToken contract's address
        let address = this.ToniTokenICO.tokenContract();
        // Check if it's a valid address.
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    it('sets the correct token price', async () => {
        // Get the token price and check if it's correct
        let tokenPrice = await this.ToniTokenICO.tokenPrice();
        assert.equal(tokenPrice, 1000000, 'correct token price');
    })
})