import styled from 'styled-components';
import {HighlowContainer} from "../../../common/container/highlowContainer";
import dateFormat from "dateformat";
import {makeDotByDecimal} from "../../../common/helper/decimalHelper";

const PreviousGameResults = () => {
  const {previousGames,game} = HighlowContainer.useContainer();
  return <Card>
    <h2>Previous Game Results</h2>
    <Table>
      <TableHeader>
        <TableCell>TIME</TableCell>
        <TableCell>PRICE({game.pairName})</TableCell>
        <TableCell>RESULT</TableCell>
      </TableHeader>
      {previousGames?.map((game,i) => (
        <TableColumn key={i}>
          <TableCell>{dateFormat(new Date(Number.parseInt(game.resultTimestamp)),"mm/dd HH:MM:ss")}</TableCell>
          <TableCell>{makeDotByDecimal(game.currentPrice, game.decimal)} -> {makeDotByDecimal(game.resultPrice, game.decimal)}</TableCell>
          <TableCell>{game.winner === "0" ? "UP" : "DOWN"}</TableCell>
        </TableColumn>
      ))}
    </Table>
  </Card>
};


const Card = styled.div`
margin-left: 5%;
height: 25vh;
overflow-y: scroll;
`;

const Table = styled.div`

`;

const TableCell = styled.div`
  width: 30%;
`;
const TableHeader = styled.div`
  display: flex;
`;

const TableColumn = styled.div`
  display:flex;
`;

export default PreviousGameResults;
