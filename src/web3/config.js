import Web3 from "web3";
import { currentBlockChain, networks } from '../../app.config'

let web3Provider
let web3
let accounts

if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
        // Request account access
        window.ethereum.enable()
        .then(web3 = new Web3(web3Provider))
        console.log('Connected to Metamask')
    } catch (error) {
        // User denied account access...
        console.error("User denied account access")
    }
}
// Legacy dapp browsers...
else if (window.web3) {
    web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
    web3Provider = new Web3.providers.HttpProvider(currentBlockChain) //"https://rpc.parastate.io:8545"); //'http://localhost:8545');
}

web3 = new Web3(web3Provider)   

// accounts = await web3.eth.getAccounts()

async function setupWeb3 () {
    if (window.ethereum) {
        web3Provider = window.ethereum;
        try {
            // Request account access
            window.ethereum.enable()
            .then(web3 = new Web3(web3Provider))
            console.log('Connected to Metamask')
            return
        } catch (error) {
            // User denied account access...
            console.error("User denied account access")
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:8545') //"https://rpc.parastate.io:8545"); //'http://localhost:8545');
    }
    
    web3 = new Web3(web3Provider)   
    
    accounts = await web3.eth.getAccounts()
}

export { web3, setupWeb3, web3Provider, accounts }