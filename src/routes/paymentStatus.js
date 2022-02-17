import React from 'react'
import { Link } from "react-router-dom";
import {  useLocation } from "react-router-dom";
import {Token1, Token2, PaymentContract} from '../contracts/artifacts';

import { web3, web3Provider, accounts } from '../web3/config'
import Header from "../components/header";
import doneImg from '../images/done-img.png'
import pendingImg from '../images/pending-img.png'

import UUID from "uuidjs";

let vendorId = "7ced88de-debc-4b37-b18a-1ab2f507352d"

function ApprovalProgress(props) {
    return(
        <div class="flex flex-row items-center">
            <img src={doneImg}></img>
            <img src={pendingImg}></img>
            <img src={pendingImg}></img>
        </div>
    );
}

function WithdrawalProgress(props) {
    return(
        <div class="flex flex-row items-center">
            <img src={doneImg}></img>
            <img src={doneImg}></img>
            <img src={pendingImg}></img>
        </div>
    );
}

function CompleteProgress(props) {
    return(
        <div class="flex flex-row items-center">
            <img src={doneImg}></img>
            <img src={doneImg}></img>
            <img src={doneImg}></img>
        </div>
    );
}

function StatusBox(props) {
    return (
        <p class="pt-36 text-2xl text-center p-4">{props.title}</p>
    );
}

class PaymentStatus extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tokenSymbol: '',
            tokenQty: 0,
            usdAmount: 0,
            fiatSymbol: '',
            fiatAmount: 0,
            paymentStatuses: ['approval', 'withdrawal'],
            paymentStatus: 'approval'
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
            fiatAmount: query.get("fiatAmount")
        },async ()=> {
            console.log(`token symbol is ${this.state.tokenSymbol}`)
            console.log(`token quantity is ${this.state.tokenQty}`)
            console.log(`USD amount is ${this.state.usdAmount}`)
            console.log(`fiat symbol is ${this.state.fiatSymbol}`)
            console.log(`fiat amount is ${this.state.fiatAmount}`)
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

                return token1.approve(paymentContract.address, web3.utils.toWei((this.state.tokenQty * 1.2).toString(), "ether"), {from: accts[0]})
            })
            .then(res => {
                // return paymentContract.vendorBalance(vendorId, {from: accounts[0]})
                console.log(`approved ${res.tx}`)
                this.setState({
                    paymentStatus: 'withdrawal'
                })
            })
            .then(res => {
                // console.log(`payment contract token2 initial balance: ${res}`)
                // alert(token1.address)
                let usdAmt = Number(this.state.usdAmount).toFixed(2)
                console.log(`usdAmount is ${usdAmt}`)
                let usdAmountInBn = web3.utils.toWei(usdAmt.toString(), "ether")  
                console.log(`usdAmount in BN is ${usdAmountInBn}`)
                let paymentId = UUID.genV1().toString();
                return paymentContract.makePayment(vendorId, token1.address, usdAmountInBn, this.state.fiatSymbol, this.state.fiatAmount, this.state.tokenSymbol, paymentId, {from: accts[0]})
            })
            .then(res => {
                console.log(res.logs) 
                console.log(`payment transaction id: ${res.logs[1].args._transactionId}
                token amount: ${web3.utils.fromWei(res.logs[0].args._tokenAmount, "ether")}
                amount in USD: ${web3.utils.fromWei(res.logs[1].args._amountInUSD, "ether")}
                swapped amount: ${res.logs[0].args.amountOut}
                vendorId: ${res.logs[1].args._vendorId}`)
                this.setState({
                    paymentStatus: 'complete'
                })
                //return paymentContract.vendorBalance(vendorId, {from: accts[0]})
            })
            .catch(err => {
                console.log(err)
            })
	        //let token2 = await Token2.deployed()

        })
    }

    render () {

        let status
        if(this.state.paymentStatus === 'approval') {
            status = <div class="flex flex-col items-center justify-between">                        
                        <StatusBox title={'Approval Pending'}/>
                        <ApprovalProgress/>
                    </div>
        } else if(this.state.paymentStatus === 'withdrawal') {
            status = <div class="flex flex-col items-center justify-between">                        
                        <StatusBox title={'Withdrawal Pending'}/>
                        <WithdrawalProgress/>
                    </div>
        } else if(this.state.paymentStatus === 'complete') {
            status = <div class="flex flex-col items-center justify-between">                        
                        <StatusBox title={'Payment Complete'}/>
                        <CompleteProgress/>
                        
                        <Link to="/">
                            <p class="mt-4 p-4 bg-primary rounded-md text-white">Back to check out</p>
                        </Link>

                    </div>
        }

        return(
            <div class="flex flex-col h-full">
                <Header/>
                <div class="flex flex-col h-full bg-cover bg-top bg-paymentStatusBkg">
                    <h1 class="pt-8 pb-6 text-4xl font-bold text-center text-white">Payment Status</h1>

                    {status}
                    
                    {/* <h1>Payment Status</h1> */}
                    {/* <p>{this.state.tokenSymbol}</p>
                    <p>{this.state.tokenQty}</p>
                    <p>{this.state.usdAmount}</p>
                    <p>{this.state.fiatSymbol}</p> */}
                </div>
            </div>
        );
    }
}

export default PaymentStatus