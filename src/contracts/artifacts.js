let TruffleContract = require ("@truffle/contract")

let Token1 = TruffleContract(require ("../../../../../shared-contracts/cryptobank/Token1.json"))
let Token2 = TruffleContract(require ("../../../../../shared-contracts/cryptobank/Token2.json"))
let PaymentContract = TruffleContract(require ("../../../../../shared-contracts/cryptobank/PaymentContract.json"))

export  { Token1, Token2, PaymentContract }