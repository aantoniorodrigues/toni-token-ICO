let ToniToken = artifacts.require('ToniToken');

contract('ToniToken', (accounts) => {
    before(async () => {
        this.ToniToken = await ToniToken.deployed();
    })

    // Test to see if the smart contract is deployed correctly.
    it('deploys the smart contract succesfully', async () => {
        // Get the smart contract's address.
        let address = await this.ToniToken.address;
        // Check if it's a valid address.
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

    // Test the "transfer" function.
    it('transfer function works correctly and throws exceptions when it should', async () => {
        // Transfer an ammount bigger than the total supply of tokens.
        await this.ToniToken.transfer.call(accounts[1], 999999999).then(assert.fail).catch((error) => {    // the "call" method doesn't create a transaction, just calls the method
            // Check if it throws a 'revert' error/exception.
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
        });
        
        // Get the function's output and check if it's a boolean.
        let output = await this.ToniToken.transfer.call(accounts[1], 250000);
        assert.equal(output, true, 'returns true');

        // Get a succesful transfer receipt and check if it has the correct data.
        let transferReceipt = await this.ToniToken.transfer(accounts[1], 250000, { from: accounts[0] });
        assert.equal(transferReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transferReceipt.logs[0].event, 'Transfer', 'triggers a "transfer" event');
        assert.equal(transferReceipt.logs[0].args._from, accounts[0], 'registers the account the tokens are transferred from');
        assert.equal(transferReceipt.logs[0].args._to, accounts[1], 'registers the account the tokens are transferred to');
        assert.equal(transferReceipt.logs[0].args._value, 250000, 'registers the transfer amount');
        
        // Check if value goes from sender to receiver's account.
        let receiverBalance = await this.ToniToken.balanceOf(accounts[1]);
        let senderBalance = await this.ToniToken.balanceOf(accounts[0]);
        assert.equal(receiverBalance.toNumber(), 250000, 'adds the ammount to the receiver account');
        assert.equal(senderBalance.toNumber(), 750000, 'deducts the ammount from sender account');
    })

    // Test the "approve" function.
    it('approve function works corretly approving delegated transactions', async () => {
        // Get the function's output and check if it's a boolean.
        let output = await this.ToniToken.approve.call(accounts[1], 100);
        assert.equal(output, true, 'returns true');

        // Get the transaction receipt and check if it has the correct data.
        let transactionReceipt = await this.ToniToken.approve(accounts[1], 100, { from: accounts[0] });
        assert.equal(transactionReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transactionReceipt.logs[0].event, 'Approval', 'triggers an "Approval" event');
        assert.equal(transactionReceipt.logs[0].args._owner, accounts[0], 'registers the account the tokens are transferred from');
        assert.equal(transactionReceipt.logs[0].args._spender, accounts[1], 'registers the account the tokens are transferred to');
        assert.equal(transactionReceipt.logs[0].args._value, 100, 'registers the transfer amount');
        
        // Check if it sets the correct allowance.
        let allowance = await this.ToniToken.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toNumber(), 100, 'sets the correct allowance for the delegated transfer');
    })

    // Test the "transferFrom" function.
    it('transferFrom function works correctly and throws exceptions when it should', async () => {
        let fromAccount = accounts[2];  // account spending the tokens
        let toAccount = accounts[3];    // account receiving the tokens
        let spendingAccount = accounts[4];  // account making the transfer
        
        // Get 100 tokens into fromAccount to test the method.
        await this.ToniToken.transfer(fromAccount, 100, { from: accounts[0] });
        // Approve spendingAccount to spend 10 tokens from fromAccount.
        await this.ToniToken.approve(spendingAccount, 10, { from: fromAccount });
        
        // Try spending more than the fromAccount owns.
        await this.ToniToken.transferFrom(fromAccount, toAccount, 1000, { from: spendingAccount }).then(assert.fail).catch( (error) => {
            // Check if it throws a 'revert' error/exception.
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than the balance');
        });
        
        // Try spending more than the approved value.
        await this.ToniToken.transferFrom(fromAccount, toAccount, 50, { from: spendingAccount }).then(assert.fail).catch( (error) => {
            // Check if it throws a 'revert' error/exception.
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than the approved value');
        });

        // Get the function's output and check if it's a boolean.
        let output = await this.ToniToken.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        assert.equal(output, true, 'returns true');

        // Get the transaction receipt and check if it has the correct data.
        let transferReceipt = await this.ToniToken.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        assert.equal(transferReceipt.logs.length, 1, 'triggers an event');
        assert.equal(transferReceipt.logs[0].event, 'Transfer', 'triggers a "Transfer" event');
        assert.equal(transferReceipt.logs[0].args._from, fromAccount, 'registers the account the tokens are transferred from');
        assert.equal(transferReceipt.logs[0].args._to, toAccount, 'registers the account the tokens are transferred to');
        assert.equal(transferReceipt.logs[0].args._value, 10, 'registers the transfer amount');
        
        // Get all the balances.
        let balanceOfFromAccount = await this.ToniToken.balanceOf(fromAccount);
        let balanceOfToAccount = await this.ToniToken.balanceOf(toAccount);
        let balanceOfSpendingAccount = await this.ToniToken.balanceOf(spendingAccount);
        // Check if the balances were correctly updated.
        assert.equal(balanceOfFromAccount.toNumber(), 90, 'tokens deducted from fromAccount');
        assert.equal(balanceOfToAccount.toNumber(), 10, 'tokens added to toAccount');
        assert.equal(balanceOfSpendingAccount.toNumber(), 0, 'balance of spendingAccount unchanged');
        
        // Check if the allowance was updated.
        let allowance = await this.ToniToken.allowance(fromAccount, spendingAccount);
        assert.equal(allowance.toNumber(), 0, 'deducts the allowance corrected');
    })
})