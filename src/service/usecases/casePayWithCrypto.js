
import axios from 'axios'
axios.defaults.baseURL = 'https://api.binance.com';


class BlockChainAccessor {

    constructor({ web3, web3Provider, chainName, Token1, Token2, PaymentContract }) {
        this.web3 = web3
        // alert(this.web3)
        this.web3Provider = web3Provider
        this.chainName = chainName
        this.Token1 = Token1
        this.Token2 = Token2
        this.PaymentContract = PaymentContract
    }

    async loadBalances(paymentInFiat, paymentInStableCoin) {

        console.log(`in loadBalances`)

        let token1
        let token2

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

        this.Token1.setProvider(this.web3Provider)
        this.Token2.setProvider(this.web3Provider)

        let account = await this.web3.eth.getAccounts()
        .then(accounts => {
            console.log(`chainId is: ${this.web3.givenProvider.chainId}`)
            return accounts[0]
        })

        console.log(`account is ${account}`)

        return this.Token1.deployed()
        .then(contract => {
            token1 = contract
            return token1
        })
        .then(async tk => {
            token1PriceInformation.name = await tk.name()
            token1PriceInformation.symbol = await tk.symbol()
            token1PriceInformation.balance = this.web3.utils.fromWei(await tk.balanceOf(account),"ether")
            console.log(`${Object.keys(tk)}`)
            console.log(`${await tk.symbol()}`)
            console.log(`${await tk.name()}`)

            // Object.keys(token1PriceInformation).forEach(tk => {
            //     console.log(`${tk}: ${token1PriceInformation[tk]}`)
            // })

            // console.log(`${Object.keys(token1PriceInformation)}`)
            
            return [token1PriceInformation]
        })        
    }

    async loadWalletBalances(payment, usdAmount) {

        let account
        
        let token1
        let token2

        this.PaymentContract.setProvider(this.web3Provider)
        let paymentContract = await this.PaymentContract.deployed()

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

        return this.web3.eth.getAccounts()
        .then(res => {
            console.log(`chainId is: ${this.web3.givenProvider.chainId}`)
            account = res[0]
            return this.web3.eth.getBalance(account)
        })
        .then(res => {

            this.Token1.setProvider(this.web3Provider)
            this.Token2.setProvider(this.web3Provider)

            this.Token1.deployed()
            .then(contract => {
                token1 = contract
                return token1.name()
            }).then(name => {
                token1PriceInformation.name = name
                //alert(`name is ${token1Balance.name}`)
                return token1.symbol()
            }).then(symbol => {
                token1PriceInformation.symbol = symbol
                return //this.getPrice('BTCNGN')
            }).then(async fiatTokenPrice =>{
                token1PriceInformation.fiatPrice = fiatTokenPrice
                token1PriceInformation.usdAmount = await this.getUsdAmount(fiatTokenPrice, 'BTCBUSD')
                console.log(`token1 USD amount is ${token1PriceInformation.usdAmount}`)
                return token1.balanceOf(account)
            }).then(async balance => {
                token1PriceInformation.balance = this.web3.utils.fromWei(balance,"ether")
                
                token2 = await this.Token2.deployed()
                //token1PriceInformation.needed = (this.state.payment/token1PriceInformation.fiatPrice).toFixed(8)
                let path = []
                console.log(`token1 address is ${token1.address}`)
                path.push(token1.address);
                path.push(token2.address);

                token1PriceInformation.needed = this.web3.utils.fromWei(await paymentContract._requiredTokenAmount(this.web3.utils.toWei(token1PriceInformation.usdAmount.toString(), "ether"), path),"ether")
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
                token2PriceInformation.balance = this.web3.utils.fromWei(balance,"ether")
                // alert(this.state.payment)
                token2PriceInformation.needed = (payment/token2PriceInformation.fiatPrice).toFixed(8)
                console.log(`token1PriceInformation object is ${Object.values(token2PriceInformation).join(', ')}`)

                return [{...token1PriceInformation}, {...token2PriceInformation}]

                // setBalances([{...token1PriceInformation}, {...token2PriceInformation}])
                
                // this.setState(state => ({
                //     balances: [{...token1PriceInformation}, {...token2PriceInformation}],
                // }))
            })
            .catch(err => {
                console.log(err)
            })
        })
    }

}

class PriceDataFeed {
    async getPrice(pair) {
        try {
            let { data, status, config } = await axios.get('/api/v3/ticker/price?symbol='+pair)
            //alert(`status is ${status} ${Object.keys(config)}`)
            return data.price  
        } catch (e) {
            console.error(e)
        }     
    }

