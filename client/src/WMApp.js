import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import App from './App';
// 1. Get projectId
const projectId = 'de1337b51d9e5820befc1a6f6c282cdf';

// 2. Set chains
const mainnet = {
  chainId: 128123,
  name: 'Etherlink Testnet',
  currency: 'XTZ',
  explorerUrl: 'https://testnet-explorer.etherlink.com',
  rpcUrl: 'https://node.ghostnet.etherlink.com'
}

// 3. Create a metadata object
const metadata = {
  name: 'Elastic Money',
  description: 'My Web3',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: []
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId
})

export default function WMApp() {
  return (
    <App />
  )
}