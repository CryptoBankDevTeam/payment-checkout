import axios from 'axios'
axios.defaults.baseURL = 'https://api.binance.com';

export class PriceDataFeed {
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