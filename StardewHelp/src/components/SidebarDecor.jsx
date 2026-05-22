import { useEffect, useRef, useState } from 'react';

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function playSessionAlarm() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const now = context.currentTime;

  [0, 0.35, 0.7].forEach(offset => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.12, now + offset + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + 0.22);
  });

  window.setTimeout(() => {
    context.close();
  }, 1500);
}

function FarmSessionTimer() {
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const alarmTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (!alarmTriggeredRef.current) {
            alarmTriggeredRef.current = true;
            playSessionAlarm();
            if (navigator.vibrate) {
              navigator.vibrate([250, 120, 250]);
            }
          }
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRunning]);

  const onChangeDuration = (value) => {
    const parsed = Number(value);
    const clamped = Number.isFinite(parsed) ? Math.max(1, Math.min(600, parsed)) : 1;
    setDurationMinutes(clamped);

    if (!isRunning) {
      setSecondsLeft(clamped * 60);
      alarmTriggeredRef.current = false;
    }
  };

  const handleToggleTimer = () => {
    if (!isRunning && secondsLeft === 0) {
      setSecondsLeft(durationMinutes * 60);
      alarmTriggeredRef.current = false;
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
    alarmTriggeredRef.current = false;
  };

  return (
    <div className="farm-timer-card" role="region" aria-label="Temporizador de sesion de juego">
      <strong className="farm-timer-title">Temporizador</strong>
      <span className="farm-timer-subtitle">Controla tu tiempo de juego</span>

      <label className="farm-timer-label" htmlFor="farm-session-minutes">
        Minutos
      </label>
      <input
        id="farm-session-minutes"
        className="farm-timer-input"
        type="number"
        min={1}
        max={600}
        value={durationMinutes}
        onChange={(event) => onChangeDuration(event.target.value)}
      />

      <div className="farm-timer-display">{formatCountdown(secondsLeft)}</div>

      <div className="farm-timer-actions">
        <button type="button" className="farm-timer-btn farm-timer-btn-primary" onClick={handleToggleTimer}>
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button type="button" className="farm-timer-btn" onClick={handleReset}>
          Reiniciar
        </button>
      </div>

      {secondsLeft === 0 && (
        <div className="farm-timer-alert">Hora de frenar y descansar un poco.</div>
      )}
    </div>
  );
}

// Decoraciones laterales con ilustraciones inspiradas en la granja.
export default function SidebarDecor({ position = 'left' }) {
  const leftItems = [
    {
      image: '/decor/real/chicken.png',
      title: 'Gallinero',
      subtitle: 'Huevos frescos',
      fit: 'contain',
    },
    {
      image: '/decor/real/barn.png',
      title: 'Granero',
      subtitle: 'Centro de la granja',
    },
  ];

  const rightItems = [
    {
      image: '/decor/real/crops.png',
      title: 'Cultivos',
      subtitle: 'Temporada actual',
    },
    {
      image: '/decor/real/fruits.png',
      title: 'Frutas',
      subtitle: 'Mejor calidad',
    },
    {
      image: '/decor/real/harvest.png',
      title: 'Cosecha',
      subtitle: 'Listo para vender',
    },
  ];

  const items = position === 'left' ? leftItems : rightItems;

  return (
    <div className={`sidebar-decor sidebar-${position}`}>
      <div className="sidebar-heading">
        {position === 'left' ? 'Vida en la granja' : 'Producción del día'}
      </div>
      {position === 'left' && <FarmSessionTimer />}
      <div className="decor-items">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="decor-card"
            style={{
              animationDelay: `${idx * 0.15}s`,
            }}
            title={item.title}
          >
            <img
              src={item.image}
              alt={item.title}
              className={`decor-image${item.fit === 'contain' ? ' decor-image-contain' : ''}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
                const card = event.currentTarget.closest('.decor-card');
                if (card) {
                  card.classList.add('decor-card-missing-image');
                }
              }}
            />
            <div className="decor-image-required">Sprite real requerido</div>
            <div className="decor-meta">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
