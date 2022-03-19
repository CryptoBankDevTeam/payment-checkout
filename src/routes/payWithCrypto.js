import React from "react";
import Header from "../components/header";

import { withSearchParams, withLocation } from "../components/hocs";
import { withMetaMask } from '../components/hocWithMetamask'

import axios from 'axios'

import { priceDataFeed, blockChainAccessor, casePayWithCrypto } from '../service/usecases'
import { useNavigate } from "react-router-dom";


import cryptoBankLogo from '../images/cryptoBankLogoNoNameWhite.png'

// let chainLinkNgnUsdAddress = '0x1FF2B48ed0A1669d6CcC83f4B3c84FDdF13Ea594'

axios.defaults.baseURL = 'https://api.binance.com';

function BalanceContent(props) {
    return (
        <div class="py-0">
            <p class="text-xs font-light text-gray-500">{props.name}</p>
            <p class="text-sm">{Number(props.value).toFixed(10)}</p>
        </div>
    );
}

function BalanceContent2(props) {
    return (
        <div class="py-0">
            <p class="text-xs text-left font-light text-gray-500">{props.name}</p>
            <p class="text-lg text-left">{Number(props.value).toFixed(10)}</p>
        </div>
    );
}

function NeededContent(props) {
    return (
        <div class="py-0 flex flex-row gap-2">
            <p class="text-xs text-left font-light text-gray-500">{props.name}</p>
            <p class="text-xs text-left">{Number(props.value).toFixed(10)}</p>
        </div>
    );
}

function Balance(props) {

    let navigate = useNavigate()

    async function handleNavigateToPaymentStatus() {
        navigate('/paymentStatus', { state: { ...props }, replace: true })
    }

    return (
        <div class="mb-4">
            {/* to={`/paymentStatus?tokenSymbol=${props.tokenSymbol}&tokenQty=${props.needed}&fiatSymbol=${props.fiatSymbol}&usdAmount=${props.usdAmount}&fiatAmount=${props.fiatAmount}`}> */}
            <button className="w-full" onClick={handleNavigateToPaymentStatus}>
                <div class="flex flex-row justify-between bg-white rounded-2xl p-4">
                    <div class="border-red-600 w-full">
                        <h1 class="text-2xl font-bold text-red-600">{props.tokenSymbol}</h1>

                        <div class="flex flex-row justify-around mt-2">
                            <BalanceContent name={"Available"} value={props.available} />
                            <BalanceContent name={"Needed"} value={props.needed} />
                        </div>

                    </div>

                    <p class="self-center text-2xl text-primary">{">"}</p>

                </div>
            </button>
        </div>
    );
}

function Balance2(props) {

    let navigate = useNavigate()

    async function handleNavigateToPaymentStatus() {
        navigate('/paymentStatus', { state: { ...props }, replace: true })
    }

    return (
        <div class="mb-4">
            {/* to={`/paymentStatus?tokenSymbol=${props.tokenSymbol}&tokenQty=${props.needed}&fiatSymbol=${props.fiatSymbol}&usdAmount=${props.usdAmount}&fiatAmount=${props.fiatAmount}`}> */}
            <button className="w-full" onClick={handleNavigateToPaymentStatus}>
                <div class="flex flex-row justify-between bg-white rounded-2xl p-4">
                    <div class="border-red-600 w-full">
                        <h1 class="text-2xl font-bold text-red-600 text-left">{props.tokenSymbol}</h1>

                        <div class="flex flex-col gap-2 justify-around mt-2">
                            <BalanceContent2 name={"Available"} value={props.available} />
                            <NeededContent name={"Needed"} value={props.needed} />
                        </div>

                    </div>

                    <div class="self-center text-2xl text-primary">
                        <button className="text-xs bg-blue-600 text-white px-4 py-1 rounded-md">Pay</button>
                    </div>

                </div>
            </button>
        </div>
    );
}

// function BalanceOld(props) {
//     return(
//         <div class="mb-4">
//             <Link to={`/paymentStatus?tokenSymbol=${props.tokenSymbol}&tokenQty=${props.needed}&fiatSymbol=${props.fiatSymbol}&usdAmount=${props.usdAmount}&fiatAmount=${props.fiatAmount}`}>
//                 <div class="flex flex-row justify-between bg-white rounded-2xl p-4">
//                     <div class="border-red-600">
//                         <h1 class="text-2xl font-bold text-red-600">{props.tokenSymbol}</h1>

