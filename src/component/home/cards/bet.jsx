import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import {makeDotByDecimal} from "../../../common/helper/decimalHelper";
import React, {useState, useCallback} from "react";


const Bet = () => {
  const {game, newestGameIndex, bet, update} = HighlowContainer.useContainer();
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState(0);
  const [errors, setErrors] = useState([]);
  const [betting, setBetting] = useState(false);
  const [transactionHash, setTransactionHash] = useState();
  const [success, setSuccess] = useState(false);
  const handlePushUp = useCallback(() => {
    setSide(0);
  });
  const handlePushDown = useCallback(() => {
    setSide(1);
  });

  const handleChangeAmount = useCallback((e) => {
    if (e.target.value === "") {
      setAmount("");
      return;
    }
    if (Number.parseInt(e.target.value)) {
      setAmount(Number.parseInt(e.target.value).toString());
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (amount < 10) {
      setErrors([...errors, `*Please enter price greater than 10 ${process.env.REACT_APP_CURRENCY_SYMBOL}`]);
      return;
    } else {
      setErrors(errors.filter(e => e !== `*Please enter price greater than 10 ${process.env.REACT_APP_CURRENCY_SYMBOL}`));
    }
    bet(newestGameIndex, side, amount,
      (transactionHash) => {
        setErrors([])
        setBetting(true);
        setTransactionHash(transactionHash);
      }, (error) => {
        setBetting(false);
        setErrors([...errors, error.message])
      })
      .then(() => {
        setBetting(false);
        setSuccess(true);
        update();
      })
  }, [amount, side, errors]);
  return <Card>
    <h2>{"opening bet".toUpperCase()}</h2>
    <p>Start Price</p>
    <p>{makeDotByDecimal(game.currentPrice, game.decimal)}</p>
    <p>{game.pairName}</p>
    <p>Will the price this time be UP or DOWN compared to the last result?</p>
    <Buttons>
      <UpButton selected={side === 0} onClick={handlePushUp}>UP</UpButton>
      <DownButton selected={side === 1} onClick={handlePushDown}>DOWN</DownButton>
    </Buttons>
    <input type="text" value={amount} onChange={handleChangeAmount}/>{process.env.REACT_APP_CURRENCY_SYMBOL}
    {errors?.length > 0 && errors.map((error,i) => (<Error key={i}>{error}</Error>))}
    <br/>
    <button onClick={handleSubmit}>BET</button><br/>
    {betting && `betting...
    transactionHash: 
    ${transactionHash}`}
    {success && "success"}
  </Card>
};

const Card = styled.div`
  margin-left: 5%;
  height: 50vh;
  overflow-y: scroll;
  width: 30%;
`;

const Buttons = styled.div`
  display: flex;
  margin-bottom: 3vh;
`;

const UpButton = styled.button`
  ${props => props.selected && `background: green`}
`;

const DownButton = styled.button`
  ${props => props.selected && `background: red`}
`;

const Error = styled.p`
  color: red;
`;
export default Bet;
