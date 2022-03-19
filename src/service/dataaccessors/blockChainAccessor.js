import UUID from "uuidjs";

// let tokenList = (async () => await tokensForPayment())
// let tokensList = tokensForPayment.map(token => token.artifact)

export class BlockChainAccessor {

    constructor({
        PaymentContractDefinition,
        StableCoinForPaymentDefinition,
        PancakeRouterDefinition,
        tokensForPaymentDefinitions
    }) {
        this.PaymentContractDefinition = PaymentContractDefinition
        this.StableCoinForPaymentDefinition = StableCoinForPaymentDefinition
        this.PancakeRouterDefinition = PancakeRouterDefinition
        this.tokensForPaymentDefinitions = tokensForPaymentDefinitions

        this.PaymentContract = null
        this.StableCoinForPayment = null
        this.PancakeRouter = null
        this.tokensForPayment = null
        this.account = null
        this.web3 = null
    }
    
    async loadTokenBalancesFromBuyerWallet({ tokenList }) {

        console.log(`in loadTokenBalancesFromBuyerWallet`)

        if(!tokenList) return

        return Promise.all(
            tokenList.map(async token => {
                let bal = await this.loadBalance(token)

                console.log(`bal is`)
                console.log(bal)

                return bal
            })
        )
    }

    async loadBalance(token) {

        console.log(`in loadBalance`)
        console.log(token)
        
        let tokenPriceInformation = {
            tokenQty: 0,
            symbol: '',
            name: '',
            balance: '',
            usdPrice: 0,
            needed: '',
            usdAmount: 0,
            fiatPrice: 0
        }

        //let account = (await this.web3.eth.getAccounts())[0]
        // .then(accounts => {
        //     console.log(`chainId is: ${this.web3.givenProvider.chainId}`)
        //     return accounts[0]
        // })

        console.log(`account is ${this.account}`)

        // let tokenContract = await token.deployed()

        tokenPriceInformation.name = await token.name()
        tokenPriceInformation.symbol = await token.symbol()
        tokenPriceInformation.balance = this.web3.utils.fromWei(await token.balanceOf(this.account),"ether")
        console.log(`${Object.keys(token)}`)
        console.log(`${await token.symbol()}`)
        console.log(`${await token.name()}`)
        
        console.log(tokenPriceInformation)

        return tokenPriceInformation
    }

    async setupContract(contractDefinition, provider){
        contractDefinition.artifact.setProvider(provider)
        let contract = await contractDefinition.artifact.at(contractDefinition.address)

        if(!contract) return
        return contract
    }

    async setupArtifacts(provider, account, web3) {
        
        console.log(`contract artifacts setup`)

        this.web3 = web3
        console.log(this.web3)

        this.account = account
        console.log(this.account)
        
        this.PaymentContract = await this.setupContract(this.PaymentContractDefinition, provider)
        console.log(this.PaymentContract)

        this.StableCoinForPayment = await this.setupContract(this.StableCoinForPaymentDefinition, provider)
        console.log(this.StableCoinForPayment)
        
        this.PancakeRouter = await this.setupContract(this.PancakeRouterDefinition, provider)
        console.log(this.PancakeRouter)
        
        this.tokensForPayment = await Promise.all(this.tokensForPaymentDefinitions.map(async tokenDefinition => {
            return await this.setupContract(tokenDefinition, provider)
        }))
        console.log(this.tokensForPayment)
    }

    fromWei(value){
        return this.web3.utils.fromWei(value, 'ether')
    }

    async getToken(tokenSymbol){
        console.log(this.tokensForPayment)
        console.log(tokenSymbol)

        let tokenSymbols = await Promise.all(this.tokensForPayment.map(async tok => await tok.symbol()))

        console.log(tokenSymbols)

        let index = tokenSymbols.indexOf(tokenSymbol)

        console.log(index)

        return this.tokensForPayment[index]
        // return (this.tokensForPayment).find(async token => { 
        //     let symbol = await token.symbol()
        //     console.log(symbol)
        //     console.log(tokenSymbol)
        //     return symbol === tokenSymbol
        // })
    }

    async approveTokenTransfer({tokenSymbol, tokenQty }) {

        console.log(`token symbol is ${tokenSymbol}`)
        console.log(`token quantity is ${tokenQty}`)
        
        let accts = await this.web3.eth.getAccounts()
        console.log(accts)
        
        // Call contract
        let Token = await this.getToken(tokenSymbol)

        console.log(Token)

        if(Token) {
                
            let paymentContract = await this.PaymentContract
            
            let token = await Token

            console.log(token)

            console.log(paymentContract.address)

            let tokenQtyStr = this.web3.utils.toWei((tokenQty * 1.2).toFixed(18).toString())
            // alert(tokenQtyStr)
            console.log(`account is ${accts[0]}`)

            let approved = await token.approve(paymentContract.address, tokenQtyStr, {from: accts[0]})

            console.log(approved)

            return {success:true, approved }
        } else {
            return {success: false, msg: 'token not found'}
        }
    }

    async getUsdAmount(fiatAmount, fiatSymbol){

    }

    async makePayment({vendorId, fiatSymbol, fiatAmount, tokenSymbol, stableCoinAmt}) {
        console.log(`In makePayment of blockChainAccessor`)

        try {

            let accts = await this.web3.eth.getAccounts()
            
            console.log({vendorId, fiatSymbol, fiatAmount, tokenSymbol, stableCoinAmt})

            // Call contract
            let Token = await this.getToken(tokenSymbol)

            let usdAmountInBn = this.web3.utils.toWei((stableCoinAmt.toFixed(18)).toString(), "ether") 
            // alert(`usdAmount in localeString is ${stableCoinAmt}`)
            // alert(`usdAmount in BN is ${usdAmountInBn}`)
            if(Token && usdAmountInBn !== 0) {
                let token = await Token
                let paymentContract = await this.PaymentContract

                console.log(`stableCoinAmt is ${stableCoinAmt}`)
                
                console.log(`usdAmount in BN is ${usdAmountInBn}`)
                // alert(`usdAmount in BN is ${usdAmountInBn}`)
                let paymentId = UUID.genV1().toString();

                console.log({vendorId, token: token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId})
                
                console.log(accts[0])
                let gasEstimate = await paymentContract.vendors.estimateGas(vendorId, {from: accts[0]})
                console.log(`gas estimate is ${gasEstimate}`)
                
                let stableCoin = await paymentContract.stableCoin({from: accts[0]})
                console.log(`stablecoin address is ${stableCoin}`)

                let vendor = await paymentContract.vendors(vendorId, {from: accts[0]})
                console.log(vendor)

                gasEstimate = await paymentContract.makePayment.estimateGas(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId, {from: accts[0]}) 
                console.log(gasEstimate)

                let result = await paymentContract.makePayment(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId, {from: accts[0]})
                
                if(!result) throw 'Error in contract, result is null'

                let stableCoinContract = await this.StableCoinForPayment
                let stableCoinSymbol = await stableCoinContract.symbol()

                console.log(`stable coin symbol is: ${stableCoinSymbol}`)
                console.log(`vendorId is: ${vendorId}`)

                let balance = await paymentContract.vendorBalance(vendorId, stableCoinSymbol, {from: accts[0]})
                console.log(`vendor balance is ${this.fromWei(balance)}`)

                return result
            } else {

            }
        } catch (e) {
            console.error(e)
        }
    }
}