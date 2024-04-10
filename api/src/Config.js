const config = {
  '8082': {
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
    CHAIN_ID: '8082'
  },
  '128123': {
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
    CHAIN_ID: '128123'
  }
}

let CHAIN_ID = null;

function set(chainId) {
  CHAIN_ID = chainId;
}

function get() {
  ret = config[CHAIN_ID];
  if (!ret) throw new Error('invalid config');
  return ret;
}

module.exports = {
  set,
  get
}