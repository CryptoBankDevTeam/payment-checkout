let Web3 = require("web3");
let HDWalletProvider = require('@truffle/hdwallet-provider')

let config  = require('../../app.config.js')

let currentBlockChain = config.currentBlockChain
let ethereum = window.ethereum

let web3Provider
let web3
let accounts

// if (window.ethereum) {
//     web3Provider = window.ethereum;
//     try {
//         // Request account access
//         window.ethereum.enable()
//         .then(web3 = new Web3(web3Provider))
//         console.log('Connected to Metamask')
//     } catch (error) {
//         // User denied account access...
//         console.error("User denied account access")
//     }
// }
// // Legacy dapp browsers...
// else if (window.web3) {
//     web3Provider = window.web3.currentProvider;
// }
// // If no injected web3 instance is detected, fall back to Ganache
// // else if(!window.ethereum) {
// //     // let provider = new HDWalletProvider({
// //     //     privateKeys: ['9552d1cccee1e1bb9ad929d561b16265b685f0d4e32e5bf1adb1d921038a40cd'], 
// //     //     providerOrUrl: `https://data-seed-prebsc-1-s1.binance.org:8545/`
// //     // })
// //     // web3Provider = provider
// //     // //web3Provider = new Web3.providers.HttpProvider(currentBlockChain.url) //"https://rpc.parastate.io:8545"); //'http://localhost:8545');
// // }

// web3 = new Web3(web3Provider)   

function getConnectionStatus (provider, setConnected) {
    if(!provider.isConnected()) setConnected(false)
    setConnected(true)
}

function getChainId(setChainId){
    ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId) => {
            console.log(`hexadecimal string: ${chainId}`);
            console.log(`decimal number: ${parseInt(chainId, 16)}`);
            setChainId(chainId)
        })
        .catch((error) => {
            console.error(`Error fetching chainId: ${error.code}: ${error.message}`);
        });
}

function getAccount(setAccount) {
    ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
            console.log(`Accounts:\n${accounts.join('\n')}`);
            setAccount(accounts[0])
        })
        .catch((error) => {
            console.error(
                `Error fetching accounts: ${error.message}.
                 Code: ${error.code}.
                 Data: ${error.data}`
            )
        })
}

function onConnect(provider, setConnected, setWeb3) {
    provider.on(
        'connect',
        (connectInfo) =>  { 
            console.log(`Connected to blockchain`)
            console.log(connectInfo)
            setConnected(provider) 
            web3 = new Web3(provider)
            setWeb3(web3)
            web3Provider = provider
        }
    )
}

function onDisconnect(provider, setConnected) {
    provider.on(
        'disconnect',
        (error) =>  { 
            console.log(`Disconnected from blockchain`)
            console.log(error)
            setConnected(false) 
        }
    )
}

function onChainChanged(provider, setChainId, setWeb3){
    provider.on(
        'chainChanged',
        (chainId) =>  { 
            console.log(`Chain changed`)
            console.log(chainId)
            setChainId(chainId) 
            web3 = new Web3(provider)
            setWeb3(web3)
            web3Provider = provider
        }
    )
}

function onAccountsChanged(provider, setAccount){
    provider.on(
        'accountsChanged',
        (accounts) =>  { 
            console.log(`accountsChanged`)
            console.log(accounts)
            setAccount(accounts[0])
        }
    )
}

function onMessage(provider, setMessage){
    provider.on(
        'message',
        (message) =>  { 
            console.log(`message recieved`)
            console.log(message)
            setMessage(message) 
        }
    )
}

module.exports = { 
    web3, 
    web3Provider, 
    accounts,
    getConnectionStatus,
    getChainId,
    getAccount,
    onConnect,
    onDisconnect,
    onChainChanged,
    onAccountsChanged,
    onMessage
}