App = {
    // Variable to store the smart contracts.
    contracts: {},
    // Variable to store the user's address.
    account: '0x0',

    // Initializes the app.
    init: async () => {
        console.log('App initialized...');
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
        // Fill the smart contract with the real values from the blockchain.
        await App.contracts.ToniTokenICO.deployed().then((toniTokenICO) => {
            console.log(toniTokenICO.address);
        });
        await App.contracts.ToniToken.deployed().then((toniToken) => {
            console.log(toniToken.address);
        });
    },

    // Renders the client side application.
    render: async () => {
        // Load account's data.
        App.account = web3.eth.accounts[0];
        // Display the user's account
        $('#accountAddress').html('Your account:' + App.account);
    },
}

// Initialize the app.
$(function() {
    $(window).load(() => {
        App.init();
    })
});