import {useEffect, useState, useCallback} from "react";
import HighlowContract from "../contract/highlowContract";
import {Web3Container} from "./web3Container"
import {createContainer} from "unstated-next";

const useHighlow = () => {
  const {web3} = Web3Container.useContainer();
  const [contract, setContract] = useState();
  const [contractInformation, setContractInformation] = useState({});
  const [updating, setUpdating] = useState(false);
  const update = useCallback(() => registerContractInformation(contract), [contract]);
  const updateBets = useCallback(async () => {
    if(contract && !updating) {
      setUpdating(true);
      const newestGameIndex = contractInformation.newestGameIndex;
      const highAmount = await contract.getHighAmount(newestGameIndex).catch(() => undefined);
      const lowAmount = await contract.getLowAmount(newestGameIndex).catch(() => undefined);
      const highPercentage = await contract.getHighPercentage(newestGameIndex).catch(() => undefined);
      const lowPercentage = await contract.getLowPercentage(newestGameIndex).catch(() => undefined);
      const highBets = await contract.getHighBets(newestGameIndex).catch(() => undefined);
      const lowBets = await contract.getLowBets(newestGameIndex).catch(() => undefined);
      setContractInformation({...contractInformation, newestGameIndex, highAmount,lowAmount,highPercentage,lowPercentage, highBets, lowBets});
      setUpdating(false);
    }
  },[contractInformation, contract, setContractInformation, updating]);
  const registerContractInformation = async (highlowContract) => {
    setUpdating(true);
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
    const getHighAmount = highlowContract.getHighAmount.bind(highlowContract);
    const getLowAmount = highlowContract.getLowAmount.bind(highlowContract);
    const getHighMagnificationPercent = highlowContract.getHighMagnificationPercent.bind(highlowContract);
    const getLowMagnificationPercent = highlowContract.getLowMagnificationPercent.bind(highlowContract);
    const getNewestGameIndex = highlowContract.newestGameIndex.bind(highlowContract);
    const previousGames = (await Promise.all([...Array(10).keys()]
      .map(i => newestGameIndex - 1 - i >= 0 ? highlowContract.games(newestGameIndex - 1 - i) : void 0))).filter(exist => exist);

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
      getHighAmount,
      getLowAmount,
      getHighMagnificationPercent,
      getLowMagnificationPercent,
      getNewestGameIndex,
      previousGames,
    });
    setUpdating(false);
  };
  useEffect(() => {
    if (!web3) {
      return contractInformation;
    }
    const highlowContract = new HighlowContract(web3);
    setContract(highlowContract);
    registerContractInformation(highlowContract);
  }, [web3])
  return {...contractInformation, update, updateBets};
};

export const HighlowContainer = createContainer(useHighlow);
