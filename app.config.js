module.exports = {
    networks: {
        'local': { 
            url: 'http://localhost:8545',
            paymentContract: {
                address: ''
            },
            tokens: {
                token1: {
                    address: '',
                    abi: '',
                    token: '',
                },
                token2: {
                    address: '',
                    abi: ''
                },
            }
        },
        parastate: { 
            url: 'https://rpc.parastate.io:8545',
        },
        bscTestnet: { 
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
        },
    },
    currentBlockChain: this.networks.bscTestnet
}