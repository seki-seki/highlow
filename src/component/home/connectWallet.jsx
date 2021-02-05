import React, {useCallback, useEffect} from "react";
import Web3 from "web3";
import Header from "../header/header";
import {useHistory} from 'react-router-dom'
import WalletConnectProvider from "@walletconnect/web3-provider";
import {Web3Container} from "../../common/container/web3Container";



const ConnectWallet = () => {
  const {web3, updateWeb3} = Web3Container.useContainer();
  const history = useHistory();
  const handleOnClickPantograph = useCallback(() => {
    if (process.env.REACT_APP_ENV === "development") {
      // ethereum
      if (window.ethereum?.chainId !== process.env.REACT_APP_CHAIN_ID) {
      } else {
        try {
          window.ethereum.enable().then(() => {
            updateWeb3(new Web3(window.ethereum))
          });
        } catch (e) {
          console.log("user deny access")
        }
      }
    } else if (process.env.REACT_APP_ENV === "staging") {
      if (window.tomochain) {
        // tomochain
        if (window.tomochain?.chainId !== process.env.REACT_APP_CHAIN_ID) {
        } else {
          try {
            window.tomochain.enable().then(() => {
              updateWeb3(new Web3(window.tomochain))
            });
          } catch (e) {
            console.log("user deny access")
          }
        }
      }
    }
  }, [updateWeb3]);

  const handleOnClickWalletConnect = useCallback(() => {
    const provider = new WalletConnectProvider({
      rpc: {
        3: process.env.REACT_APP_PROVIDER_URL,
        88: process.env.REACT_APP_PROVIDER_URL,
        89: process.env.REACT_APP_PROVIDER_URL
      },
    });
    provider.enable().then(() => {
      console.log("success")
      updateWeb3(new Web3(provider))
    }).catch(console.error);
  },[]);

  useEffect(() => {
    if(web3) {
      history.push("/")
    }
  },[web3]);

  return <div>
    <Header/>
    <p>Predict Cryptocurrency Price</p>
    <p>Guess whether crytocurrency goes up or down and win. It’s that easy!</p>
    <p>{"to start, connect this website with".toUpperCase()}</p>
    <button onClick={handleOnClickWalletConnect}>wallet connect</button>
    <button onClick={handleOnClickPantograph}>pantograph</button>
  </div>
};

export default ConnectWallet;
