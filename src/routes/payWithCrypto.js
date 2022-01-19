import React from "react";
import Header from "../components/header";

import Web3 from "web3";
// import CoinGecko from 'coingecko-api'
import axios from 'axios'
import { Link } from "react-router-dom";

import { setupWeb3, web3, web3Provider } from '../web3/config'
import { Token1, Token2, PaymentContract } from '../contracts/artifacts';

import { priceDataFeed, blockChainAccessor, casePayWithCrypto } from '../service/usecases'

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
                    {this.props.balances.map((bal, index) => {
                        return <Balance 
                                    key={index}
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
        this.handleGetPriceBtcNgn = this.handleGetPriceBtcNgn.bind(this)
        this.handleGetPriceBusdBtc = this.handleGetPriceBusdBtc.bind(this)
        this.handleGetPriceBusdNgn = this.handleGetPriceBusdNgn.bind(this)
        this.handleGetUsdAmount = this.handleGetUsdAmount.bind(this)

        this.handleChangePayment = this.handleChangePayment.bind(this)
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

        // setupWeb3()
    }


    generateRandomPayment() {
        //alert(Math.floor(Math.random() * 10000))
        return Math.floor(Math.random() * 100000)
    }


    async getPrice(pair) {
        return await priceDataFeed.getPrice(pair)
        // try {
        //     let { data, status, config } = await axios.get('/api/v3/ticker/price?symbol='+pair)
        //     //alert(`status is ${status} ${Object.keys(config)}`)
        //     return data.price  
        // } catch (e) {
        //     alert(e)
        // }     
    }

    async getUsdAmount(fiatTokenPrice, tokenUsdPair) {
        let tokenPriceByUsdPrice = await this.getPrice(tokenUsdPair)
        let exRate = fiatTokenPrice / tokenPriceByUsdPrice
        return this.state.payment/exRate
    }

    async handleGetPriceBtcNgn(){
        let price = await this.getPrice('BTCNGN')
        console.log(`BTCNGN price is ${price}`)
    }

    async handleGetPriceBusdBtc(){
        let price = await this.getPrice('BTCBUSD')
        console.log(`BTCBUSD price is ${price}`)
    }

    async handleGetPriceBusdNgn(){
        let price = await this.getPrice('BUSDNGN')
        console.log(`BUSDNGN price is ${price}`)
    }

    async handleGetUsdAmount() {

        let stableCoinSymbol = 'TK2'

        let amt = await priceDataFeed.getStableCoinAmount({
            fiatSymbol: 'NGN',
            fiatAmount: this.state.payment,
            tokenSymbol: '',
            stableCoinSymbol
        })

        console.log(`Stable coin amount is ${amt.toLocaleString()} ${stableCoinSymbol}`)
    }

    async handleLoadWalletBalances() {
        let stableCoinSymbol = 'TK2'

        let bals = await casePayWithCrypto.loadBalances({
            fiatSymbol: 'NGN',
            fiatAmount: this.state.payment,
            tokenSymbol: 'TK1',
            stableCoinSymbol: 'TK2'
        })

        console.log(`Balance received`)
        console.log(`needed is ${bals[0].usdAmount}`)

        this.setState({
            balances: bals
        })
    }
    
    startPayment() {

    }

    handleSetPayment(event) {

    }

    handleChangePayment(event){
        this.setState({payment: event.target.value})
    }

    render() {
        return(
            <div class="flex flex-col h-full">
                <Header/>
                <div class="flex flex-col h-full bg-cover bg-top bg-payWithCryptoBkg">
                    <h1 class="pt-8 pb-6 text-4xl font-bold text-center text-white">Pay with Crypto</h1>

                    <div class="m-6 px-6 py-8 rounded-xl bg-white bg-opacity-75 shadow-md">
                        <p class="text-left text-gray-500">Total Payment</p>
                        <div class="flex flex-col gap-4">
                            <p class="text-left text-4xl text-red-600">{new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN'   }).format(this.state.payment)}</p>
                            {/* <p class="text-left text-sm text-red-600">NGN</p> */}
                            
                            <input class="w-max p-2 border-2 rounded" 
                                type="number"
                                value={this.state.payment}
                                onChange={this.handleChangePayment}
                            />
                            
                        </div>
                        
                    </div>

                    <div class="flex flex-col">
                        <button class="mx-6 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleLoadWalletBalances}>
                            <p class="text-white text-lg">
                                Load Balances
                            </p>
                        </button>
                        {/* <button class="mx-6 mt-2 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleGetPriceBtcNgn}>
                            <p class="text-white text-lg">
                                BTC/NGN price
                            </p>
                        </button>
                        <button class="mx-6 mt-2 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleGetPriceBusdBtc}>
                            <p class="text-white text-lg">
                                BTC/BUSD price
                            </p>
                        </button>
                        <button class="mx-6 mt-2 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleGetPriceBusdNgn}>
                            <p class="text-white text-lg">
                                BUSD/NGN price
                            </p>
                        </button>
                        <button class="mx-6 mt-2 my-0 p-2 bg-primary rounded-lg shadow" onClick={this.handleGetUsdAmount}>
                            <p class="text-white text-lg">
                                Get USD Amount
                            </p>
                        </button> */}
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