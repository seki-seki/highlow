import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import dateFormat from "dateformat";
import {makeDotByDecimal} from "../../../common/helper/decimalHelper";
import Side from "../../../common/constants/Side";
import {useState, useEffect} from "react"
import Web3 from "web3";

const PreviousGameResults = () => {
  const {previousGames, game, myBets, getHighAmount, getLowAmount} = HighlowContainer.useContainer();
  const [previousGamesWithTotalAmount, setPreviousGamesWithTotalAmount] = useState(previousGames);
  useEffect(() => {
    const setup = async () => setPreviousGamesWithTotalAmount(await Promise.all(previousGames.map(async (game) => {
        const totalBets = Number.parseInt(await getHighAmount(game.gameIndex)) + Number.parseInt(await getLowAmount(game.gameIndex));
        return {...game, totalBets}
    })));
    setup();
  },[previousGames]);
  return <Card>
    <h2>Previous Game Results</h2>
    <Table>
      <TableHeader>
        <TableCell>INDEX</TableCell>
        <TableCell>BET</TableCell>
        <TableCell>TIME</TableCell>
        <TableCell>PRICE<br/>({game.pairName})</TableCell>
        <TableCell>RESULT</TableCell>
        <TableCell>HIT</TableCell>
      </TableHeader>
      {previousGamesWithTotalAmount?.map((game, i) => {
        const betsOnThisGame = myBets?.filter(bet => Number.parseInt(bet.gameIndex) === game.gameIndex);
        const hasBetsOnThisGame = betsOnThisGame?.length > 0;
        const betOnWinnerSide = betsOnThisGame?.every(bet => bet.side === game.winner);
        const betOnLooserSide = betsOnThisGame?.every(bet => bet.side !== game.winner);
        const isNoGame = game.winner === Side.noGame;

        return (
          <TableColumn key={i}>
            <TableCell>{game.gameIndex}</TableCell>
            <TableCell>{Web3.utils.fromWei(String(game.totalBets))}</TableCell>
            <TableCell>{dateFormat(new Date(Number.parseInt(game.resultTimestamp)), "mm/dd HH:MM:ss")}</TableCell>
            <TableCell>{makeDotByDecimal(game.currentPrice, game.decimal)} -> {!game.finished ? "Loading..." : makeDotByDecimal(game.resultPrice, game.decimal)}</TableCell>
            <TableCell>{!game.finished ? "Loading..." : game.winner === Side.high ? "UP" : game.winner === Side.low ? "DOWN" : game.winner === Side.draw ? "DRAW" : "NO GAME"}</TableCell>
            <TableCell>{!game.finished ? "..." : !hasBetsOnThisGame || isNoGame ? "-" : betOnWinnerSide ? "○" : betOnLooserSide ? "☓" : "△"}</TableCell>
          </TableColumn>
        )
      })}
    </Table>
  </Card>
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

export default PreviousGameResults;
