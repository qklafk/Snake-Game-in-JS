import React, { useState } from 'react';
import './App.css';
import Play from './Play';
import SnakeGame from './SnakeGame';
import GlitchEffects from './GlitchEffects';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    isDarkMode: localStorage.getItem('isDarkMode') === 'true',
    fieldSize: localStorage.getItem('fieldSize') || '10x10',
  });
  const [finalScore, setFinalScore] = useState(0);

  const handleGameEnd = (score) => {
    setFinalScore(score);
    setGameStarted(false);
  };

  console.log('App theme:', gameSettings.isDarkMode ? 'dark' : 'light');
  
  return (
    <div className={`app ${gameSettings.isDarkMode ? 'dark' : 'light'}`}>
      <GlitchEffects isDarkMode={gameSettings.isDarkMode} />
      {gameStarted ? (
        <SnakeGame 
          gameSettings={gameSettings} 
          onGameEnd={handleGameEnd}
        />
      ) : (
        <Play 
          setGameStarted={setGameStarted} 
          setGameSettings={setGameSettings}
          finalScore={finalScore}
        />
      )}
    </div>
  );
}

export default App;
