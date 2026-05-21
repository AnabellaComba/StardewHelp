// Slider de hora del día: 6 AM → 1 AM (hora 25 = 1am del día siguiente)

function formatHour(h) {
  if (h >= 24) return `${h - 24}:00 AM ✨`;
  if (h === 12) return '12:00 PM';
  if (h < 12) return `${h}:00 AM`;
  return `${h - 12}:00 PM`;
}

function getTimeEmoji(h) {
  if (h >= 6 && h < 9)   return '🌅';
  if (h >= 9 && h < 12)  return '🌤️';
  if (h >= 12 && h < 14) return '☀️';
  if (h >= 14 && h < 18) return '🌞';
  if (h >= 18 && h < 20) return '🌇';
  if (h >= 20 && h < 22) return '🌆';
  if (h >= 22 && h < 24) return '🌙';
  return '⭐';
}

// Marcas en la barra
const MARKS = [6, 9, 12, 15, 18, 21, 24];

export default function TimeSlider({ currentHour, onHourChange, accentColor }) {
  const pct = ((currentHour - 6) / (25 - 6)) * 100;

  return (
    <div className="time-slider-wrap">
      <div className="time-slider-header">
        <span className="time-emoji">{getTimeEmoji(currentHour)}</span>
        <span className="time-value" style={{ color: accentColor }}>
          {formatHour(currentHour)}
        </span>
        <span className="time-hint">Hora del juego</span>
      </div>

      <div className="time-slider-track-wrap">
        <input
          type="range"
          className="time-slider-input"
          min={6}
          max={25}
          step={1}
          value={currentHour}
          onChange={e => onHourChange(Number(e.target.value))}
          style={{ '--thumb-color': accentColor }}
        />
        {/* Marcas de hora */}
        <div className="time-marks">
          {MARKS.map(h => (
            <span
              key={h}
              className="time-mark"
              style={{ left: `${((h - 6) / 19) * 100}%` }}
            >
              {h < 12 ? `${h}a` : h === 12 ? '12p' : h < 24 ? `${h - 12}p` : '12a'}
            </span>
          ))}
        </div>
      </div>

      {/* Barra de progreso de color */}
      <div className="time-progress-bar">
        <div
          className="time-progress-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, #f0a500, ${accentColor})`,
          }}
        />
      </div>
    </div>
  );
}
