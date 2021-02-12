import {useEffect, useState, useCallback} from "react";
import HighlowContract from "../contract/highlowContract";
import {Web3Container} from "./web3Container"
import {createContainer} from "unstated-next";

const useHighlow = () => {
  const {web3} = Web3Container.useContainer();
  const [contract, setContract] = useState();
  const [contractInformation, setContractInformation] = useState({});
  const update = useCallback(() => registerContractInformation(contract), [contract]);
  const registerContractInformation = async (highlowContract) => {
    const newestGameIndex = await highlowContract.newestGameIndex().catch(() => undefined);
    const highAmount = await highlowContract.getHighAmount(newestGameIndex).catch(() => undefined);
    const lowAmount = await highlowContract.getLowAmount(newestGameIndex).catch(() => undefined);
    const highPercentage = await highlowContract.getHighPercentage(newestGameIndex).catch(() => undefined);
    const lowPercentage = await highlowContract.getLowPercentage(newestGameIndex).catch(() => undefined);
    const highMagnificationPercent = await highlowContract.getHighMagnificationPercent(newestGameIndex).catch(() => undefined);
    const lowMagnificationPercent = await highlowContract.getLowMagnificationPercent(newestGameIndex).catch(() => undefined);
    const game = await highlowContract.games(newestGameIndex).catch(() => undefined);
    const highBets = await highlowContract.getHighBets(newestGameIndex).catch(() => undefined);
    const lowBets = await highlowContract.getLowBets(newestGameIndex).catch(() => undefined);
    const myBets = await highlowContract.getMyBets().catch(() => undefined);
    const bet = highlowContract.bet.bind(highlowContract);
    const getGameByIndex = highlowContract.games.bind(highlowContract);
    const getHighMagnificationPercent = highlowContract.getHighMagnificationPercent.bind(highlowContract);
    const getLowMagnificationPercent = highlowContract.getLowMagnificationPercent.bind(highlowContract);
    const getNewestGameIndex = highlowContract.newestGameIndex.bind(highlowContract);
    const previousGames = (await Promise.all([...Array(10).keys()]
      .map(i => newestGameIndex - 1 - i >= 0 ? highlowContract.games(newestGameIndex - 1 - i) : void 0)))

    setContractInformation({
      newestGameIndex,
      highAmount,
      lowAmount,
      highPercentage,
      lowPercentage,
      highMagnificationPercent,
      lowMagnificationPercent,
      game,
      highBets,
      lowBets,
      myBets,
      bet,
      getGameByIndex,
      getHighMagnificationPercent,
      getLowMagnificationPercent,
      getNewestGameIndex,
      previousGames
    })
  };
  useEffect(() => {
    if (!web3) {
      return contractInformation;
    }
    const highlowContract = new HighlowContract(web3);
    setContract(highlowContract);
    registerContractInformation(highlowContract);
  }, [web3])
  return {...contractInformation, update};
};

export const HighlowContainer = createContainer(useHighlow);
