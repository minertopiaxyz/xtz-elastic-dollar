import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';
import Config from './Config';
import App from './App';

// 1. Get projectId
const projectId = 'de1337b51d9e5820befc1a6f6c282cdf';

const c1 = Config.getByChainId('8082');
const c2 = Config.getByChainId('128123');
const cs = [c1, c2];
const chains = [];
for (let i = 0; i < cs.length; i++) {
  const c = cs[i];
  chains.push(
    {
      chainId: Number(c.CHAIN_ID),
      name: c.CHAIN_NAME,
      currency: c.GAS,
      explorerUrl: c.EXPLORER_URL,
      rpcUrl: c.RPC
    }
  );
}

// 2. Set chains
// const mainnet = {
//   chainId: Number(CHAIN_ID),
//   name: CHAIN_NAME,
//   currency: GAS,
//   explorerUrl: EXPLORER_URL,
//   rpcUrl: RPC
// }

// 3. Create a metadata object
const metadata = {
  name: 'Elastic Money',
  description: 'Elastic Money',
  url: 'https://xtz-elastic-dollar.vercel.app', // origin must match your domain & subdomain
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
  chains: chains,
  projectId
})

export default function WMApp() {
  return (
    <App />
  )
}