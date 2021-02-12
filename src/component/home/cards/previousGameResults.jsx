import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import dateFormat from "dateformat";
import {makeDotByDecimal} from "../../../common/helper/decimalHelper";
import Side from "../../../common/constants/Side";

const PreviousGameResults = () => {
  const {previousGames,game} = HighlowContainer.useContainer();
  console.log(previousGames)
  return <Card>
    <h2>Previous Game Results</h2>
    <Table>
      <TableHeader>
        <TableCell>INDEX</TableCell>
        <TableCell>TIME</TableCell>
        <TableCell>PRICE({game.pairName})</TableCell>
        <TableCell>RESULT</TableCell>
      </TableHeader>
      {previousGames?.map((game,i) => (
        <TableColumn key={i}>
          <TableCell>{game.gameIndex}</TableCell>
          <TableCell>{dateFormat(new Date(Number.parseInt(game.resultTimestamp)),"mm/dd HH:MM:ss")}</TableCell>
          <TableCell>{makeDotByDecimal(game.currentPrice, game.decimal)} -> {!game.finished ? "Loading...": makeDotByDecimal(game.resultPrice, game.decimal)}</TableCell>
          <TableCell>{!game.finished ? "Loading...": game.winner === Side.high ? "UP" : game.winner === Side.low ? "DOWN" : game.winner === Side.draw ? "DRAW" : "NO GAME"}</TableCell>
        </TableColumn>
      ))}
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
  width: 25%;
`;
const TableHeader = styled.div`
  display: flex;
`;

const TableColumn = styled.div`
  display:flex;
`;

export default PreviousGameResults;
