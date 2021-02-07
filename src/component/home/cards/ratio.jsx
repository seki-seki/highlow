import {HighlowContainer} from "../../../common/container/highlowContainer";
import styled from 'styled-components';
import {ellipsisAddress} from "../../../common/helper/addressHelper";

const Ratio = () => {
  const {highBets, lowBets, highPercentage, lowPercentage} = HighlowContainer.useContainer();
  const allBets = [...highBets.map((bet)=> ({...bet, side: "UP"})), ...lowBets.map((bet)=> ({...bet, side: "DOWN"}))].sort((a, b) => {
    return a.timestamp - b.timestamp
  });
  const totalBet = allBets.reduce((acc, cur) => acc + Number.parseInt(cur.amount), 0);
  return <Card>
    <h2>UP & DOWN RATIO</h2>
    <p>Current bets</p>
    {allBets.length === 0 && (<p>No Bets are found</p>)}
    {allBets.length > 0 && (<div>
      <p>UP : {highPercentage}%</p>
      <p>Down : {lowPercentage}%</p>
      <p>totalBet {totalBet}{process.env.REACT_APP_CURRENCY_SYMBOL} bet</p>
      <Table>
        <TableHeader>
          <TableCell>USER</TableCell>
          <TableCell>BET AMOUNT</TableCell>
          <TableCell>BET ON</TableCell>
        </TableHeader>
        {
          allBets.map((bet, i) => {
            return (<TableColumn key={i}>
              <TableCell>{ellipsisAddress(bet.user)}</TableCell>
              <TableCell>{Number.parseInt(bet.amount)}{process.env.REACT_APP_CURRENCY_SYMBOL}</TableCell>
              <TableCell>{bet.side}</TableCell>
            </TableColumn>)
          })
        }
      </Table>
    </div>)}
  </Card>
};

const Card = styled.div`
  margin-left: 5%;
  height: 50vh;
  overflow-y: scroll;
  width: 30%;
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

export default Ratio;
