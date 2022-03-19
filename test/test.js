// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
import configObj from '../src/web3/config.js'

let { PancakeRouter, StableCoinForPayment, PaymentContract, tokensForPayment, currentBlockChain, } = require('../../../app.config')
let { tokenOwnerAddress } = require('../src/app.config.cjs')


let { 
  web3,
  web3Provider, 
} = configObj

const Artifactor = require("@truffle/artifactor")
const artifactor = new Artifactor(__dirname);

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
  let abiFile = require('../abis/PancakeRouterAbi.json')

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

test('make payment', async ()=> {

  let pc = await PaymentContract

  let token = await getToken("TST1")
  let stable = await StableCoinForPayment
  let vendorId = '7ced88de-debc-4b37-b18a-1ab2f507352d'
  let account

  console.log(provider)

  console.log(tokenOwnerAddress)

  let wallet = web3.eth.accounts.wallet
  let privateKey = '9552d1cccee1e1bb9ad929d561b16265b685f0d4e32e5bf1adb1d921038a40cd'
  let acct = wallet.add(`0x${privateKey}`)

  console.log(acct)

  let accounts = await web3.eth.getAccounts()
  console.log(accounts)

  let symbol = await token.symbol()
  console.log(symbol)

  console.log(token.abi)
  console.log(await token.address)

  let myContract = new web3.eth.Contract(token.abi, await token.address)

  let encoded = myContract.methods.approve(pc.address, web3.utils.toWei((1 * 1.2).toString(), "wei")).encodeABI()

  let gas = await token.approve.estimateGas(pc.address, web3.utils.toWei((1 * 1.2).toString(), "wei"))

  console.log(gas)

  let tx = {
    to: await token.address,
    data: encoded,
    gas,
    gasPrice: 2000000000,
  }

  console.log(tx)

  //let privateKeyBuffer = Buffer.from(privateKey, 'hex')

  let acctFromPk = web3.eth.accounts.privateKeyToAccount(privateKey);
  console.log(acctFromPk)

  // const customCommon = Common.forCustomChain(
  //   'mainnet',
  //   {
  //     name: 'bsctestnet',
  //     networkId: 97,
  //     chainId: 97,
  //   },
  //   'petersburg',
  // )
  

  // // let signed = await web3.eth.accounts.signTransaction(tx, acctFromPk.privateKey)
  // let Tx = require('@ethereumjs/tx').Transaction
  // let privateKeyBuffer = Buffer.from(privateKey, 'hex');

  // var txForSigning = new Tx(tx, {'chain':'bsc'});
  // txForSigning.sign()


  let signed = await acctFromPk.sign(tx)

  console.log(signed)

  console.log(signed.rawTransaction)

  await web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
  
  // console.log(sentTx)

  // sentTx.on("receipt", receipt => {
  //   console.log(receipt)
  // });

  // sentTx.on("error", err => {
  //   // do something on transaction error
  // });

  // let approved = await token.approve(pc.address, web3.utils.toWei((1 * 1.2).toString(), "wei"), {from: tokenOwnerAddress})

  // console.log(approved)

  //return //approved

})
