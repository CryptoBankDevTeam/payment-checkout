import { useState, useEffect } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { 
    getConnectionStatus,
    getChainId,
    getAccount,
    onConnect,
    onDisconnect,
    onChainChanged,
    onAccountsChanged,
    onMessage
} from '../web3/config'
import Web3 from 'web3';

let basicDetector = async () => {
    return  {
        detect: async () => await detectEthereumProvider()
    } 
}

let reliableDetector = async () => {
    let detect = () => {
        if (window.ethereum) {
            handleEthereum();
        } else {
            window.addEventListener('ethereum#initialized', handleEthereum, {
            once: true,
        });
        
            // If the event is not dispatched by the end of the timeout,
            // the user probably doesn't have MetaMask installed.
            setTimeout(handleEthereum, 3000); // 3 seconds
        }
        
        function handleEthereum() {
            const { ethereum } = window;
            if (ethereum && ethereum.isMetaMask) {
                console.log('Ethereum successfully detected!!!');
                return ethereum
                // Access the decentralized web!
            } else {
                console.log('Please install MetaMask!');
            }
        }
    }

    return {
        detect
    }
}

export function withMetaMask(Component){
    return ((props) => {
        let [connected, setConnected] = useState(false) 
        let [chainId, setChainId] = useState('None') 
        let [account, setAccount] = useState('None') 
        let [accounts, setAccounts] = useState([]) 
        let [web3, setWeb3] = useState(null) 
        let [message, setMessage] = useState('No message')
        let [provider, setProvider] = useState(null) 
        
        let connectionStatus = connected ? <p>True</p> : <p>False</p>
        
        useEffect(() => {        
            
            async function detectProvider() {

                let detector = await reliableDetector()  // or basicDetector

                console.log(detector)
                detector.detect()
            
                let prov = await detectEthereumProvider()
                setProvider(prov)
                setWeb3(new Web3(prov))
        
                if (provider) {
                    console.log('Metamask detected')
                    // startApp(provider); // initialize your app
                    await window.ethereum.enable()
        
                    handleSetupArtifacts()
                    
                    onConnect(provider, setConnected, setWeb3)
                    onDisconnect(provider, setConnected)
                    onChainChanged(provider, setChainId, setWeb3)
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
                    // provider.removeListener('connect');
                    // provider.removeListener('disconnect');
                    // provider.removeListener('chainChanged');
                    // provider.removeListener('accountsChanged');
                    // provider.removeListener('message');
                }
            }
        }, [provider]);

        // useEffect(async () => {        
    
        //     setProvider(await detectEthereumProvider())
    
        //     if (provider) {
        //         console.log('Metamask detected')
        //         // startApp(provider); // initialize your app
                
        //         onConnect(provider, setConnected)
        //         onDisconnect(provider, setConnected)
        //         onChainChanged(provider, setChainId)
        //         onAccountsChanged(provider, setChainId)
        //         onMessage(provider, setMessage)
    
        //         getConnectionStatus(provider, setConnected)
        //         getChainId(setChainId)
        //         getAccount(setAccount)
    
        //     } else {
        //         console.log('Please install MetaMask!');
        //     }
    
        //     return () => {
        //         provider.removeListener('connect');
        //         provider.removeListener('disconnect');
        //         provider.removeListener('chainChanged');
        //         provider.removeListener('accountsChanged');
        //         provider.removeListener('message');
        //     }
        // });
    
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

        async function handleSetupArtifacts() {
            console.log(`in setup artifacts of hoc`)
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
    
        return <Component 
                    data={{ provider,connectionStatus, chainId, account, web3, message }} 
                    test="testing message" 
                    onSetupArtifacts={handleSetupArtifacts}
                    onConnectAccounts={handleConnectAccounts} 
                    {...props}
                />
    })   
    //return props => <MetamaskWrapper {...props}/>
}

// export function withMetaMask(Component){
//     return ((props) => {
//         let [connected, setConnected] = useState(false) 
//         let [chainId, setChainId] = useState('None') 
//         let [account, setAccount] = useState('None') 
//         let [accounts, setAccounts] = useState([]) 
//         let [message, setMessage] = useState('No message')
//         let [provider, setProvider] = useState(null) 
        
//         let connectionStatus = connected ? <p>True</p> : <p>False</p>
    
//         useEffect(async () => {        
    
//             setProvider(await detectEthereumProvider())
    
//             if (provider) {
//                 console.log('Metamask detected')
//                 // startApp(provider); // initialize your app
                
//                 onConnect(provider, setConnected)
//                 onDisconnect(provider, setConnected)
//                 onChainChanged(provider, setChainId)
//                 onAccountsChanged(provider, setChainId)
//                 onMessage(provider, setMessage)
    
//                 getConnectionStatus(provider, setConnected)
//                 getChainId(setChainId)
//                 getAccount(setAccount)
    
//             } else {
//                 console.log('Please install MetaMask!');
//             }
    
//             return () => {
//                 provider.removeListener('connect');
//                 provider.removeListener('disconnect');
//                 provider.removeListener('chainChanged');
//                 provider.removeListener('accountsChanged');
//                 provider.removeListener('message');
//             }
//         });
    
//         let currentAccount = null
    
//         let handleAccountsChanged = (accounts) => {
//             if (accounts.length === 0) {
//                 // MetaMask is locked or the user has not connected any accounts
//                 console.log('Please connect to MetaMask.');
//             } else if (accounts[0] !== currentAccount) {
//                 currentAccount = accounts[0];
//                 console.log(currentAccount)
//                 // Do any other work!
//             }
//         }
    
//         function handleConnectAccounts() {
//             console.log(`In handleConnectAccounts`)
//             provider
//                 .request({ method: 'eth_requestAccounts' })
//                 .then(handleAccountsChanged)
//                 .catch((err) => {
//                     if (err.code === 4001) {
//                     // EIP-1193 userRejectedRequest error
//                     // If this happens, the user rejected the connection request.
//                         console.log('Please connect to MetaMask.');
//                     } else {
//                         console.error(err);
//                     }
//                 })
//         }
    
//         return (
//             <Component data={connectionStatus, chainId, account, message} test="testing message" onConnectAccounts={handleConnectAccounts} {...props}/>
//         );
//     })   
//     //return props => <MetamaskWrapper {...props}/>
// }