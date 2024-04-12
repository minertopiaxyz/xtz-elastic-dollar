// require('dotenv').config();

const Dapp = require("./src/Dapp.js");
const PK = process.env.PRIVATEKEY_MAINNET ? process.env.PRIVATEKEY_MAINNET : null;

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const run = async () => {
  try {
    const dapp = new Dapp();
    await dapp.loadPrivateKey(PK, '8082');
    await dapp.initContracts();
    const data = await dapp.getCoingeckoData();
    console.log(data);
    if (data.updateOracle) {
      try {
        console.log('updateOracle..');
        const tx = await dapp.updateOracle(data.price);
        tx.wait();
        console.log('tx: ' + tx.hash);
        data.txHash = tx.hash;
      } catch (err) {
        console.error(err);
        data.txError = true;
      }
    }
    return data;
  } catch (err) {
    console.error(err);
  }
  return { error: true };
}

// run();
const handler = async (req, res) => {
  const params = req.query;
  const result = await run();
  return res.json(result);
};

module.exports = allowCors(handler);

