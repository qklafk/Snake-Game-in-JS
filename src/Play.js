import React, { useState } from 'react';
import './Play.css';

function Play({ setGameStarted, setGameSettings }) {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('isDarkMode') === 'true');
  const [fieldSize, setFieldSize] = useState(localStorage.getItem('fieldSize') || '10x10');

  const handlePlayClick = () => {
    // Устанавливаем настройки игры перед стартом
    setGameSettings({ isDarkMode, fieldSize });
    setGameStarted(true);
    localStorage.setItem('isDarkMode', isDarkMode);
    localStorage.setItem('fieldSize', fieldSize);
  };

  const handleFieldSizeChange = (e) => {
    setFieldSize(e.target.value);
  };

  return (
    <div className={`play-menu ${isDarkMode ? 'dark' : 'light'}`}>
      <h1>Snake Game</h1>
      <div className="options">
        <div>
          <label>Field Size:</label>
          <select value={fieldSize} onChange={handleFieldSizeChange}>
            <option value="10x10">10x10</option>
            <option value="20x20">20x20</option>
            <option value="30x30">30x30</option>
            <option value="40x40">40x40</option>
          </select>
        </div>

        <div>
          <label>Theme:</label>
          <button onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        <button onClick={handlePlayClick} className="start-button">
          Play
        </button>
      </div>
    </div>
  );
}

export default Play;
