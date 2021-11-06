import React from "react";
import Header from "../components/header";

import Web3 from "web3";
// import CoinGecko from 'coingecko-api'
import axios from 'axios'
import { Link } from "react-router-dom";

import { setupWeb3, web3, web3Provider } from '../web3/config'
import {Token1, Token2, PaymentContract} from '../contracts/artifacts';

// let chainLinkNgnUsdAddress = '0x1FF2B48ed0A1669d6CcC83f4B3c84FDdF13Ea594'

axios.defaults.baseURL = 'https://api.binance.com';

function BalanceContent(props) {
    return(
        <div class="py-0">
            <p class="text-sm font-light text-gray-500">{props.name}</p>
            <p class="text-xl">{Number(props.value).toFixed(5)}</p>
        </div>
    );
}


function Balance(props) {


    return(
        <div class="mb-4">
            <Link to={`/paymentStatus?tokenSymbol=${props.tokenSymbol}&tokenQty=${props.needed}&fiatSymbol=${props.fiatSymbol}&usdAmount=${props.usdAmount}&fiatAmount=${props.fiatAmount}`}>
                <div class="flex flex-row justify-between bg-white rounded-2xl p-4">
                    <div class="border-red-600">
                        <h1 class="text-2xl font-bold text-red-600">{props.tokenSymbol}</h1>

                        <div class="flex flex-row space-x-4 mt-2">
                            <BalanceContent name={"Available"} value={props.available}/>
                            <BalanceContent name={"Needed"} value={props.needed}/>
                        </div>

                    </div>

                    <p class="self-center text-2xl text-primary">{">"}</p>            
                    
                </div>
            </Link>
        </div>
    );
}

class WalletBalances extends React.Component {

    constructor(props) {
        super(props)
        //alert(props.balances.length)
    }

    render() {
        return(
            <div>
                <h1 class="text-md text-gray-500 mb-4">Wallet Balances</h1>
                <div class="space-y-4"> 
                    {this.props.balances.map(bal => {
                        return <Balance 
                                    tokenSymbol={bal.symbol} 
                                    available={bal.balance} 
                                    needed={bal.needed}
                                    fiatSymbol={this.props.fiatSymbol}
                                    fiatAmount={this.props.fiatAmount}
                                    usdAmount={bal.usdAmount}
                                />
                    })}
                </div>
            </div>
        );
    }
}



