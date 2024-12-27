import React, { useState, useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import SplashPage from './Splash/SplashPage';
import  Home from './Home/home';
import { io } from 'socket.io-client';
import CreateRoom from './CreateRoom/CreateRoom';
import JoinRoom from './GabungRoom/JoinRoom';
import Game2 from './Game/Game2';

function App() {
  const port = "http://localhost:3001";
  console.log("port:", port);
  // console.log(
  //   "process.env.REACT_APP_BACKEND_URL:",
  //   process.env.REACT_APP_BACKEND_URL
  // );

  const socket = io(port);

  const [playersData, setPlayersData] = useState([]);
  const [scoreBoard, setScoreBoard] = useState([]);
  
  useEffect(() => {
    socket.on("connect", () => {
      socket.on("welcome", (data) => {
        console.log('message from server', data);
      });

      socket.emit("msg", "Thanks for connecting");
    })

    socket.on("end the game", ({ players, scoreCard }) => {
      setPlayersData(players);
      setScoreBoard(scoreCard);
    })
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SplashPage />}/>
          <Route path="/home" element={<Home socket={socket} />}/>
          <Route path="/create-room/:roomId" element={<CreateRoom socket={socket} />}/>
          <Route path="/join-room" element={<JoinRoom />}/>
          <Route path='/game' element={<Game2/>}/>
          

        </Routes>
      </Router>


    </div>
  )
}

export default App
