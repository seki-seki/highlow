import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom'
import Header from "../header/header";
import {Web3Container} from "../../common/container/web3Container";
import {HighlowContainer} from "../../common/container/highlowContainer";
import Ratio from "./cards/ratio";
import styled from 'styled-components';
import Bet from "./cards/bet";
import Time from "./cards/time";
import PreviousGameResults from "./cards/previousGameResults";
import MyBets from "./cards/myBets";

const Home = () => {
  const {web3} = Web3Container.useContainer();
  const {newestGameIndex} = HighlowContainer.useContainer();
  const history = useHistory(web3);

  useEffect(() => {
    if (!web3) {
      history.push("/connect")
    }
  }, [web3]);
  if (!web3 || !newestGameIndex) {
    return <div/>
  }
  return <div>
    <Header/>
    <Cards>
      <Ratio/>
      <Bet/>
      <HalfCard>
        <Time/>
        <PreviousGameResults/>
      </HalfCard>
    </Cards>
    <MyBets/>
  </div>
};

const Cards = styled.div`
  margin-top: 5%;
  display: flex;
  width: 100%
`;

const HalfCard = styled.div`
  flex: 1;
`;

export default Home;
