import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import dateFormat from "dateformat";
import Countdown from "react-countdown";
import {useState, useEffect, useMemo} from "react";
import Web3 from "web3";

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
        const rate = bet.side === "0" ? await getHighMagnificationPercent(bet.gameIndex) : await getLowMagnificationPercent(bet.gameIndex);
        return {...bet, gameIsFinished, isWin, rate, game}
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
      </TableHeader>
      {betsWithResult.map((bet, i) => {
        return (
          <TableColumn key={i}>
            <TableCell>{bet.game.gameIndex}</TableCell>
            <TableCell>{dateFormat(new Date(Number.parseInt(bet.timestamp) * 1000), "mm/dd HH:MM:ss")}</TableCell>
            <TableCell>{Web3.utils.fromWei(bet.amount)}</TableCell>
            <TableCell>{bet.side === "0" ? "UP" : "DOWN"}</TableCell>
            <TableCell>
              {!bet.gameIsFinished && (
                <div>
                  Result in <Countdown date={Number.parseInt(bet.game.resultTimestamp)} daysInHours/>
                </div>
              )}
              {bet.gameIsFinished && (bet.isWin ? `WON : ${Web3.utils.fromWei(bet.amount * bet.rate / 100)}${process.env.REACT_APP_CURRENCY_SYMBOL}` : "LOST")}
            </TableCell>
          </TableColumn>
        )
      })}
    </Table>
  </Card>
}

const Card = styled.div`
  margin-left: 5%;
  height: 25vh;
`;

const Table = styled.div`

`;

const TableCell = styled.div`
  width: 25%;
`;
const TableHeader = styled.div`
  display: flex;
`;

const TableColumn = styled.div`
  display:flex;
`;

export default MyBets;
