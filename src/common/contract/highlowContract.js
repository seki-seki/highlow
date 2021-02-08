import highlowContractABI from "./highlowContractABI";

class HighlowContract {
  constructor(web3) {
    this.contract = new web3.eth.Contract(highlowContractABI, process.env.REACT_APP_HIGH_LOW_CONTRACT_ADDRESS);
    this.web3 = web3;
  }

  async bet(gameIndex, side, price, onTransactionHash, onError) {
    console.log("bet start");
    const priceWei = process.env.REACT_APP_ENV === "development" ? price : price + "0".repeat(18); // price * 10 ** 18
    const myAddress = (await this.web3.eth.getAccounts())[0];
    return this.contract.methods.bet(gameIndex, side).send({
      from: myAddress,
      value: priceWei,
    }).on("transactionHash", onTransactionHash).on("error", onError)
  }

  async newestGameIndex() {
    return await this.contract.methods.newestGameIndex().call()
  }

  async getMyBets() {
    return await this.contract.methods.getMyBets().call({from: (await this.web3.eth.getAccounts())[0]})
  }

  async games(gameIndex) {
    return {...(await this.contract.methods.games(gameIndex).call()), gameIndex}
  }

  async getHighBets(gameIndex) {
    return await this.contract.methods.getHighBets(gameIndex).call()
  }

  async getLowBets(gameIndex) {
    return await this.contract.methods.getLowBets(gameIndex).call()
  }

  async getHighAmount(gameIndex) {
    return await this.contract.methods.getHighAmount(gameIndex).call()
  }

  async getLowAmount(gameIndex) {
    return await this.contract.methods.getLowAmount(gameIndex).call()
  }

  async getHighPercentage(gameIndex) {
    return await this.contract.methods.getHighPercentage(gameIndex).call()
  }

  async getLowPercentage(gameIndex) {
    return await this.contract.methods.getLowPercentage(gameIndex).call()
  }

  async getHighMagnificationPercent(gameIndex) {
    return await this.contract.methods.getHighMagnificationPercent(gameIndex).call()
  }

  async getLowMagnificationPercent(gameIndex) {
    return await this.contract.methods.getLowMagnificationPercent(gameIndex).call()
  }

}

export default HighlowContract;
