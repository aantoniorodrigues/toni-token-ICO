App = {
    // Variable to store the smart contracts.
    contracts: {},
    // Variable to store the user's address.
    account: '0x0',
    // Loading status of the app.
    loading: false,
    // Variable to store the token's price.
    tokenPrice: 0,

    // Initializes the app.
    init: async () => {
		// Call all the necessary methods.
        await App.initWeb3();
        await App.initContracts();
        await App.listenForEvents();
        await App.render();
    },

    // MetaMask sugestion to load web3 and connect to the blockchain.
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    initWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum);
          try {
            // Request account access if needed.
            await ethereum.enable();
            // Acccounts now exposed.
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider;
          window.web3 = new Web3(web3.currentProvider);
          // Acccounts always exposed.
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

    // Loads the necessary smart contracts.
    initContracts: async () => {
        // Load all the contracts json files.
        let toniTokenICO = await $.getJSON('ToniTokenICO.json');
        let toniToken = await $.getJSON('ToniToken.json');
        // Get a JavaScript representation of the contracts.
        App.contracts.ToniTokenICO = TruffleContract(toniTokenICO);
        App.contracts.ToniToken = TruffleContract(toniToken);
        // Set the web3 provider.
        App.contracts.ToniTokenICO.setProvider(App.web3Provider);
        App.contracts.ToniToken.setProvider(App.web3Provider);
        // Get a deployed instance of both contracts.
        App.toniTokenICO = await App.contracts.ToniTokenICO.deployed();
        App.toniToken = await App.contracts.ToniToken.deployed();
    },

    // Listens for emitted events from the smart contract.
    listenForEvents: async () => {
        App.toniTokenICO.Sell({}, {     // passed an empty object so nothing is filtered
            fromBlock: 0,
            toBlock: 'latest',
        }).watch((error, event) => {
            console.log('event triggered', event);
		    // Re-render the page when transaction is finished.
            App.render();
        })
    },

    // Renders the client side application.
    render: async () => {
        // Prevent double loading.
        if (App.loading) {
            return;
        }

        // Loading status while data is fetched.
        App.loading = true;
        // Variables to store the loader and content HTML elements.
        let loader = $('#loader');
        let content = $('#content');
        // Show loader and hide the content while data is being fetched.
        loader.show();
        content.hide();

        // Load the user account's data and displays it when app's not loading.
        App.account = web3.eth.accounts[0];
        $('#accountAddress').html('Your account:' + App.account);

        // Fetch data from the smart contracts.
        App.tokenPrice = await App.toniTokenICO.tokenPrice();
        let tokensSold = await App.toniTokenICO.tokensSold();
        let balance = await App.toniToken.balanceOf(App.account);
        let tokensAvailable = 500000;
        let progressPercentage = (tokensSold / tokensAvailable) * 100;

        // Update the HTML elements with the correct values.
        $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
        $('.tokens-sold').html(tokensSold.toNumber());
        $('.tokens-available').html(tokensAvailable - tokensSold);
        $('.toni-token-balance').html(balance.toNumber());
        $('#progress').css('width', progressPercentage + '%');

        // Loading status after data is fetched.
        App.loading = false;
        // Hide loader and show the content when data is available.
        loader.hide();
        content.show();
    },

    buyTokens: async () => {
        // Loading until transaction is complete.
        $('#content').hide();
        $('#loader').show();

        // Get the number of tokens to buy.
        let numberOfTokens = $('#numberOfTokens').val();
        // Buy the tokens.
        await App.toniTokenICO.buyTokens(numberOfTokens, {
            from: App.account,
            value: numberOfTokens * App.tokenPrice,
            gas: 500000
        }).then(() => { console.log('tokens bought')});
        
		// Reset the number of tokens in the form.
        $('form').trigger('reset');
    },
}

// Initialize the app.
$(function() {
    $(window).load(() => {
        App.init();
    })
});
