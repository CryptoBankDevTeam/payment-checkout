let { web3Provider } = require ('../web3/config')
let { PaymentContract, StableCoinForPayment, PancakeRouter, currentBlockChain, tokensForPayment } = require('../../app.config.js')

module.exports = {
    get PaymentContract() {     
        PaymentContract.artifact.setProvider(web3Provider)
        console.log(web3Provider)
        return (async () => await PaymentContract.artifact.at(PaymentContract.address))()
    },
    get tokensForPayment() {
        return (async () => await Promise.all(tokensForPayment.map(async token => {
            // console.log(token)
            token.artifact.setProvider(web3Provider);
            return await token.artifact.at(token.address)
        })))()
    },
    get StableCoinForPayment() { 
        StableCoinForPayment.artifact.setProvider(web3Provider)
        return (async () => await StableCoinForPayment.artifact.at(StableCoinForPayment.address))()
    },
    get PancakeRouter() {
        PancakeRouter.artifact.setProvider(web3Provider)
        return (async () => await PancakeRouter.artifact.at(PancakeRouter.address))()
    },
    get currentBlockChain() { return currentBlockChain }
}