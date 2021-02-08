import {HighlowContainer} from "../../../common/container/highlowContainer";
import styled from 'styled-components';
import Countdown from "react-countdown";
import dateFormat from "dateformat"

const Time = () => {
  const {game, update} = HighlowContainer.useContainer();
  console.log(game.gameIndex)
  const sleepByPromise = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000));

  return <Card>
    <h2>TIME</h2>
    <p>Remaining time for close:</p>
    {game.closeTimestamp && <Countdown key={game.closeTimestamp} date={Number.parseInt(game.closeTimestamp)} daysInHours onComplete={async () => {
      await sleepByPromise(30)
      console.log("complete");
      update();
    }}/>}
    <p>start at: {dateFormat(new Date(Number.parseInt(game.startTimestamp)),"mm/dd HH:MM:ss")}</p>
    <p>close at: {dateFormat(new Date(Number.parseInt(game.closeTimestamp)),"mm/dd HH:MM:ss")}</p>
    <p>result at: {dateFormat(new Date(Number.parseInt(game.resultTimestamp)),"mm/dd HH:MM:ss")}</p>
  </Card>
};

const Card = styled.div`
  margin-left: 5%;
  height: 25vh;
`;

export default Time;
