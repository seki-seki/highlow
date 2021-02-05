import Router from "./Route";
import {Web3Container} from "./common/container/web3Container"
import {HighlowContainer} from "./common/container/highlowContainer";

function App() {
  return (
    <Web3Container.Provider>
      <HighlowContainer.Provider>
        <Router/>
      </HighlowContainer.Provider>
    </Web3Container.Provider>
  );
}

export default App;
