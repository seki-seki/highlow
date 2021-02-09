import {HighlowContainer} from "../../../common/container/highlowContainer";
import styled from 'styled-components';
import Countdown from "react-countdown";
import dateFormat from "dateformat"
import {useEffect, useState} from "react";

const Time = () => {
  const {game, update, getNewestGameIndex, newestGameIndex} = HighlowContainer.useContainer();
  const [isOverTime, setIsOverTime] = useState(false);
  useEffect(() => {
    if(Date.now() > Number.parseInt(game.closeTimestamp)){
      setIsOverTime(true)
    } else {
      setIsOverTime(false)
    }
    const checkNewGame = () => {
      getNewestGameIndex().then((newIndex) => {
        console.log(newIndex, newestGameIndex, newIndex > newestGameIndex)
        if (newIndex > newestGameIndex) {
          update();
        }
      });
    };
    const interval = setInterval(checkNewGame, 1000);
    return () => clearInterval(interval);
  }, [newestGameIndex]);
  return <Card>
    <h2>TIME</h2>
    <p>Remaining time for close:</p>
    {isOverTime ? <p>Please wait for next game.</p> :
      <Countdown key={game.closeTimestamp} date={Number.parseInt(game.closeTimestamp)} daysInHours
                 onComplete={() => setIsOverTime(true)}/>}
    <p>start at: {dateFormat(new Date(Number.parseInt(game.startTimestamp)), "mm/dd HH:MM:ss")}</p>
    <p>close at: {dateFormat(new Date(Number.parseInt(game.closeTimestamp)), "mm/dd HH:MM:ss")}</p>
    <p>result at: {dateFormat(new Date(Number.parseInt(game.resultTimestamp)), "mm/dd HH:MM:ss")}</p>
  </Card>
};

const Card = styled.div`
  margin-left: 5%;
  height: 25vh;
`;

export default Time;
