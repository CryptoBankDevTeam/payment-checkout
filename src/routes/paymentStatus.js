import React from 'react'
import {  useLocation } from "react-router-dom";
import {Token1, Token2, PaymentContract} from '../contracts/artifacts';

import { web3, web3Provider, accounts } from '../web3/config'

let vendorId = "0xaretyrir1A"



class PaymentStatus extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tokenSymbol: '',
            tokenQty: 0,
            usdAmount: 0,
            fiatSymbol: ''
        }
    }

    componentDidMount() {
        // alert(Object.keys(this.props.location))
        // alert(this.props.location.search)
        let query = new URLSearchParams(this.props.location.search);
        // alert(query.get("fiatSymbol"))
        
        this.setState({
            tokenSymbol: query.get("tokenSymbol"),
            tokenQty: query.get("tokenQty"),
            usdAmount: query.get("usdAmount"),
            fiatSymbol: query.get("fiatSymbol"),
        },async ()=> {
            console.log(`token symbol is ${this.state.tokenSymbol}`)
            console.log(`token quantity is ${this.state.tokenQty}`)
            console.log(`USD amount is ${this.state.usdAmount}`)
            console.log(`fiat symbol is ${this.state.fiatSymbol}`)
            // alert(this.state.tokenQty)
            // alert(this.state.fiatSymbol)
            let accts = await web3.eth.getAccounts()
            // Call contract
            Token1.setProvider(web3Provider)
            Token2.setProvider(web3Provider)
            PaymentContract.setProvider(web3Provider)
            
            let token1
            let token2
            let paymentContract = await PaymentContract.deployed()
            
            Token1.deployed()
            .then(token => {

                token1 = token
                // return token1.name()

                // get approval

                return token1.approve(paymentContract.address, web3.utils.toWei((this.state.tokenQty * 10).toString(), "ether"), {from: accts[0]})
            })
            .then(res => {
                // return paymentContract.vendorBalance(vendorId, {from: accounts[0]})
                console.log(`approved ${res.tx}`)
            })
            .then(res => {
                console.log(`payment contract token2 initial balance: ${res}`)
                // alert(token1.address)
                console.log(`usdAmount is ${web3.utils.toBN(Number(this.state.usdAmount))}`)
                
                return paymentContract.makePayment(vendorId, token1.address, this.state.usdAmount, this.state.fiatSymbol, 10, this.state.tokenSymbol, "0x1", {from: accts[0]})
            })
            .then(res => {
                console.log(res.logs) 
                console.log(`payment transaction id: ${res.logs[1].args._transactionId}
                token amount: ${res.logs[0].args._tokenAmount}
                amount in USD: ${res.logs[1].args._amountInUSD}
                swapped amount: ${res.logs[0].args.amountOut}
                vendorId: ${res.logs[1].args._vendorId}`)
                //return paymentContract.vendorBalance(vendorId, {from: accts[0]})
            })
            .catch(err => {
                console.log(err)
            })
	        //let token2 = await Token2.deployed()

        })
    }

    render () {
        return(
            <div>
                <h1>Payment Status</h1>
                <p>{this.state.tokenSymbol}</p>
                <p>{this.state.tokenQty}</p>
                <p>{this.state.usdAmount}</p>
                <p>{this.state.fiatSymbol}</p>
            </div>
        );
    }
}

export default PaymentStatus