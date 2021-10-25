App = {
    // Variable to store the smart contracts.
    contracts: {},
    // Variable to store the user's address.
    account: '0x0',
    // Loading status of the app.
    loading: false,

    // Initializes the app.
    init: async () => {
        await App.initWeb3();
        await App.initContracts();

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
        await App.contracts.ToniTokenICO.deployed().then((toniTokenICO) => {
            console.log(toniTokenICO.address);
        });
        await App.contracts.ToniToken.deployed().then((toniToken) => {
            console.log(toniToken.address);
        });
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
        let tokenPrice = await App.contracts.ToniTokenICO.tokenPrice();
        let tokensSold = await App.contracts.ToniTokenICO.tokensSold();
        let balance = await App.contracts.ToniToken.balanceOf(App.account);
        let tokensAvailable = 750000;

        // Update the HTML elements with the correct values.
        $('.token-price').html(web3.utils.fromWei(tokenPrice, 'ether').toNumber());
        $('.tokens-sold').html(tokensSold.toNumber());
        $('.tokens-available').html((tokensAvailable - tokensSold).toNumber());
        $('.dapp-balance').html(balance.toNumber());

        // Compute and update the progress bar with the correct percentage.
        let progressPercent = (tokensSold / tokensAvailable).toNumber() * 100;
        $('#progress').css('width', progressPercent + '%');

        // Loading status after data is fetched.
        App.loading = false;
        // Hide loader and show the content when dta is available .
        loader.hide();
        content.show();
    },
}

// Initialize the app.
$(function() {
    $(window).load(() => {
        App.init();
    })
});
