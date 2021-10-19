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
    let totalSupply = 1000000;    // total number of tokens in existence
    let admin = accounts[0];    // deployer of the token contract (owner of the total supply)
    let buyer = accounts[1];    // account buying tokens
    let tokensAvailable = 500000    // total amount of tokens available for buying
    let numberOfTokensBought = 100;    // number of tokens to buy

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
        // Transfer 500000 tokens to the ICO contract.
        await this.ToniToken.transfer(this.ToniTokenICO.address, tokensAvailable, { from: admin });
        // Correct value to be send to the ICO contract (in wei).
        let value = numberOfTokensBought * tokenPrice;

        // Try to buy tokens sending the wrong value in ether and check for a revert transaction.
        await this.ToniTokenICO.buyTokens(numberOfTokensBought, { from: buyer, value: 1}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'value must equal number of tokens in wei');
        })

        // Try to buy more tokens than the tokens available and check for a revert transaction.
        await this.ToniTokenICO.buyTokens(tokensAvailable + 1, { from: buyer, value: value}).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'unable to buy more tokens than the ones available');
        })

        // Buy 10 tokens with the buyer account and get the transaction receipt.
        let transactionReceipt = await this.ToniTokenICO.buyTokens(numberOfTokensBought, { from: buyer, value: value});
        // Check if receipt has the correct data.
        assert.equal(transactionReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transactionReceipt.logs[0].event, 'Sell', 'triggers a "Sell" event');
        assert.equal(transactionReceipt.logs[0].args._buyer, buyer, 'registers the buyer');
        assert.equal(transactionReceipt.logs[0].args._amount, numberOfTokensBought, 'registers the number of tokens sold');

        // Get the balance of the ICO contract and check if it was updated correctly.
        let contractBalance = await this.ToniToken.balanceOf(this.ToniTokenICO.address);
        assert.equal(contractBalance.toNumber(), tokensAvailable - numberOfTokensBought, 'updates contract balance correctly');
        
        // Get the buyer's balance and check if it was updated correctly.
        let buyerBalance = await this.ToniToken.balanceOf(buyer);
        assert.equal(buyerBalance.toNumber(), numberOfTokensBought, 'updates buyer balance correctly');
        
        // Get the number of tokens sold and check if it was updated correctly.
        let tokensSold = await this.ToniTokenICO.tokensSold();
        assert.equal(tokensSold.toNumber(), numberOfTokensBought, 'number of tokens sold updated correctly');
    })

    // Test the "endSale" function.
    it('endSale function works correctly', async () => {
        // Try to call function not being the admin and check for a revert transaction.
        await this.ToniTokenICO.endSale({ from: buyer }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'non-admin accounts unable to end the sale');
        })

        // End sale with admin account and get transaction receipt.
        let transactionReceipt = await this.ToniTokenICO.endSale({ from: admin });
        // assert.equal(transactionReceipt.logs.length, 1, 'triggers an event');
        // assert.equal(transactionReceipt.logs[0].event, 'Sell', 'triggers a "Sell" event');
        // assert.equal(transactionReceipt.logs[0].args._buyer, buyer, 'registers the buyer');
        // assert.equal(transactionReceipt.logs[0].args._amount, numberOfTokensBought, 'registers the number of tokens sold');

        // Get the admin balance and check if tokens not sold were transfered to admin account.
        let adminBalance = await this.ToniToken.balanceOf(admin);
        assert.equal(adminBalance.toNumber(), totalSupply - numberOfTokensBought, 'transfers the remaining tokens to the admin account');

        // Check if contract is destroyed/disabled when the sale ends.
        await this.ToniTokenICO.tokenPrice().then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        };
    })
})
