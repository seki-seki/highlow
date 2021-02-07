import {HighlowContainer} from "../../common/container/highlowContainer";

const Header = () => {
  const {update} = HighlowContainer.useContainer();
  return <div>
    <h1>Binary Option</h1>
    <button onClick={update}>refresh</button>
  </div>
}

export default Header;
