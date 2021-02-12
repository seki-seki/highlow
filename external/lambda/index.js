const Web3 = require('web3');
const abi = require("./abi");
const fetch = require("node-fetch")

const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.testnet.tomochain.com"));
web3.eth.accounts.wallet.add("0x434f4ff952fdca3416de622f93db5332e8480553a1d6596e1199730a66dfb599")
web3.eth.defaultAccount = "0x1a622Dd14C1f91f1313c9965B0d8FeD161dea03f"
const contract = new web3.eth.Contract(abi, "0x072b108eD5b61C2208Fb2006143e6bE2a63D7390");

const decimal = 2;
const pairName = "ETH/USD";
const myAddress = "0x1a622Dd14C1f91f1313c9965B0d8FeD161dea03f"
const timeUnit = 60000

exports.handler = async (event) => {
  const nowTimestamp = Date.now();
  const nowTimestampJustHour = nowTimestamp - nowTimestamp % timeUnit;
  const currentPrice = (await (await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD")).json()).USD * (10 ** decimal);
  console.log("currentPrice: ",currentPrice)
  const gasPrice = await web3.eth.getGasPrice()
  console.log("gasPrice: ",gasPrice)
  const newestGameIndex = await contract.methods.newestGameIndex().call();

  // start new game
  const closeTimestamp = nowTimestampJustHour + timeUnit;
  const resultTimestamp = closeTimestamp + timeUnit;
  const gasLimit = await contract
    .methods
    .createNewGame(nowTimestampJustHour, closeTimestamp, resultTimestamp, decimal, currentPrice,pairName)
    .estimateGas({from: myAddress})
    .catch(console.error);
  console.log(gasLimit);
  await contract
    .methods
    .createNewGame(nowTimestampJustHour, closeTimestamp, resultTimestamp, decimal, currentPrice,pairName)
    .send({
      from: myAddress,
      gasLimit : gasLimit + 10000,
      gasPrice: gasPrice * 4
    })
    .on('transactionHash', (hash) => {
      console.log("create hash",hash);
    })
    .catch(console.error)

  // result game
  if(newestGameIndex != 0) {
    const resultGameIndex = newestGameIndex - 1;
    console.log(`stop game: ${resultGameIndex}`);
    const gasLimit = await contract
      .methods
      .finishGame(resultGameIndex, currentPrice)
      .estimateGas({from: myAddress})
      .catch(console.error);
    console.log("stop game gasLimit: ",gasLimit);
    const receipt = await contract
      .methods
      .finishGame(resultGameIndex, currentPrice)
      .send({from: myAddress, gasLimit : gasLimit + 10000, gasPrice: gasPrice * 4})
      .on('transactionHash', (hash) => {
        console.log("stop game hash: ",hash);
      })
      .catch(console.error);
    console.log("receipt: ", receipt);
    const hashGasLimit = await contract.methods
      .setTransactionHash(resultGameIndex, receipt.transactionHash)
      .estimateGas({from: myAddress})
      .catch(console.error);
    await contract
      .methods
      .setTransactionHash(resultGameIndex, receipt.transactionHash)
      .send({from: myAddress, gasLimit : hashGasLimit + 10000, gasPrice: gasPrice * 4})
      .on('transactionHash', async (hash) => {
        console.log("set hash's hash: ",hash);
      })
  } else {
    console.log("skip stop game");
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda2!'),
  };
  return response;
};
