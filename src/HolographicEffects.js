import React, { useState, useEffect } from 'react';
import './HolographicEffects.css';

function HolographicEffects({ isDarkMode }) {
  const [holograms, setHolograms] = useState([]);

  useEffect(() => {
    const generateHolograms = () => {
      const newHolograms = [];
      for (let i = 0; i < 4; i++) {
        newHolograms.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 100 + 50,
          rotation: Math.random() * 360,
          speed: Math.random() * 2 + 1,
          delay: Math.random() * 3,
          type: ['hexagon', 'circle', 'triangle', 'square'][Math.floor(Math.random() * 4)]
        });
      }
      setHolograms(newHolograms);
    };

    // Задержка загрузки голографических эффектов
    const timeout = setTimeout(() => {
      generateHolograms();
      const interval = setInterval(generateHolograms, 60000);
      return () => clearInterval(interval);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`holographic-effects ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Голографические фигуры */}
      {holograms.map(hologram => (
        <div
          key={hologram.id}
          className={`hologram ${hologram.type}`}
          style={{
            left: `${hologram.x}%`,
            top: `${hologram.y}%`,
            width: `${hologram.size}px`,
            height: `${hologram.size}px`,
            animationDelay: `${hologram.delay}s`,
            animationDuration: `${hologram.speed * 8}s`,
            transform: `rotate(${hologram.rotation}deg)`
          }}
        />
      ))}

      {/* Голографические линии */}
      <div className="holo-lines">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="holo-line"
            style={{
              top: `${i * 6.67}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${30 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Голографические точки */}
      <div className="holo-dots">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="holo-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HolographicEffects;
