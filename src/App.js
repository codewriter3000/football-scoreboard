import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const quarterLength = 720; // 900 = 15 minute quarters, 720 = 12 minute quarters, 600 = 10 minute quarters
  const [ptsHome, setPtsHome] = useState(0);
  const [ptsAway, setPtsAway] = useState(0);
  const [quarter, setQuarter] = useState(1);
  const [time, setTime] = useState(quarterLength);
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
    if(time !== 0){
      return;
    }
    if(quarter === 1){
      setGameMsg("We are in the 2nd quarter.")
    }
    if(quarter === 2){
      setGameMsg("We are in halftime.");
      setTimeoutsHome(3);
      setTimeoutsAway(3);
    }
    if(quarter === 3){
      setGameMsg("We are in the 4th quarter.");
    }
    if(quarter >= 4){
      if(ptsHome !== ptsAway){
        setGameOver(true);
      } else {
        setGameMsg("We are in overtime");
      }
    }
  }, [quarter, ptsAway, ptsHome, time]);

  useEffect(() => {
    if(gameOver === true){
      if(ptsAway > ptsHome){
        setGameMsg("Away wins");
      } else if(ptsHome > ptsAway){
        setGameMsg("Home wins");
      } else {
        setGameMsg("Tie");
      }
    }
  }, [gameOver, ptsAway, ptsHome]);

  useEffect(() => {
    let interval = null;
    if(isTicking){
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000); // 1000 for production, for dev, 1, 10, or 100
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTicking]);

  const resetClock = () => {
    setTime(quarterLength);
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
    setGameOver(false);
    setQuarter(1);
    setIsTicking(false);
    setTime(quarterLength);
    setIsPAT(false);
    setPtsHome(0);
    setPtsAway(0);
    setTimeoutsHome(3);
    setTimeoutsAway(3);
    setGameMsg("It's a beautiful night with clear skies.")
  }

  const touchdown = () => {
    if(possession === "Home"){
      setPtsHome(ptsHome+6);
      setIsTicking(false);
      setIsPAT(true);
    } else {
      setPtsAway(ptsAway+6);
      setIsTicking(false);
      setIsPAT(true);
    }
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
    let alertMsg = window.confirm("This is an incredibly rare calling. Are you sure that the end of this play resulted in a defensive 2 point conversion?");
    if(!alertMsg){
      return;
    }

    if(possession === "Home"){
      setPtsAway(ptsAway+2);
      setGameMsg("This is a rare calling. On the play after the touchdown, the defense gained possession of the ball and scored in the endzone, resulting in a defensive 2 point conversion.");
    } else {
      setPtsHome(ptsHome+2);
      setGameMsg("This is a rare calling. On the play after the touchdown, the defense gained possession of the ball and scored in the endzone, resulting in a defensive 2 point conversion.");
    }
    setIsPAT(false);
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

  const handleEndGame = () => {
    setGameOver(true);
  }

  const handleKeyDown = key => {
    switch(key){
      case 'q': newGame(); break;
      case 'w': startClock(); break;
      case 'e': stopClock(); break;
      case 'r': possessionChange(); break;
      case 't': handle2PtConversion(); break;
      case 'y': handle2PtDefense(); break;
      case 'u': handleTimeoutHome(); break;
      default: break;
    }
  }

  return (
    <div className="App" onKeyDown={handleKeyDown}>
      <button onClick={newGame}>New Game</button>
      <button onClick={startClock} disabled={isPAT || gameOver}>Start Clock</button>
      <button onClick={stopClock} disabled={isPAT || gameOver}>Stop Clock</button>
      <button onClick={possessionChange} disabled={isPAT || gameOver}>Poss Change</button>
      <button onClick={handle2PtConversion} disabled={!isPAT || gameOver}>2 Pt Good</button>
      <button onClick={handle2PtDefense} disabled={!isPAT || gameOver}>2 Pt Def</button>
      <button onClick={handleTimeoutHome} disabled={noMoreTimeoutsHome || gameOver}>Timeout Home</button>
      <br />
      <button onClick={handlePATMissed} disabled={!isPAT || gameOver}>PAT Miss</button>
      <button onClick={handlePATGood} disabled={!isPAT || gameOver}>PAT Good</button>
      <button onClick={touchdown} disabled={isPAT || gameOver}>Touchdown</button>
      <button onClick={handleFieldGoal} disabled={isPAT || gameOver}>Field Goal</button>
      <button onClick={handle2PtSafety} disabled={isPAT || gameOver}>2 Pt Safety</button>
      <button onClick={handle1PtSafety} disabled={!isPAT || gameOver}>1 Pt Safety</button>
      <button onClick={handleTimeoutAway} disabled={noMoreTimeoutsAway || gameOver}>Timeout Away</button>
      <br />
      <button onClick={() => setPtsHome(ptsHome+1)}>+1 Home</button>
      <button onClick={() => setPtsAway(ptsAway+1)}>+1 Away</button>
      <button onClick={() => setPtsHome(ptsHome-1)}>-1 Home</button>
      <button onClick={() => setPtsAway(ptsAway-1)}>-1 Away</button>
      <button onClick={() => setTime(time + 60)}>+1 Min</button>
      <button onClick={() => setTime(time + 1)}>+1 Sec</button>
      <button onClick={() => setTime(time - 60)}>-1 Min</button>
      <button onClick={() => setTime(time - 1)}>-1 Sec</button>
      <button onClick={handleEndGame} disabled={gameOver}>End Game</button>
      <hr />
      <div className="scoreboard">
        Quarter: <span className='seg'>{quarter}</span>
        <h2 className='seg'>{timeToTimestamp(time)}</h2>
        <h3>{gameMsg}</h3>
        <h3>Home <span className='seg'>{ptsHome}</span> - <span className='seg'>{ptsAway}</span> Away</h3>
        <h4>TOL <span className='seg'>{timeoutsHome}</span> - <span className='seg'>{timeoutsAway}</span> TOL</h4>
      </div>
    </div>
  );
}

export default App;
