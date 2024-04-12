import { useEffect, useState, useReducer, createContext } from "react";
import Dapp from './Dapp';
import { dappReducer, dappInitialState } from './reducer/DappReducer';
import PopupTx from "./PopupTx";
import Lib from "./Lib";
import moment from 'moment';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import Config from "./Config";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';

export const DappContext = createContext();

const { COIN_SYMBOL, TOKEN_SYMBOL, CHAIN_NAME, STAKE_TOKEN, REWARD_TOKEN, CHAIN_ID } = Config.get();

function Loading() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const itv2 = setInterval(() => {
      setCounter(1 + (moment().unix() % 7));
    }, 1000);
    return () => clearInterval(itv2);
  }, []);

  return (
    <div>
      Loading{".".repeat(counter)}
    </div>
  );
}
function TheApp() {
  const { chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const connected = (isConnected && chainId === Number(CHAIN_ID) && walletProvider);

  const [state, dispatch] = useReducer(dappReducer, dappInitialState);
  const [connection, setConnection] = useState('busy');
  const [dapp, setDapp] = useState(null);
  const [chainName, setChainName] = useState('');
  const [userData, setUserData] = useState({});
  const [chainData, setChainData] = useState({});
  const [mintAmount, setMintAmount] = useState('');
  const [mintResultAmount, setMintResultAmount] = useState('0.0');
  const [burnAmount, setBurnAmount] = useState('');
  const [burnResultAmount, setBurnResultAmount] = useState('0.0');
  const [tab, setTab] = useState(0);
  const [tabMB, setTabMB] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [zapInAmount, setZapInAmount] = useState('');

  const onMintAmountChange = async (amount) => {
    setMintAmount(amount);
    if (Number(amount) > 0) {
      const res = await dapp.coinToToken(amount);
      setMintResultAmount(res);
    } else {
      setMintResultAmount('0.0');
    }
  }

  const onBurnAmountChange = async (amount) => {
    setBurnAmount(amount);
    if (Number(amount) > 0) {
      const res = await dapp.tokenToCoin(amount);
      setBurnResultAmount(res);
    } else {
      setBurnResultAmount('0.0');
    }
  }

  const refreshData = async () => {
    try {
      const userData = await dapp.getUserData();
      const chainData = await dapp.getChainData();
      setUserData(userData);
      setChainData(chainData);
    } catch (err) {
      console.error(err);
    }
  }

  const onMint = async () => {
    const amount = mintAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.mint(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onBurn = async () => {
    const amount = burnAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.burn(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onRebase = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.rebase();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onClaimReward = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.claimReward();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onUnstake = async () => {
    const amount = unstakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.unstake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onApprove = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.approveStakeVault();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onStake = async () => {
    const amount = stakeAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.stake(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  // const onGenerateReward = async () => {
  //   try {
  //     Lib.openPopupTx();
  //     dispatch({ type: 'TX_SHOW' });
  //     const tx = await dapp.generateReward();
  //     dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
  //     await tx.wait();
  //     await refreshData();
  //     dispatch({ type: 'TX_SUCCESS' });
  //     console.log('success');
  //   } catch (err) {
  //     console.error(err);
  //     const errMsg = JSON.stringify(err);
  //     dispatch({ type: 'TX_ERROR', txError: errMsg });
  //   }
  // }

  const onApproveZapIn = async () => {
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.approveZapIn();
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  const onZapIn = async () => {
    const amount = zapInAmount;
    try {
      Lib.openPopupTx();
      dispatch({ type: 'TX_SHOW' });
      const tx = await dapp.zapIn(amount);
      dispatch({ type: 'TX_SET_HASH', txHash: tx.hash });
      await tx.wait();
      await refreshData();
      dispatch({ type: 'TX_SUCCESS' });
      console.log('success');
    } catch (err) {
      console.error(err);
      const errMsg = JSON.stringify(err);
      dispatch({ type: 'TX_ERROR', txError: errMsg });
    }
  }

  let { tokenTotalSupply, bankCoinBalance, bankCoinPrice, bankCoinBalanceUsd, coingeckoPrice, rebase,
    mint1, mint2, burn1, burn2, apr, tokenPrice } = chainData;
  // let coinWorth = Number(bankCoinPrice) > 0 ? (1 / Number(bankCoinPrice)) : '0.0';
  // coinWorth = Math.floor(coinWorth * 10000) / 10000;
  apr = Math.round(apr * 10000) / 10000;

  let { ownedStakeToken, stakedToken, unclaimedRewardToken, stakeNeedApprove, zapInNeedApprove } = userData;



  let PanelConnected = null;
  let PanelInfo = null;
  let PanelTabMintBurn = null;
  let PanelMint = null;
  let PanelBurn = null;
  let PanelStake = null;
  let PanelZap = null;

  PanelConnected = (
    <div className="bg-base-200 p-4">
      <Loading />
    </div>
  );

  if (connection === 'connected') {
    PanelConnected = (
      <div className="bg-base-200 p-4">
        Connected to: {chainName}<br />
        <p className="w-[80vw] truncate">{userData?.userAddress}</p>
        {COIN_SYMBOL}: {userData?.userETH}<br />
        {TOKEN_SYMBOL}: {userData?.userToken}<br />
        <p className="w-[80vw] truncate">{TOKEN_SYMBOL} CA: {userData?.tokenAddress}</p>
      </div>
    );

    PanelInfo = (
      <div className="w-full p-4 grid grid-cols-1 gap-2">
        <div>
          <span className="font-bold text-xl">1 {TOKEN_SYMBOL} = {tokenPrice}$</span><br />
          {TOKEN_SYMBOL} total supply: {tokenTotalSupply}<br />
          algobank collateral: {bankCoinBalance} {COIN_SYMBOL}<br />
          algobank collateral in $: {bankCoinBalanceUsd} $<br />
          {COIN_SYMBOL} algobank price: {bankCoinPrice} $<br />
          {COIN_SYMBOL} coingecko price: {coingeckoPrice} $<br />
        </div>
        <div>
          <button className="btn btn-neutral btn-outline w-full" disabled={!rebase} onClick={onRebase}>Rebase</button>
        </div>
      </div>
    );


    PanelMint = (
      <div className="grid grid-cols-1 gap-2 py-2">
        <div className="">
          For {mint1} {COIN_SYMBOL} (worth {mint2}$) mint 1 {TOKEN_SYMBOL}
        </div>
        <div className="">
          <input type="text" placeholder={"Amount " + COIN_SYMBOL} className="input input-bordered w-full"
            value={mintAmount} onChange={(e) => onMintAmountChange(e.target.value)}
          />
        </div>
        <div className="">
          receive {mintResultAmount} {TOKEN_SYMBOL}
        </div>
        <div>
          <button className="btn btn-neutral btn-outline w-full" onClick={onMint}>Mint</button>
        </div>
      </div>
    );

    PanelBurn = (
      <div className="grid grid-cols-1 gap-2 py-2">
        <div className="">
          Burn 1 {TOKEN_SYMBOL} for {burn1} {COIN_SYMBOL} (worth {burn2}$)
        </div>
        <div className="">
          <input type="text" placeholder={"Amount " + TOKEN_SYMBOL} className="input input-bordered w-full"
            value={burnAmount} onChange={(e) => onBurnAmountChange(e.target.value)}
          />
        </div>
        <div className="">
          receive {burnResultAmount} {COIN_SYMBOL}
        </div>
        <div>
          <button className="btn btn-neutral btn-outline w-full" onClick={onBurn}>Burn</button>
        </div>
      </div>
    );

    PanelTabMintBurn = (
      <div className="w-full p-4 grid grid-cols-1 gap-2">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" value="tab-0" className="tab" aria-label="Mint"
            checked={tabMB === 0} onChange={e => e.currentTarget.value === "tab-0" ? setTabMB(0) : setTabMB(1)} />
          <div role="tabpanel" className="tab-content">
            {PanelMint}
          </div>
          <input type="radio" value="tab-1" className="tab" aria-label="Burn"
            checked={tabMB === 1} onChange={e => e.currentTarget.value === "tab-1" ? setTabMB(1) : setTabMB(0)} />
          <div role="tabpanel" className="tab-content">
            {PanelBurn}
          </div>
        </div>
      </div>
    );

    PanelStake = (
      <div className="w-full p-4 grid grid-cols-1 gap-2">
        <div className="grid grid-cols-1 gap-1">
          <div>
            Stake {STAKE_TOKEN} to earn {REWARD_TOKEN}<br />
            <span className="font-bold text-xl">APR {apr}%</span><br />
            Owned: {ownedStakeToken} {STAKE_TOKEN}<br />
            Staked: {stakedToken} {STAKE_TOKEN}<br />
            Reward: {unclaimedRewardToken} {REWARD_TOKEN}<br />
            <div className="flex flex-row gap-2">
              <button className="btn btn-neutral btn-outline btn-sm" onClick={onClaimReward}
                disabled={!(Number(unclaimedRewardToken) > 0)}
              >Claim Reward</button>
              {/* <button className="btn btn-neutral btn-outline btn-sm" onClick={onGenerateReward}>Refresh</button> */}
            </div>
          </div>

        </div>
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" value="tab-0" className="tab" aria-label="Stake"
            checked={tab === 0} onChange={e => e.currentTarget.value === "tab-0" ? setTab(0) : setTab(1)} />
          <div role="tabpanel" className="tab-content">
            <div className="grid grid-cols-1 gap-2 py-2">
              <div className="">
                <input type="number" placeholder={"Stake " + STAKE_TOKEN} className="input input-bordered w-full"
                  value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <button className="btn btn-neutral btn-outline w-full" onClick={onApprove}
                    disabled={!stakeNeedApprove}
                  >Approve</button>
                </div>
                <div>
                  <button
                    disabled={stakeNeedApprove}
                    className="btn btn-neutral btn-outline w-full" onClick={onStake}>Stake</button>
                </div>
              </div>
            </div>
          </div>
          <input type="radio" value="tab-1" className="tab" aria-label="Unstake"
            checked={tab === 1} onChange={e => e.currentTarget.value === "tab-1" ? setTab(1) : setTab(0)} />
          <div role="tabpanel" className="tab-content">
            <div className="grid grid-cols-1 gap-2 py-2">
              <div className="">
                <input type="text" placeholder={"Unstake " + TOKEN_SYMBOL} className="input input-bordered w-full"
                  value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)}
                />
              </div>
              <div className="">
                <button className="btn btn-neutral btn-outline w-full" onClick={onUnstake}>Unstake</button>
              </div>
            </div>
          </div>
        </div>


      </div>
    );

    PanelZap = (
      <div className="w-full p-4 grid grid-cols-1 gap-2">
        <div className="">
          Get {STAKE_TOKEN} by providing liquidity for pair {TOKEN_SYMBOL}/{COIN_SYMBOL} in dex.<br />
        </div>
        <div className="">
          <button className="btn btn-neutral btn-outline btn-sm" onClick={() => console.log('click')} disabled={true}>Get LP</button>
        </div>
        <div className="">
          or ZAP {TOKEN_SYMBOL} in to {STAKE_TOKEN}
        </div>
        <div className="">
          <input type="number" placeholder={"Amount " + TOKEN_SYMBOL} className="input input-bordered w-full"
            value={zapInAmount} onChange={(e) => setZapInAmount(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <button
              disabled={!zapInNeedApprove}
              className="btn btn-neutral btn-outline w-full" onClick={onApproveZapIn}>Approve</button>
          </div>
          <div>
            <button
              disabled={zapInNeedApprove}
              className="btn btn-neutral btn-outline w-full" onClick={onZapIn}>ZAP</button>
          </div>
        </div>


      </div>
    );
  } else if (connection === "error") {
    PanelConnected = (
      <div className="bg-base-200 p-4 grid grid-cols-1 gap-2">
        <div>
          ensure metamask installed,<br />
          set metamask network to {CHAIN_NAME},<br />
          refresh the page
        </div>
      </div >
    );
  }

  // useEffect(() => {
  //   const DAPP = new Dapp();
  //   setDapp(DAPP);
  //   init(DAPP);

  //   let busy = false;
  //   const itv = setInterval(async () => {
  //     if (!busy) {
  //       busy = true;
  //       try {
  //         if (DAPP) await DAPP.triggerBot();
  //       } catch (err) {
  //         console.error(err);
  //       }
  //       busy = false;
  //     }
  //   }, 60000);

  //   return () => {
  //     clearInterval(itv);
  //   }
  // }, []);

  useEffect(() => {
    let busy = false;
    const itv = setInterval(async () => {
      if (!busy) {
        busy = true;
        try {
          if (connected && dapp) await dapp.triggerBot();
        } catch (err) {
          console.error(err);
        }
        busy = false;
      }
    }, 60000);

    return () => {
      clearInterval(itv);
    }
  }, []);

  const init = async (_walletProvider) => {
    const ethersProvider = new ethers.providers.Web3Provider(_walletProvider);
    const signer = await ethersProvider.getSigner();
    // const address = await signer.getAddress();

    const DAPP = new Dapp();
    setDapp(DAPP);

    try {
      await DAPP.loadSigner(signer);
      await DAPP.initContracts();
      const userData = await DAPP.getUserData();
      const chainData = await DAPP.getChainData();
      await DAPP.triggerBot();
      setUserData(userData);
      setChainData(chainData);
      setChainName(DAPP.getChainName());
      setConnection('connected');
    } catch (err) {
      console.log(err);
      console.log('metamask error');
      setConnection('error');
    }
  }

  useEffect(() => {
    if (connected) {
      init(walletProvider);
    }
  }, [connected, walletProvider]);

  return (
    <DappContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen flex justify-center bg-gray-500 font-mono text-sm">

        <div className="flex-1 max-w-3xl min-h-screen bg-base-100 flex flex-col">
          <div className="bg-neutral text-neutral-content flex justify-end p-4">
            <w3m-button />
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-2 p-4 py-8 bg-primary text-primary-content flex flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Elastic Money {TOKEN_SYMBOL}</h1>
                <p>Clutching coins brings only a cold comfort; true wealth has slipped from my grasp.</p>
              </div>
              <FaMoneyBillTrendUp className="text-white w-[72px] h-[72px]" />
            </div>
            <div className="col-span-2">
              {PanelConnected}
            </div>
          </div>
          {connection === 'connected' ? (
            <div className="grid grid-cols-2">
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-100">
                <div className="p-4">
                  Inspired by Ampleforth, Elastic Money is a rebase token that aims to be priced at $1 by dynamically readjusting its supply.
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-100">
                {PanelInfo}
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-200">
                {PanelTabMintBurn}
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-200">
                <div className="p-4">
                  1 token value is backed by a $0.99 worth of native coin collateral. Elastic Money is minted or burned to maintain a $1 peg to native coin.
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-300">
                <div className="p-4">
                  Liquidity providers take the biggest risk. To compensate, a staking reward is provided.
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-300">
                {PanelZap}
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-100">
                {PanelStake}
              </div>
              <div className="col-span-2 md:col-span-1 min-h-fit md:min-h-[50vh] flex items-center bg-base-100">
                <div className="p-4">
                  High-risk, high-reward stablecoin. Elastic Money has a built-in mechanism to ensure high yields for stakers.
                </div>
              </div>

            </div>
          ) : null}
          <div className="flex-1 bg-base-200">
          </div>
          <div className="p-4 bg-neutral text-neutral-content">
            <div>Developed by Raijin for Scale Web 3 Hackathon</div>
          </div>
        </div>
        <PopupTx />
      </div >
    </DappContext.Provider>
  );
}

export default TheApp;
