/**
 * @jest-environment ./test/jest-environment-jsdom
 */

import { blockChainAccessor } from './service/usecases';
import { tokenOwnerAddress } from '../app.config.js'

let { PancakeRouter, StableCoinForPayment, PaymentContract, tokensForPayment, currentBlockChain, } = blockChainAccessor;


import { 
  web3,
  web3Provider, 
} from './web3/config'

import UUID from "uuidjs";

const Artifactor = require("@truffle/artifactor")
const artifactor = new Artifactor(__dirname);

jest.setTimeout(240 * 1000)

async function getToken(symbol) {
  let toks = await tokensForPayment
  return toks.find(async token => await token.symbol() === symbol)
}

let provider

beforeAll(async () => {
  provider = web3.currentProvider
})

test.skip('block chain url is valid', async() => {
//  console.log(currentBlockChain.tokensForPayment[0].artifact)
//   // currentBlockChain.PaymentContract.artifact.setProvider(web3Provider)
  
//   // expect(currentBlockChain.url).not.toBeNull

  let PaymentContract = currentBlockChain.PaymentContract.artifact

  PaymentContract.setProvider(web3Provider)

//   console.log(`web3 provider is`)

  let inst = await PaymentContract.at('0xaC88DB27929D2f464341b20e8d4fc6EfA2114e6b')
  
//   // console.log(inst)

//   // expect(currentBlockChain.tokensForPayment.length).toBeGreaterThan(0)
})

test.skip('load Payment contract on BscTestnet', async() => {
  let pc = await PaymentContract
  expect(pc.address).toBe('0xaC88DB27929D2f464341b20e8d4fc6EfA2114e6b')
  console.log(pc.address)
  console.log('test complete')
})

test.skip('load Stable contract on BscTestnet', async() => {
  let scfp = await StableCoinForPayment
  expect(scfp.address).toBe('0xa93c1a951cc02eC95e93835B4cabaD2A29c9FBa5')
  console.log(scfp.address)
  console.log('test complete')
})

test.skip('load Pancake router on BscTestnet', async() => {
  let pr = await PancakeRouter
  expect(pr.address).toBe('0xD99D1c33F9fC3444f8101754aBC46c52416550D1')
  console.log(pr.address)
  console.log('test complete')
})

test.skip('save contract artifact', async() => {
  let abiFile = require('./abis/PancakeRouterAbi.json')

  console.log(abiFile)

  artifactor.save({
    contractName: 'PancakeRouter',
    address:  currentBlockChain.PancakeRouter.address,
    abi: abiFile
  })
})

test.skip('load 1st ERC20 token for payment', async() => {
  let tk = (await tokensForPayment)[0]
  expect(tk.address).toBe(currentBlockChain.tokensForPayment[0].address)
  console.log(tk.address)
  console.log('test complete')
})

test.skip('load all ERC20 tokens for payment', async() => {

  let addresses = await Promise.all((await tokensForPayment).map(async token => {
    let tk = await token
    let sup = web3.utils.fromWei(await tk.totalSupply(),"wei")
    console.log(tk.address)
    console.log(`Total supply is ${sup}`)
    console.log(web3.utils.fromWei(await tk.decimals(),"wei"))

    return tk.address
  }))
  
  expect(addresses.length).toBe(4)
  console.log('test complete')
})

test.skip('get vendors in Payment Contract', async ()=> {
  let pc = await PaymentContract

  let vendors = await pc.vendors('7ced88de-debc-4b37-b18a-1ab2f507352d')

  console.log(vendors)
})

describe('approve and make payment', () => {

})

async function approvePayment() {

  let pc = await PaymentContract

  let token = await getToken("TST1")
  let stable = await StableCoinForPayment
  let vendorId = '7ced88de-debc-4b37-b18a-1ab2f507352d'
  let account
  let wallet = web3.eth.accounts.wallet
  let privateKey = '9552d1cccee1e1bb9ad929d561b16265b685f0d4e32e5bf1adb1d921038a40cd'
  let acct = wallet.add(`0x${privateKey}`)

  let accounts = await web3.eth.getAccounts()

  let symbol = await token.symbol()

  let myContract = new web3.eth.Contract(token.abi, await token.address)

  let encoded = myContract.methods.approve(pc.address, web3.utils.toWei((100 * 1.2).toString(), "wei")).encodeABI()

  let gas = await token.approve.estimateGas(pc.address, web3.utils.toWei((100 * 1.2).toString(), "wei"))

  let tx = {
    to: await token.address,
    data: encoded,
    gas: gas,
    gasPrice: 20000000000,
  }

  let acctFromPk = web3.eth.accounts.privateKeyToAccount(privateKey);

  let signed = await acctFromPk.signTransaction(tx)

  // console.log(signed)

  // console.log(signed.rawTransaction)

  let approved = await web3.eth.sendSignedTransaction(signed.rawTransaction)
  console.log(approved)
}

