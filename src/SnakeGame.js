import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

function SnakeGame({ gameSettings, onGameEnd }) {
  const { isDarkMode, fieldSize } = gameSettings;
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [apple, setApple] = useState({ x: 10, y: 10 });
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [powerUps, setPowerUps] = useState([]);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [powerUpsEnabled, setPowerUpsEnabled] = useState(true);
  const [speedChangeBlocked, setSpeedChangeBlocked] = useState(false);
  const [powerUpLifetimes, setPowerUpLifetimes] = useState({});

  const POWER_UP_TYPES = {
    GOLDEN: { name: 'x4 Points', color: '#FFD700', points: 4, duration: 0 },
    SILVER: { name: 'x2 Points', color: '#C0C0C0', points: 2, duration: 0 },
    SPEED_BOOST: { name: 'Speed Boost', color: '#FF0000', points: 1, duration: 10000 },
    SLOW_DOWN: { name: 'Slow Down', color: '#0000FF', points: 1, duration: 10000 },
    INVINCIBLE: { name: 'Invincible', color: '#00FF00', points: 1, duration: 15000 }
  };

  const getFieldDimensions = () => {
    const [width, height] = fieldSize.split('x').map(Number);
    return { width, height };
  };

  const { width, height } = getFieldDimensions();

  const generatePowerUp = useCallback(() => {
    const powerUpTypes = Object.keys(POWER_UP_TYPES);
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUp = POWER_UP_TYPES[randomType];
    
    let newPowerUp;
    do {
      newPowerUp = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        type: randomType,
        id: Date.now() + Math.random(), // Уникальный ID
        ...powerUp
      };
    } while (
      snake.some(segment => segment.x === newPowerUp.x && segment.y === newPowerUp.y) ||
      (apple.x === newPowerUp.x && apple.y === newPowerUp.y) ||
      powerUps.some(pu => pu.x === newPowerUp.x && pu.y === newPowerUp.y)
    );
    
    return newPowerUp;
  }, [snake, apple, powerUps, width, height, POWER_UP_TYPES]);

  const resetSpeedToDefault = useCallback(() => {
        setSpeed(150);
    setSpeedChangeBlocked(false);
  }, []);

  const applyPowerUpEffect = useCallback((powerUp) => {
    if (activePowerUp) {
      if (activePowerUp.type === 'SPEED_BOOST' || activePowerUp.type === 'SLOW_DOWN') {
        setSpeed(150);
        setSpeedChangeBlocked(false);
      }
    }
    
    setActivePowerUp(powerUp);
    setPowerUpTimer(powerUp.duration);
    
    switch (powerUp.type) {
      case 'SPEED_BOOST':
        setSpeed(prev => Math.max(prev - 50, 50));
        setSpeedChangeBlocked(true); // Блокируем только для бонусов скорости
        break;
      case 'SLOW_DOWN':
        setSpeed(prev => Math.min(prev + 50, 300));
        setSpeedChangeBlocked(true); // Блокируем только для бонусов скорости
        break;
      case 'INVINCIBLE':
        // Логика неуязвимости - не блокируем скорость
        setSpeedChangeBlocked(false);
        break;
      case 'GOLDEN':
      case 'SILVER':
        // Бонусы очков - активируют множитель на 20 секунд
        setPowerUpTimer(20000); // 20 секунд множителя
        setSpeedChangeBlocked(false);
        break;
      default:
        setSpeedChangeBlocked(false);
        break;
    }
  }, [activePowerUp]);

  // Генерация случайного яблока
  const generateApple = useCallback(() => {
    let newApple;
    const maxAttempts = 100; // Предотвращаем бесконечный цикл
    let attempts = 0;
    
    // eslint-disable-next-line no-loop-func
    do {
      newApple = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
      attempts++;
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y) && attempts < maxAttempts);
    
    return newApple;
  }, [snake, width, height]);

  // Проверка столкновений
  const checkCollision = useCallback((head) => {
    // Столкновение со стенами
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
      return true;
    }
    // Столкновение с собой
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake, width, height]);

  // Движение змейки
  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver || isPaused) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Проверка столкновений (кроме неуязвимости)
      if (checkCollision(head) && activePowerUp?.type !== 'INVINCIBLE') {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

          // Проверка поедания яблока
          if (head.x === apple.x && head.y === apple.y) {
            // Базовые очки за яблоко
            let basePoints = 10;
            
            // Применяем множитель от активного бонуса
            if (activePowerUp && (activePowerUp.type === 'GOLDEN' || activePowerUp.type === 'SILVER')) {
              basePoints *= activePowerUp.points;
            }
            
            setScore(prev => prev + basePoints);
            setApple(generateApple());
            // Увеличиваем скорость каждые 50 очков
            if (score % 50 === 0 && score > 0) {
              setSpeed(prev => Math.max(50, prev - 10));
            }
          } else {
            newSnake.pop();
          }

          // Проверка поедания бонусов
          const eatenPowerUp = powerUps.find(pu => pu.x === head.x && pu.y === head.y);
          if (eatenPowerUp) {
            // Бонусы очков дают базовые очки + активируют множитель
            if (eatenPowerUp.type === 'GOLDEN' || eatenPowerUp.type === 'SILVER') {
              setScore(prev => prev + 10); // Базовые очки за бонус
              applyPowerUpEffect(eatenPowerUp);
            } else {
              // Обычные бонусы дают стандартные очки
              setScore(prev => prev + eatenPowerUp.points * 10);
              applyPowerUpEffect(eatenPowerUp);
            }
            
            setPowerUps(prev => prev.filter(pu => pu !== eatenPowerUp));
            // Удаляем время жизни бонуса
            setPowerUpLifetimes(prev => {
              const newLifetimes = { ...prev };
              delete newLifetimes[eatenPowerUp.id];
              return newLifetimes;
            });
          }

      return newSnake;
    });
  }, [direction, gameStarted, gameOver, isPaused, apple, checkCollision, generateApple, score, powerUps, applyPowerUpEffect]);

  // Обработка клавиш
  const handleKeyPress = useCallback((e) => {
    if (gameOver) return;

    const key = e.key.toLowerCase();
    switch (key) {
      case 'arrowup':
      case 'w':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'arrowdown':
      case 's':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'arrowleft':
      case 'a':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'arrowright':
      case 'd':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
          case ' ':
            e.preventDefault();
            if (!gameStarted) {
              setGameStarted(true);
            } else if (gameStarted && !gameOver) {
              setIsPaused(!isPaused);
            }
            break;
          case 'p':
            e.preventDefault();
            if (gameStarted && !gameOver) {
              setIsPaused(!isPaused);
            }
            break;
          case '+':
          case '=':
            e.preventDefault();
            if (gameStarted && !gameOver && !isPaused && !speedChangeBlocked) {
              setSpeed(prev => Math.max(prev - 20, 50));
            }
            break;
          case '-':
            e.preventDefault();
            if (gameStarted && !gameOver && !isPaused && !speedChangeBlocked) {
              setSpeed(prev => Math.min(prev + 20, 300));
            }
            break;
          default:
            break;
    }
  }, [direction, gameOver, gameStarted, isPaused, speedChangeBlocked]);

  // Инициализация яблока только при старте игры
  useEffect(() => {
    if (!gameStarted && !gameOver) {
      setApple(generateApple());
    }
  }, [gameStarted, gameOver, generateApple]);

  // Добавляем первый бонус при старте игры
  useEffect(() => {
    if (gameStarted && !gameOver && powerUps.length === 0 && powerUpsEnabled) {
      const firstPowerUp = generatePowerUp();
      console.log('Adding first power-up:', firstPowerUp);
      setPowerUps([firstPowerUp]);
    }
  }, [gameStarted, gameOver, powerUps.length, generatePowerUp, powerUpsEnabled]);

  // Обработчики событий
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, gameStarted, gameOver, isPaused, speed]);

  // Генерация бонусов
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || !powerUpsEnabled) return;

    const powerUpInterval = setInterval(() => {
      setPowerUps(prev => {
        if (Math.random() < 0.15 && prev.length < 2) { // 15% шанс, максимум 2 бонуса
          const newPowerUp = generatePowerUp();
          console.log('Adding new power-up:', newPowerUp);
          // Устанавливаем время жизни бонуса (15 секунд)
          setPowerUpLifetimes(prevLifetimes => ({
            ...prevLifetimes,
            [newPowerUp.id]: 15000
          }));
          return [...prev, newPowerUp];
        }
        return prev;
      });
    }, 8000); // Каждые 8 секунд

    return () => clearInterval(powerUpInterval);
  }, [gameStarted, gameOver, isPaused, generatePowerUp, powerUpsEnabled]);

  // Отслеживание времени жизни бонусов
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused || !powerUpsEnabled) return;

    const lifetimeInterval = setInterval(() => {
      setPowerUpLifetimes(prevLifetimes => {
        const newLifetimes = {};
        const powerUpsToRemove = [];

        Object.keys(prevLifetimes).forEach(powerUpId => {
          const newLifetime = prevLifetimes[powerUpId] - 100;
          if (newLifetime <= 0) {
            powerUpsToRemove.push(powerUpId);
          } else {
            newLifetimes[powerUpId] = newLifetime;
          }
        });

        // Удаляем бонусы с истекшим временем жизни
        if (powerUpsToRemove.length > 0) {
          setPowerUps(prev => prev.filter(pu => !powerUpsToRemove.includes(pu.id)));
        }

        return newLifetimes;
      });
    }, 100); // Проверяем каждые 100мс

    return () => clearInterval(lifetimeInterval);
  }, [gameStarted, gameOver, isPaused, powerUpsEnabled]);

  // Таймер активного бонуса
  useEffect(() => {
    if (!activePowerUp || powerUpTimer <= 0) return;

    const timer = setInterval(() => {
      setPowerUpTimer(prev => {
        if (prev <= 100) {
          setActivePowerUp(null);
          // Сбрасываем скорость только для бонусов ускорения/замедления
          if (activePowerUp.type === 'SPEED_BOOST' || activePowerUp.type === 'SLOW_DOWN') {
            resetSpeedToDefault();
          } else {
            // Для других бонусов просто разблокируем скорость
            setSpeedChangeBlocked(false);
          }
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [activePowerUp, powerUpTimer, resetSpeedToDefault]);

  // Обработка окончания игры
  useEffect(() => {
    if (gameOver && onGameEnd) {
      onGameEnd(score);
    }
  }, [gameOver, score, onGameEnd]);

  // Сброс игры
  const resetGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setScore(0);
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    setSpeed(150);
    setPowerUps([]);
    setActivePowerUp(null);
    setPowerUpTimer(0);
    setSpeedChangeBlocked(false);
    setPowerUpLifetimes({});
    setApple(generateApple());
  };

  // Логика для отрисовки клеток и игры
  const renderCell = (row, col) => {
    const isSnake = snake.some(segment => segment.x === col && segment.y === row);
    const isApple = apple.x === col && apple.y === row;
    const powerUp = powerUps.find(pu => pu.x === col && pu.y === row);
    const isHead = snake[0] && snake[0].x === col && snake[0].y === row;
    const isTail = snake[snake.length - 1] && snake[snake.length - 1].x === col && snake[snake.length - 1].y === row;
    const snakeIndex = snake.findIndex(segment => segment.x === col && segment.y === row);
    
    // Получаем время жизни бонуса для анимации
    const powerUpLifetime = powerUp ? powerUpLifetimes[powerUp.id] : null;
    const lifetimePercent = powerUpLifetime ? (powerUpLifetime / 15000) * 100 : 100;

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${isSnake ? 'snake' : ''} ${isApple ? 'apple' : ''} ${powerUp ? 'power-up' : ''} ${isHead ? 'snake-head' : ''} ${isTail ? 'snake-tail' : ''}`}
        data-snake-index={isSnake ? snakeIndex : null}
        style={{
          backgroundColor: powerUp ? powerUp.color : (isSnake ? (isDarkMode ? 'white' : 'black') : ''),
          borderColor: isDarkMode ? 'white' : 'black',
          opacity: powerUp ? Math.max(0.3, lifetimePercent / 100) : 1,
        }}
      ></div>
    );
  };

  return (
    <div className={`snake-game ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="game-header">
            <h2 className="score">Score: {score}</h2>
            <div className="game-info">
              <p>Speed: {Math.round((300 - speed) / 10)} ({speed}ms)</p>
              <div className="speed-bar">
                <div 
                  className={`speed-fill ${speedChangeBlocked ? 'blocked' : ''}`}
                  style={{ width: `${((300 - speed) / 250) * 100}%` }}
                ></div>
              </div>
              <p>Size: {fieldSize}</p>
              {activePowerUp && (
                <div className="active-power-up">
                  <p>Active: {activePowerUp.name}</p>
                  <div className="power-up-timer">
                    <div 
                      className="timer-fill" 
                      style={{ width: `${(powerUpTimer / activePowerUp.duration) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {isPaused && <p className="paused">PAUSED</p>}
            </div>
          </div>
      
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <div className="start-content">
            <div className="start-left">
              <h3>Press SPACE to start</h3>
              <p>Use WASD or Arrow Keys to move</p>
              <p>Press P or SPACE to pause</p>
              <p>Use +/- to change speed (50-300ms)</p>
              <div className="power-ups-toggle">
                <label>
                  <input 
                    type="checkbox" 
                    checked={powerUpsEnabled}
                    onChange={(e) => setPowerUpsEnabled(e.target.checked)}
                  />
                  Enable Power-ups
                </label>
              </div>
            </div>
            <div className="start-right">
              {powerUpsEnabled ? (
                <>
                  <h4>Power-ups:</h4>
                      <div className="power-up-info">
                        <div className="power-up-item">
                          <div className="power-up-color" style={{ backgroundColor: '#FFD700' }}></div>
                          <span>Golden - x4 points (20s)</span>
                        </div>
                        <div className="power-up-item">
                          <div className="power-up-color" style={{ backgroundColor: '#C0C0C0' }}></div>
                          <span>Silver - x2 points (20s)</span>
                        </div>
                    <div className="power-up-item">
                      <div className="power-up-color" style={{ backgroundColor: '#FF0000' }}></div>
                      <span>Speed Boost - 10s</span>
                    </div>
                    <div className="power-up-item">
                      <div className="power-up-color" style={{ backgroundColor: '#0000FF' }}></div>
                      <span>Slow Down - 10s</span>
                    </div>
                    <div className="power-up-item">
                      <div className="power-up-color" style={{ backgroundColor: '#00FF00' }}></div>
                      <span>Invincible - 15s</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-power-ups">
                  <h4>Classic Mode</h4>
                  <p>No power-ups enabled</p>
                  <p>Pure snake gameplay</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isPaused && gameStarted && !gameOver && (
        <div className="pause-screen">
          <h3>PAUSED</h3>
          <p>Press P or SPACE to resume</p>
        </div>
      )}

      {gameOver && (
        <div className="game-over-screen">
          <h2 className="game-over">GAME OVER</h2>
          <p>Final Score: {score}</p>
          <button onClick={resetGame} className="restart-button">
            Play Again
          </button>
        </div>
      )}

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

          <div className="controls">
            <p>Controls: WASD or Arrow Keys</p>
            <p>Pause: P or SPACE | Speed: +/- (50-300ms)</p>
            <button onClick={() => onGameEnd && onGameEnd(score)} className="back-button">
              Back to Menu
            </button>
          </div>
    </div>
  );
}

export default SnakeGame;
