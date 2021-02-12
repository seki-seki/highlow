import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom'
import Header from "../header/header";
import {Web3Container} from "../../common/container/web3Container";
import {HighlowContainer} from "../../common/container/highlowContainer";
import Ratio from "./cards/ratio";
import styled from 'styled-components';
import Bet from "./cards/bet";
import PreviousGameResults from "./cards/previousGameResults";
import MyBets from "./cards/myBets";

const Home = () => {
  const {web3} = Web3Container.useContainer();
  const {game} = HighlowContainer.useContainer();
  const history = useHistory(web3);

  useEffect(() => {
    if (!web3) {
      history.push("/connect")
    }
  }, [web3]);
  if (!web3 || !game) {
    return <div>Loading...</div>
  }
  return <div>
    <Header/>
    <Cards>
      <Ratio/>
      <Bet/>
      <FlexCard>
        <PreviousGameResults/>
      </FlexCard>
    </Cards>
    <MyBets/>
  </div>
};

const Cards = styled.div`
  margin-top: 5%;
  display: flex;
  width: 100%
`;

const FlexCard = styled.div`
  flex: 1;
`;

export default Home;
