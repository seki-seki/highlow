import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import dateFormat from "dateformat";
import Countdown from "react-countdown";
import {useState, useEffect, useMemo} from "react";
import Web3 from "web3";
import Side from "../../../common/constants/Side";

const MyBets = () => {
  const {myBets, getGameByIndex, getHighMagnificationPercent, getLowMagnificationPercent} = HighlowContainer.useContainer();
  const myBetsOrderByTime = useMemo(() => [...myBets].sort((a, b) => {
    return Number.parseInt(b.timestamp) - Number.parseInt(a.timestamp)
  }), [myBets]);
  const [betsWithResult, setBetsWithResult] = useState([]);
  useEffect(() => {
    const setUp = async () => {
      const betsWithResult = await Promise.all(myBetsOrderByTime.map(async (bet) => {
        const game = await getGameByIndex(bet.gameIndex);
        const gameIsFinished = game.finished;
        const isWin = game.winner === bet.side;
        const isNoGame = game.winner === Side.noGame;
        const rate = bet.side === "0" ? await getHighMagnificationPercent(bet.gameIndex) : await getLowMagnificationPercent(bet.gameIndex);
        return {...bet, gameIsFinished, isWin, rate, game, isNoGame}
      }));
      setBetsWithResult(betsWithResult);
    };
    setUp();
  }, [myBetsOrderByTime]);
  return <Card>
    <h2>YOUR PARTICIPATION</h2>
    <Table>
      <TableHeader>
        <TableCell>INDEX</TableCell>
        <TableCell>TIME</TableCell>
        <TableCell>BET AMOUNT</TableCell>
        <TableCell>BET ON</TableCell>
        <TableCell>RESULT</TableCell>
        <TableCell>TRANSACTION</TableCell>
      </TableHeader>
      {betsWithResult.map((bet) => <Col key={`${bet.game.gameIndex}${bet.side}${bet.amount}`} bet={bet}/>)}
    </Table>
  </Card>
};

const Col = ({bet}) => {
  const [isOvertime, setIsOvertime] = useState(false);
  return (
    <TableColumn>
      <TableCell>{bet.game.gameIndex}</TableCell>
      <TableCell>{dateFormat(new Date(Number.parseInt(bet.timestamp) * 1000), "mm/dd HH:MM:ss")}</TableCell>
      <TableCell>{Web3.utils.fromWei(bet.amount)}</TableCell>
      <TableCell>{bet.side === Side.high ? "UP" : bet.side === Side.low ? "DOWN" : bet.side === Side.draw ? "DRAW" : "NO GAME"}</TableCell>
      <TableCell>
        {!bet.gameIsFinished && (isOvertime ? (<p>in Calculation...</p>) : (
          <div>
            Result in <Countdown key={`${bet.game.gameIndex}${bet.side}${bet.amount}`}
                                 date={Number.parseInt(bet.game.resultTimestamp)} daysInHours
                                 onComplete={() => setIsOvertime(true)}/>
          </div>
        ))}
        {bet.gameIsFinished && (
          bet.side === Side.draw ? "DRAW":
          bet.isNoGame ? `NO GAME: ${Web3.utils.fromWei(String(bet.amount))}${process.env.REACT_APP_CURRENCY_SYMBOL} returns` :
            bet.isWin ? `WON : ${Web3.utils.fromWei(String(bet.amount * bet.rate / 100))}${process.env.REACT_APP_CURRENCY_SYMBOL} got` : "LOST")}
      </TableCell>
      <TableCell><a target="brank" href={`${process.env.REACT_APP_ENV === "production" ? "https://scan.tomochain.com/txs/" : "https://scan.testnet.tomochain.com/txs/"}${bet.game.transactionHash}`}>{bet.game.transactionHash}</a></TableCell>
    </TableColumn>
  )
};

const Card = styled.div`
  margin-left: 5%;
  height: 25vh;
`;

const Table = styled.div`

`;

const TableCell = styled.div`
  width: 16%;
`;
const TableHeader = styled.div`
  display: flex;
`;

const TableColumn = styled.div`
  display:flex;
`;

export default MyBets;
