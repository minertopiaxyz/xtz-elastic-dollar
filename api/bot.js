const Dapp = require("./src/Dapp.js");
const PK = process.env.PRIVATEKEY_MAINNET ? process.env.PRIVATEKEY_MAINNET : null;

const run = async () => {
  try {
    const dapp = new Dapp();
    await dapp.loadPrivateKey(PK);
    await dapp.initContracts();
    const data = await dapp.getCoingeckoData();
    console.log(data);
    if (data.updateOracle) {
      const tx = await dapp.updateOracle(data.price);
      tx.wait();
      console.log('tx: ' + tx.hash);
      data.txHash = tx.hash;
    }
    return data;
  } catch (err) {
    console.error(err);
  }
  return { error: true };
}

// run();
module.exports = async (req, res) => {
  const params = req.query;
  const result = await run();
  return res.json(result);
};

