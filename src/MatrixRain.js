import React, { useState, useEffect } from 'react';
import './MatrixRain.css';

function MatrixRain({ isDarkMode }) {
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    const generateMatrix = () => {
      const chars = [];
      for (let i = 0; i < 20; i++) {
        chars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          speed: Math.random() * 3 + 1,
          delay: Math.random() * 5,
          chars: generateRandomChars(10)
        });
      }
      setMatrixChars(chars);
    };

    const generateRandomChars = (length) => {
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Задержка загрузки матричного дождя
    const timeout = setTimeout(() => {
      generateMatrix();
      const interval = setInterval(generateMatrix, 45000);
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`matrix-rain ${isDarkMode ? 'dark' : 'light'}`}>
      {matrixChars.map(char => (
        <div
          key={char.id}
          className="matrix-column"
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            animationDelay: `${char.delay}s`,
            animationDuration: `${char.speed * 6}s`
          }}
        >
          {char.chars.split('').map((c, index) => (
            <div
              key={index}
              className="matrix-char"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MatrixRain;
