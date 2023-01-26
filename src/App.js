import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ptsHome, setPtsHome] = useState(0);
  const [ptsAway, setPtsAway] = useState(0);
  const [quarter, setQuarter] = useState(0);
  const [time, setTime] = useState(900);
  const [isTicking, setIsTicking] = useState(false);
  const [possession, setPossession] = useState("Home");
  const [isPAT, setIsPAT] = useState(false);

  useEffect(() => {
    let interval = null;
    if(isTicking){
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTicking]);

  const timeToTimestamp = (time) => {
    const minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);
    seconds = seconds.toString().length === 1 ? seconds.toString().padStart(2, 0) : seconds.toString();
    return `${minutes}:${seconds}`;
  }

  const startClock = (e) => {
    setIsTicking(true);
  }

  const stopClock = (e) => {
    setIsTicking(false);
  }

  const newGame = (e) => {
    setQuarter(1);
    setIsTicking(false);
    setTime(900);
  }

  const touchdownHome = (e) => {
    setPtsHome(ptsHome+6);
    setIsTicking(false);
    isPAT(true);
  }

  const touchdownAway = (e) => {
    setPtsAway(ptsAway+6);
    setIsTicking(false);
    isPAT(true);
  }

  const handleFieldGoal = (e) => {

  }

  const handle2PtSafety = (e) => {

  }

  const handle1PtSafety = (e) => {

  }

  const possessionChange = (e) => {
    if(possession === "Home"){
      setPossession("Away");
    } else {
      setPossession("Home");
    }
  }

  return (
    <div className="App">
      <button onClick={newGame}>New Game</button>
      <button onClick={startClock} disabled={isPAT}>Start Clock</button>
      <button onClick={stopClock} disabled={isPAT}>Stop Clock</button>
      <button onClick={possessionChange} disabled={isPAT}>Poss Change</button>
      <button disabled={!isPAT}>2 Pt Good</button>
      <button disabled={!isPAT}>2 Pt Def</button>
      <button>Timeout Home</button>
      <br />
      <button disabled={!isPAT}>PAT Miss</button>
      <button disabled={!isPAT}>PAT Good</button>
      <button onClick={touchdownHome} disabled={isPAT}>TD Home</button>
      <button onClick={touchdownAway} disabled={isPAT}>TD Away</button>
      <button disabled={isPAT}>Field Goal</button>
      <button disabled={isPAT}>2 Pt Safety</button>
      <button disabled={!isPAT}>1 Pt Safety</button>
      <button>Timeout Away</button>
      <br />
      <button>-1 Home</button>
      <button>-1 Away</button>
      <button>+1 Min</button>
      <button>+1 Sec</button>
      <button>-1 Min</button>
      <button>-1 Sec</button>
      <hr />
      Quarter: {quarter}
      <h2>{timeToTimestamp(time)}</h2>
      <h3>{possession} has the ball</h3>
      <h3>Home {ptsHome} - {ptsAway} Away</h3>
    </div>
  );
}

export default App;
