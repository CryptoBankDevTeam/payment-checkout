import React from 'react'
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import web3 from 'web3'
import Header from "../components/header";
import doneImg from '../images/done-img.png'
import pendingImg from '../images/pending-img.png'

import UUID from "uuidjs";

import { withLocation } from '../components/hocs'
import { withMetaMask } from '../components/hocWithMetamask'

import { casePayWithCrypto } from '../service/usecases';

// let vendorId = "7ced88de-debc-4b37-b18a-1ab2f507352d"

function ApprovalProgress(props) {
    return (
        <div class="flex flex-row items-center">
            <img src={doneImg}></img>
            <img src={pendingImg}></img>
            <img src={pendingImg}></img>
        </div>
    );
}

function WithdrawalProgress(props) {
    return (
        <div class="flex flex-row items-center">
            <img src={doneImg}></img>
            <img src={doneImg}></img>
            <img src={pendingImg}></img>
        </div>
    );
}

function CompleteProgress(props) {
    return (
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
            paymentStatus: 'approval',
            paymentId: ''
        }

        this.handleBackToVendorSite = this.handleBackToVendorSite.bind(this)
    }

    componentDidMount() {
        // alert(Object.keys(this.props.location))
        // alert(this.props.location.search)
        // let query = new URLSearchParams(this.props.location.search);
        // alert(query.get("fiatSymbol"))

        let location = this.props.location

        console.log('location is')
        console.log(location.state)

        this.setState({
            ...location.state
        }, async () => {
            console.log({ tokenSymbol: this.state.tokenSymbol, tokenQty: this.state.needed })
            let { success, approved } = await casePayWithCrypto.approveTokenTransfer({ tokenSymbol: this.state.tokenSymbol, tokenQty: this.state.needed })
            console.log(success)
            if (success) {
                this.setState({
                    paymentStatus: 'withdrawal'
                })

                console.log(`approval done`)
                console.log(approved)
                console.log({ vendorId: this.state.vendorId, fiatSymbol: this.state.fiatSymbol, fiatAmount: this.state.fiatAmount, tokenSymbol: this.state.tokenSymbol })

                let res = await casePayWithCrypto.makePayment({ vendorId: this.state.vendorId, fiatSymbol: this.state.fiatSymbol, fiatAmount: this.state.fiatAmount, tokenSymbol: this.state.tokenSymbol })

                console.log(res)
                console.log(res.logs)
                console.log(`payment transaction id: ${res.logs[1].args._transactionId}
                token amount: ${web3.utils.fromWei(res.logs[0].args._tokenAmount, "ether")}
                amount in USD: ${web3.utils.fromWei(res.logs[1].args._amountInUSD, "ether")}
                swapped amount: ${res.logs[0].args.amountOut}
                vendorId: ${res.logs[1].args._vendorId}`)
                this.setState({
                    paymentStatus: 'complete',
                    paymentId: res.logs[1].args._transactionId
                })
            }

            //let token2 = await Token2.deployed()

        })
    }

    handleBackToVendorSite() {
        window.top.postMessage({
            success: true,
            msg: 'payment-complete',
            tokenQty: this.state.tokenQty,
            tokenSymbol: this.state.tokenSymbol,
            usdAmount: this.state.usdAmount,
            fiatSymbol: this.state.fiatSymbol,
            fiatAmount: this.state.fiatAmount,
            paymentId: this.state.paymentId
        }, "*")
    }

    render() {

        let status
        if (this.state.paymentStatus === 'approval') {
            status = <div class="flex flex-col items-center justify-between">
                <StatusBox title={'Approval Pending'} />
                <ApprovalProgress />
            </div>
        } else if (this.state.paymentStatus === 'withdrawal') {
            status = <div class="flex flex-col items-center justify-between">
                <StatusBox title={'Withdrawal Pending'} />
                <WithdrawalProgress />
            </div>
        } else if (this.state.paymentStatus === 'complete') {
            status = <div class="flex flex-col items-center justify-between">
                <StatusBox title={'Payment Complete'} />
                <CompleteProgress />


                <button
                    class="mt-4 p-4 bg-primary rounded-md text-white"
                    onClick={this.handleBackToVendorSite}
                >Back to vendor site
                </button>


            </div>
        }

        return (
            <div class="flex flex-col h-full">
                <Header />

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

let PaymentStatusWithLocation = withMetaMask(withLocation(PaymentStatus))

export { PaymentStatusWithLocation as PaymentStatus }