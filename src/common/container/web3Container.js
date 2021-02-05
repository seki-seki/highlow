import {useCallback, useState} from "react";
import { createContainer } from "unstated-next";

const useWeb3 = () => {
  const [web3, setWeb3] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const updateWeb3 = useCallback((web3) => {
    setWeb3(web3);
    setErrorMessage(void 0);
  },[setWeb3]);
  return {web3, updateWeb3, errorMessage};
};
export const Web3Container = createContainer(useWeb3);
