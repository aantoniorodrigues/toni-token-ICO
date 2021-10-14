let ToniToken = artifacts.require('ToniToken');
let ToniTokenICO = artifacts.require('ToniTokenICO');

contract('ToniTokenICO', (accounts) => {
    before(async () => {
        // Get token and ICO contract.
        this.ToniToken = await ToniToken.deployed();
        this.ToniTokenICO = await ToniTokenICO.deployed();
    })

    // Variables to use on the several tests.
    let tokenPrice = 1000000;    // defined token price
    let admin = acounts[0];    // deployer of the token contract (owner of the total supply)
    let buyer = accounts[1];    // account buying tokens
    let tokensAvailable = 500000    // total amount of tokens available for buying
    let numberOfTokens = 100;    // number of tokens to buy

    // Test if the smart contract is deployed correctly.
    it('deploys the smart contract succesfully', async () => {
        // Get the smart contract's address.
        let address = await this.ToniTokenICO.address;
        // Check if it's a valid address.
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    // Test if token contract is called correctly.
    it('calls the token contract correctly', async () => {
        // Get the ICO contract's address.
        let address = this.ToniTokenICO.tokenContract();
        // Check if it's a valid address.
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    })

    // Test if the correct token price is set.
    it('sets the correct token price', async () => {
        // Get the token price defined on the contract and check if it's correct.
        let price = await this.ToniTokenICO.tokenPrice();
        assert.equal(price, tokenPrice, 'correct token price');
    })

    // Test the "buyToken" function.
    it('buyToken function works correctly', async () => {
        // Try to buy tokens sending the wrong value in ether and check if an exception is thrown.
        await this.ToniTokenICO.buyTokens(numberOfTokens, { from: buyer, value: 1}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'value must equal number of tokens in wei');
        })

        // Transfer 500000 tokens to the ICO contract.
        await this.ToniToken.transfer(this.ToniTokenICO.address, tokensAvailable, { from: admin });

        // Correct value to be send to the ICO contract (in wei).
        let value = numberOfTokens * tokenPrice;
        // Buy 10 tokens with the buyer account and get the transaction receipt.
        let transactionReceipt = await this.ToniTokenICO.buyTokens(numberOfTokens, { from: buyer, value: value});
        // Check if receipt has the correct data.
        assert.equal(transactionReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transactionReceipt.logs[0].event, 'Sell', 'triggers a "Sell" event');
        assert.equal(transactionReceipt.logs[0].args._buyer, buyer, 'registers the buyer');
        assert.equal(transactionReceipt.logs[0].args._amount, numberOfTokens, 'registers the number of tokens sold');
        
        // Get the number of tokens sold and check if it was updated correctly.
        let tokensSold = await this.ToniTokenICO.tokensSold();
        assert.equal(tokensSold.toNumber(), numberOfTokens, 'number of tokens sold updated correctly');
    })
})