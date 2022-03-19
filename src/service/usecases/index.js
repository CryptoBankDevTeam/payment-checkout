import { CasePayWithCrypto, PriceDataFeed, LocalPriceDataFeed, BlockChainAccessor} from './casePayWithCrypto'
import { 
    PaymentContract as PaymentContractDefinition, 
    StableCoinForPayment as StableCoinForPaymentDefinition, 
    PancakeRouter as PancakeRouterDefinition, 
    tokensForPayment as tokensForPaymentDefinitions
} from '../../../app.config'

import { web3, web3Provider } from '../../web3/config'


// let casePayWithCrypto = new CasePayWithCrypto({
//     blockChainAccessor: null, 
//     priceDataFeed: new PriceDataFeed()
// })

// let tokenContracts
// let paymentContract

// if(currentBlockChain.name === 'local'){

// } else if (currentBlockChain.name === 'bscTestnet') {
//     tokenContracts = (async() => await tokensForPayment)()
//     paymentContract = (async() => await PaymentContract)()
// }

let localBlockChainAccessor = new BlockChainAccessor({ 
    PaymentContractDefinition,
    StableCoinForPaymentDefinition,
    PancakeRouterDefinition,
    tokensForPaymentDefinitions
})

let casePayWithCrypto = new CasePayWithCrypto({
    blockChainAccessor: localBlockChainAccessor, 
    priceDataFeed: new LocalPriceDataFeed()
})

let { blockChainAccessor, priceDataFeed } = casePayWithCrypto

export { priceDataFeed, blockChainAccessor, casePayWithCrypto }