async function checkAllowance() {

  let pc = await PaymentContract

  let token = await getToken("TST1")

  let privateKey = '9552d1cccee1e1bb9ad929d561b16265b685f0d4e32e5bf1adb1d921038a40cd'
  let tkAdd = await token.address
  let pcAdd = await pc.address
  
  let approved = await token.approve(pcAdd, web3.utils.toWei((100 * 1.2).toString(), "wei"), {from: tokenOwnerAddress})
  console.log(approved.logs[0].args)

  let allowance = await token.allowance(tokenOwnerAddress, pcAdd)

  console.log(web3.utils.fromWei(allowance, "wei"))
  // let myContract = new web3.eth.Contract(token.abi, tkAdd)

  // let encoded = myContract.methods.allowance(tkAdd, pcAdd).encodeABI()

  // let gas = await token.allowance.estimateGas(tkAdd, pcAdd)

  // let tx = {
  //   to: await token.address,
  //   data: encoded,
  //   gas: gas,
  //   gasPrice: 20000000000,
  // }

  // let acctFromPk = web3.eth.accounts.privateKeyToAccount(privateKey);

  // let signed = await acctFromPk.signTransaction(tx)

  // console.log(signed)

  // console.log(signed.rawTransaction)

  // let allowance = await web3.eth.sendSignedTransaction(signed.rawTransaction)

  // console.log(allowance)
}

async function makePayment() {

  let pc = await PaymentContract

  console.log(await pc.address)

  let token = await getToken("TST1")
  let stable = await StableCoinForPayment
  let vendorId = '7ced88de-debc-4b37-b18a-1ab2f507352d'
  let tokenSymbol = await token.symbol()
  let balance = await token.balanceOf(tokenOwnerAddress)
  console.log(web3.utils.fromWei(balance, 'wei'))
  let usdAmountInBn = web3.utils.toWei((10).toString(), 'wei')
  let fiatSymbol = 'NGN'
  let fiatAmount = 10
  let paymentId = UUID.genV1().toString();

  console.log({
    vendorId,
    tokenSymbol,
    usdAmountInBn,
    fiatSymbol,
    fiatAmount,
    paymentId
  })

  let paymentResult = await pc.makePayment(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId, {from: tokenOwnerAddress})

  console.log(paymentResult)

  console.log(paymentResult.logs[0].args)
}

async function makePaymentOld() {

  let pc = await PaymentContract

  console.log(await pc.address)

  let token = await getToken("TST1")
  let stable = await StableCoinForPayment
  let vendorId = '7ced88de-debc-4b37-b18a-1ab2f507352d'
  let tokenSymbol = await token.symbol()
  let balance = await token.balanceOf(tokenOwnerAddress)
  console.log(web3.utils.fromWei(balance, 'wei'))
  let usdAmountInBn = web3.utils.toWei((10).toString(), 'wei')
  let fiatSymbol = 'NGN'
  let fiatAmount = 10
  let paymentId = UUID.genV1().toString();

  console.log({
    vendorId,
    tokenSymbol,
    usdAmountInBn,
    fiatSymbol,
    fiatAmount,
    paymentId
  })

  // let wallet = web3.eth.accounts.wallet
  let privateKey = '9552d1cccee1e1bb9ad929d561b16265b685f0d4e32e5bf1adb1d921038a40cd'
  // let acct = wallet.add(`0x${privateKey}`)

  let myContract = new web3.eth.Contract(pc.abi, await pc.address)
  
  let encoded = myContract.methods.makePayment(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId).encodeABI()
  let gas = await pc.makePayment.estimateGas(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId)

  let tx = {
    to: await pc.address,
    data: encoded,
    gas: gas*5,
    gasPrice: 20000000000,
  }

  let acctFromPk = web3.eth.accounts.privateKeyToAccount(privateKey);

  let signed = await acctFromPk.signTransaction(tx)

  console.log(signed)

  console.log(signed.rawTransaction)
  
  // let result = await paymentContract.makePayment(vendorId, token.address, usdAmountInBn, fiatSymbol, fiatAmount, tokenSymbol, paymentId, {from: accts[0]})

  let paymentResult = await web3.eth.sendSignedTransaction(signed.rawTransaction)

  console.log(paymentResult)

}

test('make payment', async ()=> {

  let pc = await PaymentContract

  //await approvePayment()
  await checkAllowance()
  await makePayment()

})
