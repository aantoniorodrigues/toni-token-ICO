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

    // Test if the total supply is correct.
    it('sets correct total supply of 1M tokens', async () => {
        // Get the smart contract's total supply.
        let totalSupply = await this.ToniToken.totalSupply();
        // Check if it's 1 million.
        assert.equal(totalSupply.toNumber(), 1000000, 'sets correct total supply');
    })

    // Test if the total supply was allocated to the creator's account.
    it('allocates total supply to correct account', async () => {
        // Get the account's balance of the contract's creator.
        let creatorBalance = await this.ToniToken.balanceOf(accounts[0]);
        // Check if it's set to 1 million tokens.
        assert.equal(creatorBalance.toNumber(), 1000000, 'initial supply correctly allocated');
    })

    // Test if the token's name and symbol are correct.
    it('sets name and symbol correctly', async () => {
        // Get token's name, symbol and standard.
        let name = await this.ToniToken.name();
        let symbol = await this.ToniToken.symbol();
        // Check if they have the correct values.
        assert.equal(name, 'ToniToken', 'token with the correct name');
        assert.equal(symbol, 'TT', 'token with the correct symbol');
    })

    // Test if an account's able to transfer more tokens than the ones it owns.
    it('not allowed to transfer more tokens than the ones it owns', () => {
        return this.ToniToken.transfer.call(accounts[1], 999999999).then(assert.fail).catch((error) => {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        });
    })

    // Test the transfer function.
    it('transfer function', async () => {
        let transferReceipt = await this.ToniToken.transfer(accounts[1], 250000, { from: accounts[0] });
        assert.equal(transferReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transferReceipt.logs[0].event, 'Transfer', 'triggers a "transfer" event');
        assert.equal(transferReceipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
        assert.equal(transferReceipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
        assert.equal(transferReceipt.logs[0].args._value, 250000, 'logs the transfer amount');

        let receiverBalance = await this.ToniToken.balanceOf(accounts[1]);
        let senderBalance = await this.ToniToken.balanceOf(accounts[0]);
        assert.equal(receiverBalance.toNumber(), 250000, 'adds the ammount to the receiver account');
        assert.equal(senderBalance.toNumber(), 750000, 'deducts the ammount from sender account');
        // Check if it returns a boolean.
        let output = await this.ToniToken.transfer.call(accounts[1], 250000);
        assert.equal(output, true, 'returns true');
    })
})