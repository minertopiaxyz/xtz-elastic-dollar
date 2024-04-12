
# Elastic Money $EM

## Submission for Scaling Web 3 Hackathon

[![Watch the video](https://img.youtube.com/vi/ZgCj2slJZo0/maxresdefault.jpg)](https://youtu.be/ZgCj2slJZo0)

### Problem statement:
Stablecoins are crucial for the development of new blockchains. However, expecting established issuers like Tether or Circle to readily deploy their tokens on every new chain is unrealistic.
Next problem is the current low yields on stablecoins within DeFi. This make government bonds a more attractive investment for users.

### Solution we propose:
An algorithmic or rebase token, inspired by [Ampleforth](https://www.coingecko.com/en/coins/ampleforth) and [Base Protocol](https://www.coingecko.com/en/coins/base-protocol), elastic money (EM) aimed to be priced as 1$ worth of native coin. We have build the proof of concept and deploy it on testnet.

Check the dapp in [Etherlink Testnet](https://elasticmoney.raijin.tech)
Check the dapp in [Shardeum Testnet](https://elasticmoney.raijin.tech)

## Unique Features
- Unlike other rebase tokens, EM is backed by $1 worth of a native coin. This means that for every $1 worth of the native coin, you can mint 1 EM. Conversely, burning 1 EM guarantees you $1 worth of the native coin.
- Elastic Money has a built-in protocol to ensure high yields for LP token stakers. This is achieved through a token emission event that happens right before a rebase. During the emission, new tokens are minted and distributed to a designated vault. The emission rate is set at 20% annually. Since the rebase happens immediately after the emission, the price of the token is expected to remain around 1$.

## How To Build
### Smart Contract
1. Enter folder sc
2. Upload ElasticMoney.sol & DummyLPToken.sol to [Remix](https://remix.ethereum.org)
3. Compile using solidity 0.8.9 with enable optimization 200
4. Deploy AlgoBank.sol and write its address
5. Go to coingecko or coinmarketcap to get the price of native coin
6. Run AlgoBank.setup(nativecoinpriceinwei)
7. Run AlgoBank.setupDummy() (do this only in testnet)
 
### Client
1. Enter folder client
2. Ensure nodejs version is 18
3. Run: npm install
4. Modify src/Config.js: Set BANK: "address of algobank contract from above"
5. Run: npm run start
6. Open page http://localhost:3000