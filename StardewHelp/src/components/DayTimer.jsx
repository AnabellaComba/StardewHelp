import { useState, useEffect, useRef } from 'react';

const TIMER_SECONDS = 20 * 60; // 20 minutos

export default function DayTimer({ onTimerEnd, timerActive, onTimerToggle, accentColor }) {
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const intervalRef = useRef(null);

  // Iniciar/detener el timer según timerActive
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onTimerEnd();
            return TIMER_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive]);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setSeconds(TIMER_SECONDS);
    if (timerActive) onTimerToggle(); // detener si está activo
  };

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const pct = seconds / TIMER_SECONDS;
  const timerClass = seconds <= 60 ? 'danger' : seconds <= 5 * 60 ? 'warning' : '';

  return (
    <div className="day-timer">
      <div>
        <div className={`timer-display ${timerClass}`}>{display}</div>
        <div className="timer-label">⏱️ Temporizador de día (~20 min)</div>
        {/* Progress bar */}
        <div className="progress-bar-wrap" style={{ width: 180, marginTop: '0.35rem' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${pct * 100}%`,
              background: timerClass === 'danger' ? '#d0392b' : timerClass === 'warning' ? '#e8a020' : accentColor,
            }}
          />
        </div>
      </div>

      <div className="timer-buttons">
        <button
          className="btn btn-primary btn-small"
          style={{ backgroundColor: accentColor }}
          onClick={onTimerToggle}
        >
          {timerActive ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button className="btn btn-secondary btn-small" onClick={handleReset}>
          🔄 Reiniciar
        </button>
      </div>
    </div>
  );
}
