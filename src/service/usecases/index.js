import { CasePayWithCrypto, PriceDataFeed, LocalPriceDataFeed, BlockChainAccessor} from './casePayWithCrypto'
import { web3, web3Provider } from '../../web3/config'
import { Token1, Token2, PaymentContract } from '../../contracts/artifacts';

// let casePayWithCrypto = new CasePayWithCrypto({
//     blockChainAccessor: null, 
//     priceDataFeed: new PriceDataFeed()
// })

let localBlockChainAccessor = new BlockChainAccessor({ 
    web3, 
    web3Provider, 
    chainName: '', 
    Token1, 
    Token2, 
    PaymentContract 
})

let casePayWithCrypto = new CasePayWithCrypto({
    blockChainAccessor: localBlockChainAccessor, 
    priceDataFeed: new LocalPriceDataFeed()
})

let { blockChainAccessor, priceDataFeed } = casePayWithCrypto


export { priceDataFeed, blockChainAccessor, casePayWithCrypto }