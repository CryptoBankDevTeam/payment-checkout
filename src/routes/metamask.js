import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { 
    web3, 
    web3Provider, 
    accounts,
    getConnectionStatus,
    getChainId,
    getAccount,
    onConnect,
    onDisconnect,
    onChainChanged,
    onAccountsChanged,
    onMessage
} from '../web3/config'

function Metamask(props) {

    let [connected, setConnected] = useState(false) 
    let [chainId, setChainId] = useState('None') 
    let [account, setAccount] = useState('None') 
    let [accounts, setAccounts] = useState([]) 
    let [message, setMessage] = useState('No message')
    let [provider, setProvider] = useState(null) 
    
    let connectionStatus = connected ? <p>True</p> : <p>False</p>

    useEffect(() => {        
        async function detectProvider() {
            let prov = await detectEthereumProvider()
            setProvider(prov)

            if (provider) {
                console.log('Metamask detected')
                // startApp(provider); // initialize your app
                
                onConnect(provider, setConnected)
                onDisconnect(provider, setConnected)
                onChainChanged(provider, setChainId)
                onAccountsChanged(provider, setChainId)
                onMessage(provider, setMessage)
    
                getConnectionStatus(provider, setConnected)
                getChainId(setChainId)
                getAccount(setAccount)
    
            } else {
                console.log('Please install MetaMask!');
            }
        }

        detectProvider()

        return () => {
            if(provider) {
                provider.removeListener('connect');
                provider.removeListener('disconnect');
                provider.removeListener('chainChanged');
                provider.removeListener('accountsChanged');
                provider.removeListener('message');
            }
        }
    }, [provider]);

    let currentAccount = null

    let handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== currentAccount) {
            currentAccount = accounts[0];
            console.log(currentAccount)
            // Do any other work!
        }
    }

    function handleConnectAccounts() {
        console.log(`In handleConnectAccounts`)
        provider
            .request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                if (err.code === 4001) {
                // EIP-1193 userRejectedRequest error
                // If this happens, the user rejected the connection request.
                    console.log('Please connect to MetaMask.');
                } else {
                    console.error(err);
                }
            })
    }

    return (
        <div className='p-4'>
            <h1 className='text-2xl'>Metamask Connect</h1>

            <button className='mt-6 text-white bg-blue-600 px-4 py-2 rounded' onClick={handleConnectAccounts}>Connect to wallet</button>

            <p className='mt-6 text-blue-600'>Connection status:</p>
            {connectionStatus}
            
            <p className='mt-6 text-blue-600'>Current chain:</p>
            <p>{chainId}</p>

            <p className='mt-6 text-blue-600'>Current account:</p>
            <p>{account}</p>

            <p className='mt-6 text-blue-600'>Message:</p>
            <p>{message}</p>
        </div>
    );
}

export { Metamask }