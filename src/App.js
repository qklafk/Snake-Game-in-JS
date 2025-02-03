import React, { useState } from 'react';
import './App.css';
import Play from './Play';
import SnakeGame from './SnakeGame';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    isDarkMode: false,
    fieldSize: '10x10',
  });

  return (
    <div className="app">
      {gameStarted ? (
        <SnakeGame gameSettings={gameSettings} />
      ) : (
        <Play setGameStarted={setGameStarted} setGameSettings={setGameSettings} />
      )}
    </div>
  );
}

export default App;
