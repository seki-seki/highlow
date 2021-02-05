import {BrowserRouter, Route} from "react-router-dom";
import React from "react";
import Home from "./component/home/home";
import ConnectWallet from "./component/home/connectWallet";

const Router = () => (
  <BrowserRouter>
    <Route path="/" component={Home}/>
    <Route path="/connect" component={ConnectWallet}/>
  </BrowserRouter>
);

export default Router;
