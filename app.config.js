var TruffleContract = require('@truffle/contract')

let Token1 = TruffleContract(require ("../../../shared-contracts/cryptobank/Token2.json"))
let Token2 = TruffleContract(require ("../../../shared-contracts/cryptobank/Token2.json"))
let ERC20 = TruffleContract(require ("../../../shared-contracts/cryptobank/ERC20.json"))
let PaymentContract = TruffleContract(require ("../../../shared-contracts/cryptobank/PaymentContractTestNet.json"))
let PancakeRouter  = TruffleContract(require ("../../../shared-contracts/cryptobank/PancakeRouter.json"))

module.exports = {
    networks: {
        'local': {
            name: 'local',
            url: 'http://localhost:8545',
            tokensForPayment: [
                {
                    name: 'Token1',
                    symbol: 'TK1',
                    artifact: TruffleContract(Token1)
                },
                {
                    name: 'Token2',
                    symbol: 'TK2',
                    artifact: TruffleContract(Token2)
                },
            ],
            PaymentContract: {
                name: 'PaymentContract',
                artifact: TruffleContract(PaymentContract)
            },
            StableCoinForPayment: {
                symbol: "TK2",
                name: "Token2",
                artifact: TruffleContract(Token2)
            },
            PancakeRouter: {
                name: 'PancakeRouter',
                artifact: TruffleContract(PancakeRouter)
            }
        },
        parastate: {
            name: 'parastate',
            chainId: 123,
            url: 'https://rpc.parastate.io:8545',
        },
        bscTestnet: {
            name: 'bscTestnet',
            chainId: 97,
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
            tokensForPayment: [
                // {
                //     name: 'TST1',
                //     symbol: 'TST1',
                //     address: '0x1183C33d3ECB8D2C4e36B61545dBb1B72d6781c2',
                //     artifact: TruffleContract(ERC20)
                // },
                // {
                //     name: 'TST2',
                //     symbol: 'TST2',
                //     address: '0x452bDeC15046b960eC46e3c1Cf4F4CAeDD3B885f',
                //     artifact: TruffleContract(ERC20)
                // },
                // {
                //     name: 'TST3',
                //     symbol: 'TST3',
                //     address: '0x436FBC6Bd1ee45598633AcCb3A640E3F7aCa1D3C',
                //     artifact: TruffleContract(ERC20)
                // },
                // {
                //     name: 'TST4',
                //     symbol: 'TST4',
                //     address: '0x8bD0EDdB0Cdce2af01eBeCd5225703817e5fce77',
                //     artifact: TruffleContract(ERC20)
                // },
                {
                    name: 'BTC Dummy',
                    symbol: 'BTC',
                    address: '0x1e2F98D96E527E5E93873Fa4B2755b8261B94578',
                    artifact: TruffleContract(ERC20)
                },
            ],
            StableCoinForPayment: {
                name: 'USDT Dummy',
                symbol: 'USDT',
                address: '0xEE3E5274403476126EeE3589e0d84f337B931DED',
                // name: 'StableCoin',
                // symbol: 'STB',
                // address: '0xa93c1a951cc02eC95e93835B4cabaD2A29c9FBa5',
                artifact: TruffleContract(ERC20)
            },
            PaymentContract: {
                name: 'PaymentContract',
                address: '0xaC88DB27929D2f464341b20e8d4fc6EfA2114e6b', //New: '0x7C63beF564F87F534c7cbC7CcCE4a8C9615D2482',// Old: '0xaC88DB27929D2f464341b20e8d4fc6EfA2114e6b',
                artifact: TruffleContract(PaymentContract)
            },
            PancakeRouter: {
                name: 'PancakeRouter',
                address: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
                artifact: TruffleContract(PancakeRouter)
            },
            tokenOwnerAddress: '0xF49f67E80Be9ce22a75579adDB9AEb64d76E1199'
        },
    },
    get currentBlockChain() { return this.networks.bscTestnet },
    get tokensForPayment() { return this.currentBlockChain.tokensForPayment },
    get PaymentContract() { return this.currentBlockChain.PaymentContract },
    get StableCoinForPayment() { return this.currentBlockChain.StableCoinForPayment },
    get PancakeRouter() { return this.currentBlockChain.PancakeRouter },
    get tokenOwnerAddress() { return this.currentBlockChain.tokenOwnerAddress },
}