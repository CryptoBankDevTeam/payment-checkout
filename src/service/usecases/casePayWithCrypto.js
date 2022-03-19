import { BlockChainAccessor } from '../dataaccessors/blockChainAccessor';
import { PriceDataFeed } from '../dataaccessors/priceDataFeed';

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
            } else if(pair === "TST1NGN") {
                return 1/1e-15
            } else if(pair === "NGNTST1") {
                return 1e-15
            } else if(pair === "TST2NGN") {
                return 1/1e-15
            } else if(pair === "TST3NGN") {
                return 4/1
            } else if(pair === "TST1STB") {
                return 1/1
            } else if(pair === "STBTST1") {
                return 1/1
            } else if(pair === "STBNGN") {
                return 1/1e-15
            } else if(pair === "NGNSTB") {
                return 1e-15
            } else if(pair === "USDTNGN") {
                return 580
            } else if(pair === "NGNUSDT") {
                return 1/580
            } else if(pair === "BTCNGN") {
                return 26000000
            } else if(pair === "NGNBTC") {
                return 1/26000000
            } else if(pair === "BTCUSDT") {
                return 45000
            } else if(pair === "NGNBTC") {
                return 1/45000
            }
        } catch (e) {
            console.error(e)
        }     
    }

    async getStableCoinAmount({ fiatSymbol, fiatAmount, tokenSymbol, stableCoinSymbol }) {
        try {
            let stableCoinFiatPairPrice = await this.getPrice(`${stableCoinSymbol}${fiatSymbol}`)
            console.log(`stableCoinFiatPair symbol is ${stableCoinSymbol}${fiatSymbol}`)
            console.log(`stableCoinFiatPairPrice is ${stableCoinFiatPairPrice}`)
            if(!stableCoinFiatPairPrice) throw 'stableCoinFiatPairPrice not available!'
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

    async setPriceInformationForTokensInWallet({fiatSymbol, fiatAmount, balances}) {
        
        console.log(`in set Price Information`)
        console.log(balances)
        console.log(`Number of items is ${balances.length}`)

        let balancesWithPriceInfo = await balances.map(async balance => {

            console.log(`in set Price Information, pair is ${balance.symbol}${fiatSymbol}`)
            
            let tokenFiatPrice = await this.getPrice(`${balance.symbol}${fiatSymbol}`)
            console.log(`token-fiat price is ${tokenFiatPrice}`)

            // let stableCoinAmt = await this.getStableCoinAmount({ 
            //     fiatSymbol,
            //     fiatAmount, 
            //     tokenSymbol: balance.symbol,
            //     stableCoinSymbol: 'TK2',
            // })

            let neededToken = fiatAmount / tokenFiatPrice 
        
            let newBalanceInfo = {
                tokenQty: neededToken,
                symbol: balance.symbol,
                name: balance.name,
                balance: balance.balance,
                needed: neededToken,
                // usdPrice: await this.getPrice(`TK2${balance.symbol}`),
                // usdAmount: stableCoinAmt,
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

    async setPriceInformationForTokensInWalletOld({fiatSymbol, fiatAmount, balances}) {
        
        console.log(`in set Price Information`)
        console.log(balances)

        let balancesWithPriceInfo = []

        balancesWithPriceInfo = await balances.map(async balance => {

            console.log(`in set Price Information, pair is ${balance.symbol}${fiatSymbol}`)

            
            let tokenFiatPrice = await this.getPrice(`${balance.symbol}${fiatSymbol}`)
            console.log(`token-fiat price is ${tokenFiatPrice}`)

            let stableCoinAmt = await this.getStableCoinAmount({ 
                fiatSymbol,
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

    getApprovedTokens() {

    }

    async setupArtifacts(provider, account, web3) {
        await this.blockChainAccessor.setupArtifacts(provider, account, web3)
    }

    async loadBalances({fiatAmount, fiatSymbol}) {
        console.log(`in load Balances`)
        // Get list of approved tokens for payment
        let tokenList = await this.blockChainAccessor.tokensForPayment

        console.log(tokenList)

        // Get balances of tokens
        let balances = await this.blockChainAccessor.loadTokenBalancesFromBuyerWallet({tokenList})   

        console.log(`balances returned`)
        console.log(balances)

        let balancesWithPriceInfo = await this.setPriceInformationForTokensInWallet({fiatSymbol, fiatAmount, balances})

        // console.log(balances)
        console.log(balancesWithPriceInfo)
        
        return balancesWithPriceInfo
    }

    async approveTokenTransfer({tokenSymbol, tokenQty }) {
        console.log({tokenSymbol, tokenQty })
        return await this.blockChainAccessor.approveTokenTransfer({tokenSymbol, tokenQty })
    }

    async makePayment({vendorId,  fiatSymbol, fiatAmount , tokenSymbol, tokenQty}) {
        console.log(`In makePayment of casePayWIthCrypto`)

        let stableCoinSymbol = await (await this.blockChainAccessor.StableCoinForPayment).symbol()

        console.log(stableCoinSymbol)

        console.log({ 
            fiatSymbol, 
            fiatAmount, 
            tokenSymbol,
            stableCoinSymbol
        })

        let stableCoinAmt = await this.getStableCoinAmount({ 
            fiatSymbol, 
            fiatAmount, 
            tokenSymbol,
            stableCoinSymbol
        })

        // alert(`stableCoinAmount is ${stableCoinAmt}`)
        console.log(stableCoinAmt)

        return await this.blockChainAccessor.makePayment({vendorId,  fiatSymbol, fiatAmount , tokenSymbol, tokenQty, stableCoinAmt })
    }
}

export { CasePayWithCrypto, PriceDataFeed, LocalPriceDataFeed, BlockChainAccessor }