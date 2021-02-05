import {useEffect, useState} from "react";
import HighlowContract from "../contract/highlowContract";
import {Web3Container} from "./web3Container"
import {createContainer} from "unstated-next";

const useHighlow = () => {
  const {web3} = Web3Container.useContainer();
  const [contractInformation, setContractInformation] = useState({});
  useEffect(() => {
    console.log(web3)
    if (!web3) {
      return contractInformation;
    }
    const highlowContract = new HighlowContract(web3);
    const registerContractInformation = async (highlowContract) => {
      const newestGameIndex = await highlowContract.newestGameIndex().catch(() =>undefined);
      const highAmount = await highlowContract.getHighAmount(newestGameIndex).catch(() =>undefined);
      const lowAmount = await highlowContract.getLowAmount(newestGameIndex).catch(() =>undefined);
      const highPercentage = await highlowContract.getHighPercentage(newestGameIndex).catch(() =>undefined);
      const lowPercentage = await highlowContract.getLowPercentage(newestGameIndex).catch(() =>undefined);
      const highMagnificationPercent = await highlowContract.getHighMagnificationPercent(newestGameIndex).catch(() =>undefined);
      const lowMagnificationPercent = await highlowContract.getLowMagnificationPercent(newestGameIndex).catch(() =>undefined);
      const games = await highlowContract.games(newestGameIndex).catch(() =>undefined);
      const highBets = await highlowContract.getHighBets(newestGameIndex).catch(() =>undefined);
      const lowBets = await highlowContract.getLowBets(newestGameIndex).catch(() =>undefined);
      const myBets = await highlowContract.getMyBets().catch(() =>undefined);
      const bet = highlowContract.bet;

      setContractInformation({
        newestGameIndex,
        highAmount,
        lowAmount,
        highPercentage,
        lowPercentage,
        highMagnificationPercent,
        lowMagnificationPercent,
        games,
        highBets,
        lowBets,
        myBets,
        bet
      })
    };
    registerContractInformation(highlowContract);
  }, [web3])
  return contractInformation;
};

export const HighlowContainer = createContainer(useHighlow);