class PayWithCrypto extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            balances: [],
            //price: 0,
            payment: this.generateRandomPayment(),
            fiatSymbol: 'NGN',
            fiatAmount: 0
        }
        this.handleLoadWalletBalances = this.handleLoadWalletBalances.bind(this)
        this.getPrice = this.getPrice.bind(this)
        this.generateRandomPayment = this.generateRandomPayment.bind(this)
        this.startPayment = this.startPayment.bind(this)
    }

    componentDidMount() {
        // // Modern dapp browsers...
        // if (window.ethereum) {
        //     web3Provider = window.ethereum;
        //     try {
        //         // Request account access
        //         window.ethereum.enable()
        //         .then(web3 = new Web3(web3Provider))
        //         console.log('Connected to Metamask')
        //         return
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
        // else {
        //     web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        // }

        // web3 = new Web3(web3Provider)

        // generate random payment
        // this.setState({
        //     payment: this.generateRandomPayment()
        // })

        setupWeb3()
    }


    generateRandomPayment() {
        //alert(Math.floor(Math.random() * 10000))
        return Math.floor(Math.random() * 100000)
    }


    async getPrice(pair) {

        try {
            let { data, status, config } = await axios.get('/api/v3/ticker/price?symbol='+pair)
            //alert(`status is ${status} ${Object.keys(config)}`)
            return data.price  
        } catch (e) {
            alert(e)
        }     
        
    }

    async getUsdAmount(fiatTokenPrice, tokenUsdPair) {
        let tokenPriceByUsdPrice = await this.getPrice(tokenUsdPair)
        let exRate = fiatTokenPrice / tokenPriceByUsdPrice
        return this.state.payment/exRate
    }

    async handleLoadWalletBalances() {
        // alert('In handleLoadWalletBalances')
        // Connect to web3 wallet
        // load balances
        let account
        
        let token1
        let token2

        PaymentContract.setProvider(web3Provider)
        let paymentContract = await PaymentContract.deployed()

        let token1PriceInformation = {
            tokenQty: 0,
            symbol: '',
            name: '',
            balance: '',
            needed: '',
            usdPrice: 0,
            usdAmount: 0,
            fiatPrice: 0
        }

        let token2PriceInformation = {
            tokenQty: 0,
            symbol: '',
            name: '',
            balance: '',
            needed: '',
            usdPrice: 0,
            usdAmount: 0,
            fiatPrice: 0
        }

        let bals = []

        web3.eth.getAccounts()
        .then(res => {
            console.log(`chainId is: ${web3.givenProvider.chainId}`)
            account = res[0]
            return web3.eth.getBalance(account)
        })
        .then(res => {
            //alert(`Account balance is ${res}`) 

            // let Token1 = TruffleContract(require ("../../../../../shared-contracts/cryptobank/Token1.json"))
            // let Token2 = TruffleContract(require ("../../../../../shared-contracts/cryptobank/Token2.json"))

            //alert(Object.keys(web3Provider).join(","))
            //alert(`chainId: ${web3Provider.chainId} \nis Metamask: ${web3Provider.isMetaMask}`)

            Token1.setProvider(web3Provider)
            Token2.setProvider(web3Provider)

            Token1.deployed()
            .then(contract => {
                token1 = contract
                return token1.name()
            }).then(name => {                
                token1PriceInformation.name = name
                //alert(`name is ${token1Balance.name}`)
                return token1.symbol()
            }).then(symbol => {
                token1PriceInformation.symbol = symbol
                return this.getPrice('BTCNGN')
            }).then(async fiatTokenPrice =>{
                //alert(`symbol is ${token1Balance.symbol}`)
                // token1PriceByFiatPrice = fiatTokenPrice
                // token1PriceByUsdPrice = await this.getPrice('BTCUSD')
                // let exRate = token1PriceByFiatPrice / token1PriceByUsdPrice
                token1PriceInformation.fiatPrice = fiatTokenPrice
                token1PriceInformation.usdAmount = await this.getUsdAmount(fiatTokenPrice, 'BTCBUSD')
                console.log(`token1 USD amount is ${token1PriceInformation.usdAmount}`)
                return token1.balanceOf(account)
            }).then(async balance => {
                //alert(`balance is ${balance}`)
                token1PriceInformation.balance = web3.utils.fromWei(balance,"ether")
                
                token2 = await Token2.deployed()
                //token1PriceInformation.needed = (this.state.payment/token1PriceInformation.fiatPrice).toFixed(8)
                let path = []
                console.log(`token1 address is ${token1.address}`)
                path.push(token1.address);
                path.push(token2.address);

                token1PriceInformation.needed = web3.utils.fromWei(await paymentContract._requiredTokenAmount(web3.utils.toWei(token1PriceInformation.usdAmount.toString(), "ether"), path),"ether")
                console.log(`token1 needed: ${token1PriceInformation.needed}`)
                return token2
            }).then(contract => {
                //token2 = contract
                
                return token2.name()
            }).then(name => {
                console.log(`token2 name is: ${name}`)
                token2PriceInformation.name = name
                return token2.symbol()
            }).then(symbol => {
                token2PriceInformation.symbol = symbol
                return this.getPrice('ETHNGN')
            }).then(async fiatTokenPrice => {
                //token2Price = price
                token2PriceInformation.fiatPrice = fiatTokenPrice
                token2PriceInformation.usdAmount = await this.getUsdAmount(fiatTokenPrice, 'ETHBUSD')
                return token2.balanceOf(account)
            }).then(balance => {
                token2PriceInformation.balance = web3.utils.fromWei(balance,"ether")
                // alert(this.state.payment)
                token2PriceInformation.needed = (this.state.payment/token2PriceInformation.fiatPrice).toFixed(8)
                console.log(`token1PriceInformation object is ${Object.values(token2PriceInformation).join(', ')}`)
                this.setState(state => ({
                    balances: [{...token1PriceInformation}, {...token2PriceInformation}],
                }))
                
                //return this.getPrice()
                //alert(`and ${this.state.balances.length}`)
                // alert(this.state.balances[0].symbol)
            })
            .catch(err => {
                alert(err)
            })
            
        })

        
        
        // let tkn = Token1.deployed()
        // alert(tkn.address)
    }

    startPayment() {

    }

    render() {
        return(
            <div class="flex flex-col h-full">
                <Header/>
                <div class="flex flex-col h-full bg-cover bg-top bg-payWithCryptoBkg">
                    <h1 class="pt-8 pb-6 text-4xl font-bold text-center text-white">Pay with Crypto</h1>

                    <div class="m-6 px-6 py-8 rounded-xl bg-white bg-opacity-75 shadow-md">
                        <p class="text-left text-gray-500">Total Payment</p>
                        <div class="flex flex-row">
                            <p class="text-left text-4xl text-red-600">{new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'   }).format(this.state.payment)}</p>
                            {/* <p class="text-left text-sm text-red-600">NGN</p> */}
                        </div>
                        
                    </div>

                    <div class="flex flex-col">
                        <button class="mx-6 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleLoadWalletBalances}>
                            <p class="text-white text-lg">
                                Load Balances
                            </p>
                        </button>
                    </div>

                    <div class="m-6">
                        <WalletBalances 
                            balances={this.state.balances} 
                            fiatSymbol={this.state.fiatSymbol} 
                            fiatAmount={this.state.payment
                        }/>   
                    </div>
                    
                    
                </div>
            </div>
        );
    }
}

export default PayWithCrypto