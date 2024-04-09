const Dapp = require("./src/Dapp.js");

const run = async () => {
  try {
    const dapp = new Dapp();
    await dapp.loadPrivateKey(process.env.PRIVATEKEY_TESTNET);
    await dapp.initContracts();
    const data = await dapp.getCoingeckoData();
    console.log(data);
    if (data.updateOracle) {
      const tx = await dapp.updateOracle(data.price);
      tx.wait();
      console.log('tx: ' + tx.hash);
    }
  } catch (err) {
    console.error(err);
  }
}

run();