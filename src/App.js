import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ptsHome, setPtsHome] = useState(0);
  const [ptsAway, setPtsAway] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [time, setTime] = useState(720); // 900 = 15 minute quarters, 720 = 12 minute quarters, 600 = 10 minute quarters,
  const [isTicking, setIsTicking] = useState(false);
  const [possession, setPossession] = useState("Home");
  const [isPAT, setIsPAT] = useState(false);
  const [timeoutsHome, setTimeoutsHome] = useState(3);
  const [noMoreTimeoutsHome, setNoMoreTimeoutsHome] = useState(false);
  const [timeoutsAway, setTimeoutsAway] = useState(3);
  const [noMoreTimeoutsAway, setNoMoreTimeoutsAway] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameMsg, setGameMsg] = useState("It's a beautiful night with clear skies.");

  useEffect(() => {
    if(possession === "Home"){
      setGameMsg("Home has the ball");
    } else {
      setGameMsg("Away has the ball");
    }
  }, [possession]);

  useEffect(() => {
    if(timeoutsHome === 0){
      setNoMoreTimeoutsHome(true);
      setGameMsg("Timeout, Home. This is their last timeout of the half.");
    } else {
      setGameMsg("Timeout, Home.");
      setNoMoreTimeoutsHome(false);
    }
  }, [timeoutsHome]);

  useEffect(() => {
    if(timeoutsAway === 0){
      setNoMoreTimeoutsAway(true);
      setGameMsg("Timeout, Away. This is their last timeout of the half.");
    } else {
      setGameMsg("Timeout, Away.");
      setNoMoreTimeoutsAway(false);
    }
  }, [timeoutsAway]);

  useEffect(() => {
    if(time === 0){
      setQuarter(quarter+1);
      setIsTicking(false);
      resetClock();
    }
  }, [time, quarter]);

  useEffect(() => {
    if(quarter === 2){
      setGameMsg("We are in the 2nd quarter.")
    }
    if(quarter === 3){
      setGameMsg("We are in halftime.");
      setTimeoutsHome(3);
      setTimeoutsAway(3);
    }
    if(quarter === 4){
      setGameMsg("We are in the 4th quarter.");
    }
    if(quarter === 5){
      if(ptsHome !== ptsAway){
        setGameOver(true);
      } else {
        setGameMsg("We are in overtime");
      }
    }
  }, [quarter])

  useEffect(() => {
    if(gameOver === true){
      setGameMsg("Game Over");
    }
  }, [gameOver]);

  useEffect(() => {
    let interval = null;
    if(isTicking){
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 10); // 1000 for production, for dev, 1, 10, or 100
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTicking]);

  const resetClock = () => {
    setTime(720); // make sure this matches line 8
  };

  const timeToTimestamp = (time) => {
    const minutes = Math.floor(time/60);
    let seconds = Math.floor(time%60);
    seconds = seconds.toString().length === 1 ? seconds.toString().padStart(2, 0) : seconds.toString();
    return `${minutes}:${seconds}`;
  }

  const startClock = () => {
    setIsTicking(true);
  }

  const stopClock = () => {
    setIsTicking(false);
  }

  const newGame = () => {
    setGameMsg("It's a beautiful night with clear skies.")
    setQuarter(1);
    setIsTicking(false);
    setTime(900);
    setIsPAT(false);
    setPtsHome(0);
    setPtsAway(0);
    setTimeoutsHome(3);
    setTimeoutsAway(3);
  }

  const touchdownHome = () => {
    setPtsHome(ptsHome+6);
    setIsTicking(false);
    setIsPAT(true);
  }

  const touchdownAway = () => {
    setPtsAway(ptsAway+6);
    setIsTicking(false);
    setIsPAT(true);
  }

  const handleFieldGoal = () => {
    if(possession === "Home"){
      setPtsHome(ptsHome+3);
    } else {
      setPtsAway(ptsAway+3);
    }
    setIsTicking(false);
  }

  const handle2PtSafety = () => {
    if(possession === "Home"){
      setPtsAway(ptsAway+2);
      setGameMsg("The away team just got a safety.")
    } else {
      setPtsHome(ptsHome+2);
      setGameMsg("The home team just got a safety.")
    }
    setIsTicking(false);
  }

  const handle1PtSafety = () => {
    let alertMsg = window.confirm("This is an incredibly rare calling. Are you sure that the end of this play resulted in a 1 point safety?");
    if(!alertMsg){
      return;
    }

    if(possession === "Home"){
      setPtsAway(ptsAway+1);
      setGameMsg("This is a rare calling. On the play after the touchdown, the ball was downed in the home team's endzone, which results in the away team getting a 1 point safety.")
    } else {
      setPtsHome(ptsHome+1);
      setGameMsg("This is a rare calling. On the play after the touchdown, the ball was downed in the away team's endzone, which results in the away team getting a 1 point safety.")
    }
    setIsPAT(false);
  }

  const handlePATMissed = () => {
    setIsPAT(false);
    setGameMsg("The extra point was no good.");
  }

  const handlePATGood = () => {
    if(possession === "Home"){
      setPtsHome(ptsHome+1);
    } else {
      setPtsAway(ptsAway+1);
    }
    setIsPAT(false);
    setGameMsg("The extra point was good.")
  }

  const handle2PtConversion = () => {
    if(possession === "Home"){
      setPtsHome(ptsHome+2);
    } else {
      setPtsAway(ptsAway+2);
    }
    setIsPAT(false);
    setGameMsg("The 2 point conversion was good.")
  }

  const handle2PtDefense = () => {
    if(possession === "Home"){
      setPtsAway(ptsAway+2);
    } else {
      setPtsHome(ptsHome+2);
    }
    setIsPAT(false);
    setGameMsg("The play after the touchdown resulted in a defensive recovery that reached the defense's endzone. The 2 points will go to the defense.");
  }

  const possessionChange = () => {
    if(possession === "Home"){
      setPossession("Away");
    } else {
      setPossession("Home");
    }
  }

  const handleTimeoutHome = () => {
    setTimeoutsHome(timeoutsHome-1);
    setIsTicking(false);
  }

  const handleTimeoutAway = () => {
    setTimeoutsAway(timeoutsAway-1);
    setIsTicking(false);
  }

  return (
    <div className="App">
      <button onClick={newGame}>New Game</button>
      <button onClick={startClock} disabled={isPAT}>Start Clock</button>
      <button onClick={stopClock} disabled={isPAT}>Stop Clock</button>
      <button onClick={possessionChange} disabled={isPAT}>Poss Change</button>
      <button onClick={handle2PtConversion} disabled={!isPAT}>2 Pt Good</button>
      <button onClick={handle2PtDefense} disabled={!isPAT}>2 Pt Def</button>
      <button onClick={handleTimeoutHome} disabled={noMoreTimeoutsHome}>Timeout Home</button>
      <br />
      <button onClick={handlePATMissed} disabled={!isPAT}>PAT Miss</button>
      <button onClick={handlePATGood} disabled={!isPAT}>PAT Good</button>
      <button onClick={touchdownHome} disabled={isPAT}>TD Home</button>
      <button onClick={touchdownAway} disabled={isPAT}>TD Away</button>
      <button onClick={handleFieldGoal} disabled={isPAT}>Field Goal</button>
      <button onClick={handle2PtSafety} disabled={isPAT}>2 Pt Safety</button>
      <button onClick={handle1PtSafety} disabled={!isPAT}>1 Pt Safety</button>
      <button onClick={handleTimeoutAway} disabled={noMoreTimeoutsAway}>Timeout Away</button>
      <br />
      <button onClick={() => setPtsHome(ptsHome-1)}>-1 Home</button>
      <button onClick={() => setPtsAway(ptsAway-1)}>-1 Away</button>
      <button onClick={() => setTime(time + 60)}>+1 Min</button>
      <button onClick={() => setTime(time + 1)}>+1 Sec</button>
      <button onClick={() => setTime(time - 60)}>-1 Min</button>
      <button onClick={() => setTime(time - 1)}>-1 Sec</button>
      <hr />
      Quarter: {quarter}
      <h2>{timeToTimestamp(time)}</h2>
      <h3>{gameMsg}</h3>
      <h3>Home {ptsHome} - {ptsAway} Away</h3>
      <h4>Timeouts Home: {timeoutsHome}</h4>
      <h4>Timeouts Away: {timeoutsAway}</h4>
    </div>
  );
}

export default App;
