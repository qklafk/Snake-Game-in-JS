import React, { useState } from 'react';
import './Play.css';

function Play({ setGameStarted, setGameSettings, finalScore }) {
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

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    console.log('Switching theme from', isDarkMode, 'to', newTheme);
    setIsDarkMode(newTheme);
    setGameSettings({ isDarkMode: newTheme, fieldSize });
    localStorage.setItem('isDarkMode', newTheme);
  };

  console.log('Play component theme:', isDarkMode ? 'dark' : 'light');
  
  return (
    <div className={`play-menu ${isDarkMode ? 'dark' : 'light'}`}>
      <h1 className="glitch-title">Snake Game</h1>
      
      {finalScore > 0 && (
        <div className="final-score">
          <h2>Last Score: {finalScore}</h2>
        </div>
      )}
      
      <div className="options">
        <div className="option-group">
          <label>Field Size:</label>
          <select value={fieldSize} onChange={handleFieldSizeChange} className="glitch-select">
            <option value="10x10">10x10</option>
            <option value="20x20">20x20</option>
            <option value="30x30">30x30</option>
            <option value="40x40">40x40</option>
          </select>
        </div>

        <div className="option-group">
          <label>Theme:</label>
          <button 
            onClick={handleThemeToggle} 
            className="theme-button glitch-button"
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        <button onClick={handlePlayClick} className="start-button glitch-button">
          Play
        </button>
      </div>
    </div>
  );
}

export default Play;
