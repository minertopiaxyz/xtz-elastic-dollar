const NOT_SET = {
  GAS: '',
  COIN_SYMBOL: '',
  TOKEN_SYMBOL: '',
  CHAIN_NAME: '',
  STAKE_TOKEN: '',
  REWARD_TOKEN: '',
  BANK: '',
  RPC: '',
  COINGECKO_URL: '',
  BOT_URL: '',
  COINGECKOID1: '',
  COINGECKOID2: '',
  CHAIN_ID: '',
  EURL: '',
  EXPLORER_URL: ''
};

const LIST_CHAIN_ID = ['128123', '8082'];

const config = {
  '8082': {
    GAS: 'SHM',
    COIN_SYMBOL: '$SHM',
    TOKEN_SYMBOL: '$EM',
    CHAIN_NAME: 'SHARDEUM SPHINX 1.X',
    STAKE_TOKEN: '$EM/USDT-LP',
    REWARD_TOKEN: '$EM',
    BANK: '0xF049c0491FC3cdeEB4B652103B8Fd02A1a087B0B',
    RPC: 'http://18.185.76.64:8080',
    COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    BOT_URL: 'https://xtz-elastic-dollar.vercel.app/api/bot8082',
    COINGECKOID1: 'bitcoin',
    COINGECKOID2: 'usd',
    CHAIN_ID: '8082',
    EURL: 'https://explorer-sphinx.shardeum.org/transaction/',
    EXPLORER_URL: 'https://explorer-sphinx.shardeum.org'
  },
  '128123': {
    GAS: 'XTZ',
    COIN_SYMBOL: '$XTZ',
    TOKEN_SYMBOL: '$EM',
    CHAIN_NAME: 'ETHERLINK TESTNET',
    STAKE_TOKEN: '$EM/XTZ-LP',
    REWARD_TOKEN: '$EM',
    BANK: '0xE1eD2419C1211eB631fde13fdeFE5970E6518e6B',
    RPC: 'https://node.ghostnet.etherlink.com/',
    COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd',
    BOT_URL: 'https://xtz-elastic-dollar.vercel.app/api/bot128123',
    COINGECKOID1: 'tezos',
    COINGECKOID2: 'usd',
    CHAIN_ID: '128123',
    EURL: 'https://testnet-explorer.etherlink.com/tx/',
    EXPLORER_URL: 'https://testnet-explorer.etherlink.com'
  }
}

// let CHAIN_ID = '8082';

// function set(chainId) {
//   CHAIN_ID = chainId;
// }

// function get() {
//   const ret = config[CHAIN_ID];
//   if (!ret) throw new Error('invalid config');
//   return ret;
// }

function getByChainId(chainId) {
  const ret = config[chainId];
  if (!ret) throw new Error('invalid config');
  return ret;
}

module.exports = {
  // set,
  // get,
  NOT_SET,
  LIST_CHAIN_ID,
  getByChainId
}