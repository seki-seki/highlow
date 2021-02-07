import {HighlowContainer} from "../../../common/container/highlowContainer";
import styled from 'styled-components';
import Countdown from "react-countdown";
import dateFormat from "dateformat"

const Time = () => {
  const {game} = HighlowContainer.useContainer();
  return <Card>
    <h2>TIME</h2>
    <p>Remaining time for close:</p>
    <Countdown date={Number.parseInt(game.closeTimestamp)} daysInHours/>
    <p>start at: {dateFormat(new Date(Number.parseInt(game.startTimestamp)),"mm/dd HH:MM:ss")}</p>
    <p>close at: {dateFormat(new Date(Number.parseInt(game.closeTimestamp)),"mm/dd HH:MM:ss")}</p>
    <p>result at: {dateFormat(new Date(Number.parseInt(game.resultTimestamp)),"mm/dd HH:MM:ss")}</p>
  </Card>
};

const Card = styled.div`
  margin-left: 5%;
  height: 25vh;
  overflow-y: scroll;
`;

export default Time;
