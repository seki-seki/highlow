import React, {useEffect} from "react";
import {useHistory} from 'react-router-dom'
import Header from "../header/header";
import {Web3Container} from "../../common/container/web3Container";
import {HighlowContainer} from "../../common/container/highlowContainer";

const Home = () => {
  const {web3} = Web3Container.useContainer();
  const contractInformation = HighlowContainer.useContainer();
  console.log(contractInformation)
  const history = useHistory(web3);

  useEffect(() => {
    if(!web3) {
      history.push("/connect")
    }
  },[web3]);
  return <div>
    <Header/>
  </div>
};

export default Home;
