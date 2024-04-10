const axios = require('axios');
const ethers = require('ethers').ethers;
const maxUINT = ethers.constants.MaxUint256;

const CHAIN_NAME = 'ETHERLINK TESTNET';
const BANK = '0xE1eD2419C1211eB631fde13fdeFE5970E6518e6B';
const RPC = 'https://node.ghostnet.etherlink.com/';
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd'
const BOT_URL = 'https://xtz-elastic-dollar.vercel.app/api/bot';
const COINGECKOID1 = 'tezos';
const COINGECKOID2 = 'usd';
const CHAIN_ID = '128123';
const ALGOBANK_ABI = require('./abis/AlgoBank.json');
const ESTOKEN_ABI = require('./abis/ESToken.json');
const PRICEORACLE_ABI = require('./abis/PriceOracle.json');
const WTOKEN_ABI = require('./abis/WToken.json');
const VAULT_ABI = require('./abis/Vault.json');
const ERC20_ABI = require('./abis/ERC20.json');

function wei2eth(wei) {
  return ethers.utils.formatUnits(wei, "ether");
}

function eth2wei(eth) {
  return ethers.utils.parseEther(eth);
}

module.exports = class Dapp {
  constructor() {
    this.OPTS = {};
    this.PROVIDER = null;
    this.SIGNER = null;
    this.USER_ADDRESS = null;
    this.RANDOM_WALLET = false;
  }

  async initContracts() {
    console.log('initContracts..');
    const signer = this.SIGNER;
    if (!signer) throw new Error('SIGNER not loaded.');
    this.bank = new ethers.Contract(BANK, ALGOBANK_ABI, signer);
    const addressToken = await this.bank.token();
    this.token = new ethers.Contract(addressToken, ESTOKEN_ABI, signer);
    const addressOracle = await this.bank.oracle();
    this.oracle = new ethers.Contract(addressOracle, PRICEORACLE_ABI, signer);
    const addressWToken = await this.bank.wToken();
    this.wtoken = new ethers.Contract(addressWToken, WTOKEN_ABI, signer);
    const addressVault = await this.bank.vault();
    this.vault = new ethers.Contract(addressVault, VAULT_ABI, signer);
    const addressStakeToken = await this.vault.stakingToken();
    this.stakeToken = new ethers.Contract(addressStakeToken, ERC20_ABI, signer);
    console.log('initContracts done..');
  }

  async loadMetamask() {
    if (!window.ethereum) throw new Error('Metamask not installed!!');
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    window.ethereum.enable();
    const connected = window.ethereum.isConnected();
    if (!connected) throw new Error('Metamask not connected!!');
    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    chainId = Number(chainId) + '';
    const allowedChainId = [CHAIN_ID];
    if (allowedChainId.indexOf(chainId) < 0) throw new Error('Metamask on wrong network!!');
    this.CHAIN_ID = chainId;
    this.PROVIDER = new ethers.providers.Web3Provider(window.ethereum);
    this.SIGNER = this.PROVIDER.getSigner();
    this.USER_ADDRESS = await this.SIGNER.getAddress();
    return this.USER_ADDRESS;
  }

  async loadPrivateKey(pk) {
    console.log('** read only wallet **');
    if (!pk) {
      const tmp = ethers.Wallet.createRandom();
      pk = tmp.privateKey;
      this.RANDOM_WALLET = true;
    }
    this.CHAIN_ID = CHAIN_ID;
    this.PROVIDER = new ethers.providers.JsonRpcProvider(RPC);
    this.SIGNER = new ethers.Wallet(pk, this.PROVIDER);
    this.USER_ADDRESS = await this.SIGNER.getAddress();
    return this.USER_ADDRESS;
  }

  isReadOnly() {
    return this.RANDOM_WALLET;
  }

  getSigner() {
    return this.SIGNER;
  }

  getUserAddress() {
    return this.USER_ADDRESS;
  }

  async getBlockTS() {
    return (await this.PROVIDER.getBlock('latest')).timestamp;
  }

  getChainName() {
    return CHAIN_NAME;
  }

  async getChainData() {
    console.log('getChainData..');
    const ret = {};

    const tot = await this.token.totalSupply();
    ret.tokenTotalSupply = wei2eth(tot);
    const bal = await this.PROVIDER.getBalance(this.bank.address);
    ret.bankCoinBalance = wei2eth(bal);
    const cnp = await this.bank.coinPrice();
    ret.bankCoinPrice = wei2eth(cnp);
    ret.bankCoinBalanceUsd = Number(ret.bankCoinBalance) * Number(ret.bankCoinPrice);
    const data = await this.getCoingeckoData();
    ret.coingeckoPrice = data.price;
    ret.rebase = data.rebase;

    const wei = eth2wei('1');
    const b = await this.bank.coinToToken(wei);
    const a = (ethers.BigNumber.from(wei)).mul(wei);
    const r = a.div(b);
    const to4d = (val) => Math.round(val * 100) / 100;

    const mint1 = Number(wei2eth(r));
    const mint2 = mint1 * Number(ret.bankCoinPrice);
    ret.mint1 = to4d(mint1);
    ret.mint2 = to4d(mint2);

    const c = await this.bank.tokenToCoin(wei);
    const burn1 = Number(wei2eth(c));
    const burn2 = burn1 * Number(ret.bankCoinPrice);
    ret.burn1 = to4d(burn1);
    ret.burn2 = to4d(burn2);

    // apr
    let yrps = await this.vault.calcYRPS('7');
    yrps = Number(wei2eth(yrps));

    let wtPrice = await this.wtoken.getPrice();
    wtPrice = Number(wei2eth(wtPrice));

    const yRewardUSD = yrps * wtPrice;
    const apr = yRewardUSD * 100;

    // 1 stake token assume to be 1$
    // reward token in $
    ret.apr = apr;

    console.log({ yrps, wtPrice, yRewardUSD, apr });
    console.log('getChainData done..');

    return ret;
  }

  async coinToToken(amount) {
    const wei = eth2wei(amount);
    let res = await this.bank.coinToToken(wei);
    res = wei2eth(res);
    return res;
  }

  async mint(amount) {
    const wei = eth2wei(amount);
    const tx = await this.bank.swapCoinToToken({ value: wei })
    return tx;
  }

  async tokenToCoin(amount) {
    const wei = eth2wei(amount);
    let res = await this.bank.tokenToCoin(wei);
    res = wei2eth(res);
    return res;
  }

  async burn(amount) {
    const wei = eth2wei(amount);
    const tx = await this.bank.swapTokenToCoin(wei)
    return tx;
  }

  async getUserData() {
    const userAddress = this.USER_ADDRESS;
    const userETH = await this.PROVIDER.getBalance(userAddress);
    const userToken = await this.token.balanceOf(userAddress);

    // apr, ownedStakeToken, stakedToken, unclaimedRewardToken
    const ownedStakeToken = await this.stakeToken.balanceOf(userAddress);
    const stakedToken = await this.vault.balanceOf(userAddress);
    const unclaimedRewardToken = await this.vault.unclaimedRewardESToken(userAddress);
    // const price = await this.wtoken.getPrice();
    // unclaimedRewardToken = Number(wei2eth(unclaimedRewardToken)) * Number(wei2eth(price));
    const stakeNeedApprove = await this.needApprove(this.stakeToken, this.vault.address);

    const ret = {
      userAddress,
      userETH: wei2eth(userETH),
      userToken: wei2eth(userToken),
      ownedStakeToken: wei2eth(ownedStakeToken),
      stakedToken: wei2eth(stakedToken),
      unclaimedRewardToken: wei2eth(unclaimedRewardToken),
      stakeNeedApprove
    }
    console.log(ret);
    return ret;
  }

  async needApprove(tokenSC, spenderAddress) {
    const userAddress = this.getUserAddress();
    const token = tokenSC;
    const allowance = await token.allowance(userAddress, spenderAddress);
    const owned = await token.balanceOf(userAddress);
    const ok = allowance.gte(owned) && allowance.gt('0');
    return !ok;
  }

  async approve(tokenSC, spenderAddress) {
    const opts = Object.assign({}, this.OPTS);
    const tx = await tokenSC.approve(spenderAddress, maxUINT, opts);
    return tx;
  }

  async triggerBot() {
    if (!BOT_URL) return;

    try {
      const url = BOT_URL;
      const res = await axios.get(url);
      console.log(res.data);
    } catch (err) {
    }
  }

  async getCoingeckoData() {
    try {
      const url = COINGECKO_URL;
      const res = await axios.get(url);
      console.log(res.data);
      const price = res.data[COINGECKOID1][COINGECKOID2];

      const op = await this.oracle.price();
      const opPrice = Number(wei2eth(op));

      const bp = await this.bank.coinPrice();
      const bpPrice = Number(wei2eth(bp));

      const ret = {
        price, opPrice, bpPrice
      }

      let updateOracle = false;
      let rebase = false;

      if (price !== opPrice) updateOracle = true;
      else if (opPrice !== bpPrice) rebase = true;

      ret.updateOracle = updateOracle;
      ret.rebase = rebase;

      return ret;
    } catch (err) {
      console.error(err);
    }
  }

  async updateOracle(price) {
    const priceWei = eth2wei('' + price);
    const tx = await this.oracle.setPriceVal(priceWei);
    return tx;
  }

  async rebase() {
    const tx = await this.bank.rebase();
    return tx;
  }

  async claimReward() {
    const tx = await this.vault.claimESToken();
    return tx;
  }

  async unstake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.vault.unstake(amountWei);
    return tx;
  }

  async approveStakeVault() {
    return await this.approve(this.stakeToken, this.vault.address);
  }

  async stake(amount) {
    const amountWei = eth2wei('' + amount);
    const tx = await this.vault.stake(amountWei);
    return tx;
  }

  async generateReward() {
    const tx = await this.bank.generateReward();
    return tx;
  }

}