//                         <div class="flex flex-row space-x-4 mt-2">
//                             <BalanceContent name={"Available"} value={props.available}/>
//                             <BalanceContent name={"Needed"} value={props.needed}/>
//                         </div>

//                     </div>

//                     <p class="self-center text-2xl text-primary">{">"}</p>            

//                 </div>
//             </Link>
//         </div>
//     );
// }
class WalletBalances extends React.Component {

    constructor(props) {
        super(props)
        //alert(props.balances.length)
    }

    render() {
        return (
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
                            vendorId={this.props.vendorId}
                        />
                    })}
                </div>
            </div>
        );
    }
}

class WalletBalances2 extends React.Component {

    constructor(props) {
        super(props)
        //alert(props.balances.length)
    }

    render() {
        return (
            <div>
                {/* <h1 class="text-md text-gray-500 mb-4">Wallet Balances</h1> */}
                <div class="space-y-4">
                    {this.props.balances.map((bal, index) => {
                        return <Balance2
                            key={index}
                            tokenSymbol={bal.symbol}
                            available={bal.balance}
                            needed={bal.needed}
                            fiatSymbol={this.props.fiatSymbol}
                            fiatAmount={this.props.fiatAmount}
                            vendorId={this.props.vendorId}
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

        this.handleTestCallback = this.handleTestCallback.bind(this)
    }

    componentDidMount() {
        console.log('testing')
        console.log(Object.keys(this.props))
        console.log(this.props.data.web3)
        console.log(`params are:`)

        let [searchParams, setSearchParams] = this.props.searchParamsService
        console.log(searchParams.get('amount'))
        console.log(this.props.location)

        this.setState({
            payment: Number(searchParams.get('amount')),
            vendorId: searchParams.get('vendorId'),
            payerEmail: searchParams.get('payerEmail')
        })


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

    handleTestCallback() {
        console.log(`window name is ${window.name}`)
        window.top.postMessage('payment-complete', "*")
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
        return this.state.payment / exRate
    }

    async handleGetPriceBtcNgn() {
        let price = await this.getPrice('BTCNGN')
        console.log(`BTCNGN price is ${price}`)
    }

    async handleGetPriceBusdBtc() {
        let price = await this.getPrice('BTCBUSD')
        console.log(`BTCBUSD price is ${price}`)
    }

    async handleGetPriceBusdNgn() {
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

    async handleSetupArtifacts() {
        // this.props.onSetupArtifacts()
        console.log(`in handleSetupArtifacts of payWithCrypto`)
        await casePayWithCrypto.setupArtifacts(this.props.data.provider, this.props.data.account, this.props.data.web3)
    }

    async handleLoadWalletBalances() {
        await this.handleSetupArtifacts()

        // let stableCoinSymbol = 'TK2'

        // let bals = await casePayWithCrypto.loadBalances({
        //     fiatSymbol: 'NGN',
        //     fiatAmount: this.state.payment,
        //     tokenSymbol: 'TK1',
        //     stableCoinSymbol: 'TK2'
        // })

        let bals = await casePayWithCrypto.loadBalances({
            fiatSymbol: 'NGN',
            fiatAmount: this.state.payment,
        })

        if (!bals) return
        console.log(`Balance received`)
        console.log(`needed is ${bals[0]}`)
        console.log(bals[0])

        this.setState({
            balances: bals
        })

    }

    startPayment() {

    }

    handleSetPayment(event) {
    }


    handleChangePayment(event) {
        this.setState({ payment: event.target.value })
    }

    render() {
        return (
            <PayWithCryptoView2 {...this.props} viewData={{ ...this.state }} onLoadWalletBalances={this.handleLoadWalletBalances} />
        );
    }
}

function PayWithCryptoView1(props) {
    return (
        <div class="flex flex-col rounded-xl">
            <Header />

            <div className="text-xs bg-white p-4">
                <p className='mt-2 text-xs text-blue-600'>Connection status:</p>
                {props.data.connectionStatus}
                <p className='mt-2 text-xs text-blue-600'>Current chain:</p>

                <p>{props.data.chainId}</p>

                <p className='mt-2 text-xs text-blue-600'>Current account:</p>
                <p>{props.data.account}</p>

            </div>

            <div class="flex flex-col h-full bg-cover bg-top bg-payWithCryptoBkg">
                <h1 class="pt-8 pb-6 text-4xl font-bold text-center text-white">Pay with Crypto</h1>
                <div class="m-6 px-6 py-4 rounded-xl bg-white bg-opacity-75 shadow-md">
                    <p class="text-xs text-left text-gray-500">Total Payment</p>
                    <div class="flex flex-col gap-4">
                        <p class="text-left text-4xl text-red-600">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(props.viewData.payment)}</p>
                    </div>

                    <p class="text-xs text-left text-gray-500 mt-4">From</p>
                    <div class="flex flex-col gap-4">
                        <p class="text-left text-md text-blue-600">{props.viewData.payerEmail}</p>
                    </div>

                    <p class="text-xs text-left text-gray-500 mt-4">To (Vendor ID)</p>
                    <div class="flex flex-col gap-4">
                        <p class="text-left text-md text-blue-600">{props.viewData.vendorId}</p>
                    </div>


                </div>

                <div class="flex flex-col">
                    <button class="mx-6 my-0 p-2 bg-primary rounded-lg shadow" onClick={props.onLoadWalletBalances}>
                        <p class="text-white text-lg">
                            Load Balances
                        </p>
                    </button>
                </div>

                <div class="m-6">
                    <WalletBalances
                        balances={props.viewData.balances}
                        fiatAmount={props.viewData.payment}
                        fiatSymbol={props.viewData.fiatSymbol}
                        vendorId={props.viewData.vendorId}
                    />
                </div>


            </div>
        </div>
    );
}

function PayWithCryptoView2(props) {

    let itemLabel = (text) => <p className="text-xs text-gray-400">{text}</p>
    let itemValue = (text) => <p className="text-xs text-gray-600">{text}</p>

    let itemLabelAndValue = (label, value) => <p className="flex flex-row justify-between items-center text-sm text-gray-600">{itemLabel(label)} {itemValue(value)}</p>

    return (
        <div class="flex flex-col rounded-xl h-screen">
            {/* Header */}
            <div className="bg-blue-800 rounded-t-xl text-white text-center justify-center pt-4 pb-16">
                <img className="h-10 mx-auto mb-2" src={cryptoBankLogo} />
                <h1 className="font-semibold">Pay with CryptoBank</h1>
            </div>

            {/* Payment Info */}
            <div className="relative w-full">
                <div className="absolute -top-12 w-full">
                    <div className="bg-white w-4/5 rounded-xl mx-auto px-4 py-2 flex flex-col gap-2">
                        {itemLabelAndValue("Amount", new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(props.viewData.payment))}
                        {itemLabelAndValue("From", props.viewData.payerEmail)}
                        {itemLabelAndValue("Vendor", props.viewData.vendorId)}
                    </div>
                </div>

                {/* Block chain Information */}
                <div className="bg-gray-200 pt-16 pb-12 flex flex-col gap-4 items-center text-center">
                    <div className="flex flex-row gap-16">
                        <div>
                            {itemLabel("STATUS")}
                            {itemValue(props.data.connectionStatus)}
                        </div>
                        <div>
                            {itemLabel("BLOCKCHAIN")}
                            {itemValue(props.data.chainId)}
                        </div>
                    </div>

                    <div>
                        {itemLabel("ACCOUNT")}
                        {itemValue(props.data.account)}
                    </div>
                </div>

                {/* Load Button */}
                <div className="absolute -bottom-5 w-full flex flex-row justify-center">
                    <button class="block bg-bright hover:bg-yellow-300 px-4 py-2 text-white rounded-md" onClick={props.onLoadWalletBalances}>
                        <p class="text-white text-lg">
                            Load Balances
                        </p>
                    </button>
                </div>
            </div>

            {/* Balances */}

            {props.viewData.balances.length > 0 &&
                <div className="bg-gray-100 rounded-b-md px-6 pt-12 pb-6">
                    <WalletBalances2
                        balances={props.viewData.balances}
                        fiatAmount={props.viewData.payment}
                        fiatSymbol={props.viewData.fiatSymbol}
                        vendorId={props.viewData.vendorId}
                    />
                </div>
            }

            {!props.viewData.balances.length > 0 &&
                <div className="bg-gray-100 py-20 rounded-b-md p-6">
                    <p className="text-center text-gray-400">No balance loaded, click above to load</p>
                </div>
            }
        </div>
    );
}

let PayWithCryptoWithMetamask = withLocation(withSearchParams(withMetaMask(PayWithCrypto)))

export { PayWithCryptoWithMetamask as PayWithCrypto }