    async getStableCoinAmount({ fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol }) {
        try {
            let stableCoinFiatPairPrice = await this.getPrice(`${stableCoinSymbol}${fiatSymbol}`)
            let amt = fiatAmount / stableCoinFiatPairPrice
        return amt
        } catch (e) {
            console.error(e)
        }
    }
}

class LocalPriceDataFeed extends PriceDataFeed {
    async getPrice(pair) {
        try {
            if(pair === "NGNTK2"){
                return 1/100
            } else if(pair === "TK2NGN") {
                return 100
            } else if(pair === "NGNTK1") {
                return 1/50
            } else if(pair === "TK1NGN") {
                return 50
            } else if(pair === "TK1TK2") {
                return 100/50
            } else if(pair === "TK2TK1") {
                return 50/100
            }
        } catch (e) {
            console.error(e)
        }     
    }

    async getStableCoinAmount({ fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol }) {
        try {
            let stableCoinFiatPairPrice = await this.getPrice(`${stableCoinSymbol}${fiatSymbol}`)
            let amt = fiatAmount / stableCoinFiatPairPrice
        return amt
        } catch (e) {
            console.error(`error: ${e}`)
            console.error(e)
        }
    }
}

class CasePayWithCrypto {

    constructor({ blockChainAccessor, priceDataFeed }) {
        this.blockChainAccessor = blockChainAccessor
        this.priceDataFeed = priceDataFeed
    }

    async getPrice(pair) {
        console.log(`in getPrice, pair is ${pair}`)
        return await this.priceDataFeed.getPrice(pair)        
    }

    async getPrice(pair) {
        console.log(`in getPrice, pair is ${pair}`)
        return await this.priceDataFeed.getPrice(pair)        
    }

    async getStableCoinAmount({ fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol }) {
        return await this.priceDataFeed.getStableCoinAmount({ fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol })       
    }

    async setPriceInformationForTokensInWallet({fiatAmount, balances}) {
        
        console.log(`in set Price Information`)
        console.log(balances)

        let balancesWithPriceInfo = []

        balancesWithPriceInfo = await balances.map(async balance => {

            console.log(`in set Price Information, pair is ${balance.symbol}NGN`)

            let tokenFiatPrice = await this.getPrice(`${balance.symbol}NGN`)
            console.log(`token-fiat price is ${tokenFiatPrice}`)

            let stableCoinAmt = await this.getStableCoinAmount({ 
                fiatSymbol: 'NGN', 
                fiatAmount, 
                tokenSymbol: balance.symbol,
                stableCoinSymbol: 'TK2',
            })

            let neededToken = fiatAmount / tokenFiatPrice 
        
            let newBalanceInfo = {
                tokenQty: neededToken,
                symbol: balance.symbol,
                name: balance.name,
                balance: balance.balance,
                needed: neededToken,
                usdPrice: await this.getPrice(`TK2${balance.symbol}`),
                usdAmount: stableCoinAmt,
                fiatPrice: 0,
                fiatAmount
            }
            // balancesWithPriceInfo.push(balance)

            return newBalanceInfo
        })        

        return Promise.all(balancesWithPriceInfo).then((values) => {
            console.log(values);
            console.log(`number of tokens is ${values.length}`)
            console.log(values)

            return values
        });

    }

    async loadBalances({fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol}) {
        console.log(`in load balances, fiatSymbol is ${fiatSymbol}, fiatAmount ${fiatAmount}, tokenSymbol is ${tokenSymbol}, stableCoinSymbol is ${stableCoinSymbol}`)
        
        let stableCoinAmount = await this.priceDataFeed.getStableCoinAmount({
            fiatSymbol, 
            fiatAmount, 
            tokenSymbol, 
            stableCoinSymbol
        })
        
        console.log(`stable coin is ${stableCoinAmount}`)

        let balances = await this.blockChainAccessor.loadBalances(fiatAmount, stableCoinAmount)

        console.log(balances)

        let balancesWithPriceInfo = await this.setPriceInformationForTokensInWallet({fiatAmount, balances})

        // console.log(balances)
        console.log(balancesWithPriceInfo)
        
        return balancesWithPriceInfo
    }

    loadWalletBalances(data) {
        this.blockChainAccessor.loadWalletBalances(data)        
    }

}

export { CasePayWithCrypto, PriceDataFeed, LocalPriceDataFeed, BlockChainAccessor }