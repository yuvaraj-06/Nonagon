import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./styles.css";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6
};

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function App() {
  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = 1626095820; // use UNIX timestamp in seconds

  const remainingTime = endTime - stratTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <div className="timer-comp">
      <div className="timr-title">
        <span className='h2 text-white'>Nonagon is calibrating your first day of virtual auditing results.</span>
        <br />
        <br />
        <span className='h4 text-white'>Dashboard will be live at 6:47PM IST</span>
      </div>
      <div className="App">
        <CountdownCircleTimer
          {...timerProps}
          colors={[["#3c4b9e"]]}
          duration={daysDuration}
          initialRemainingTime={remainingTime}
        >
          {({ elapsedTime }) =>
            renderTime("days", getTimeDays(daysDuration - elapsedTime))
          }
        </CountdownCircleTimer>

        &nbsp;&nbsp;&nbsp;&nbsp;

        <CountdownCircleTimer
          {...timerProps}
          colors={[["#3c4b9e"]]}
          duration={daySeconds}
          initialRemainingTime={remainingTime % daySeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > hourSeconds
          ]}
        >
          {({ elapsedTime }) =>
            renderTime("hours", getTimeHours(daySeconds - elapsedTime))
          }
        </CountdownCircleTimer>
        &nbsp;&nbsp;&nbsp;&nbsp;

        <CountdownCircleTimer
          {...timerProps}
          colors={[["#3c4b9e"]]}
          duration={hourSeconds}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > minuteSeconds
          ]}
        >
          {({ elapsedTime }) =>
            renderTime("minutes", getTimeMinutes(hourSeconds - elapsedTime))
          }
        </CountdownCircleTimer>

        &nbsp;&nbsp;&nbsp;&nbsp;
        <CountdownCircleTimer
          {...timerProps}
          colors={[["#3c4b9e"]]}
          duration={minuteSeconds}
          initialRemainingTime={remainingTime % minuteSeconds}
          onComplete={(totalElapsedTime) => [
            remainingTime - totalElapsedTime > 0
          ]}
        >
          {({ elapsedTime }) =>
            renderTime("seconds", getTimeSeconds(elapsedTime))
          }
        </CountdownCircleTimer>
      </div>
      <br />
      <br />
    </div>
  );
}
