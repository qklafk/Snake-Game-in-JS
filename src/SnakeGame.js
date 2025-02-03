import React, { useState } from 'react';
import './SnakeGame.css';

function SnakeGame({ gameSettings }) {
  const { isDarkMode, fieldSize } = gameSettings;
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [apple, setApple] = useState({ x: 10, y: 10 });
  const [score, setScore] = useState(0);

  // Получаем размер поля
  const getFieldDimensions = () => {
    const [width, height] = fieldSize.split('x').map(Number);
    return { width, height };
  };

  const { width, height } = getFieldDimensions();

  // Логика для отрисовки клеток и игры
  const renderCell = (row, col) => {
    const isSnake = snake.some(segment => segment.x === col && segment.y === row);
    const isApple = apple.x === col && apple.y === row;

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${isSnake ? 'snake' : ''} ${isApple ? 'apple' : ''}`}
        style={{
          backgroundColor: isSnake ? (isDarkMode ? 'white' : 'black') : '',
          borderColor: isDarkMode ? 'white' : 'black',
        }}
      ></div>
    );
  };

  return (
    <div className={`snake-game ${isDarkMode ? 'dark' : 'light'}`}>
      <h2 className="score">Score: {score}</h2>
      <div
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${width}, 15px)`,
          gridTemplateRows: `repeat(${height}, 15px)`,
        }}
      >
        {[...Array(height)].map((_, rowIndex) =>
          [...Array(width)].map((_, colIndex) => renderCell(rowIndex, colIndex))
        )}
      </div>
    </div>
  );
}

export default SnakeGame;
