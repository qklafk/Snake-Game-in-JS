import React, { useState, useEffect } from 'react';
import './GlitchEffects.css';
import MatrixRain from './MatrixRain';
import HolographicEffects from './HolographicEffects';

function GlitchEffects({ isDarkMode }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 15 + 10,
          direction: Math.random() * 360,
          delay: Math.random() * 20,
          type: Math.random() > 0.5 ? 'glitch' : 'scan'
        });
      }
      setParticles(newParticles);
    };

    // Задержка загрузки эффектов
    const timeout = setTimeout(() => {
      generateParticles();
      const interval = setInterval(generateParticles, 30000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`glitch-effects ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Сканирующие линии */}
      <div className="scan-lines">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="scan-line"
            style={{
              top: `${i * 5}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Летающие частицы */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`particle ${particle.type}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>

      {/* Глитчевые искажения */}
      <div className="glitch-distortions">
        <div className="distortion distortion-1" />
        <div className="distortion distortion-2" />
        <div className="distortion distortion-3" />
      </div>

      {/* Случайные вспышки */}
      <div className="glitch-flashes">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className="flash"
            style={{
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Матричный дождь */}
      <MatrixRain isDarkMode={isDarkMode} />
      
      {/* Голографические эффекты */}
      <HolographicEffects isDarkMode={isDarkMode} />
    </div>
  );
}

export default GlitchEffects;
