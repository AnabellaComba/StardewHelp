const SEASON_LABELS = {
  primavera: '🌸 Primavera',
  verano: '☀️ Verano',
  otoño: '🍂 Otoño',
  invierno: '❄️ Invierno',
};

const WEATHER_OPTIONS = [
  { value: 'sol', label: '☀️ Sol' },
  { value: 'lluvia', label: '🌧️ Lluvia' },
  { value: 'cualquiera', label: '⛅ Cualquiera' },
];

export default function DaySelector({
  season, day, weather,
  onSeasonChange, onDayChange, onWeatherChange,
  accentColor, seasonsOrder,
}) {
  return (
    <div className="day-selector">

      {/* Season tabs */}
      <div className="season-tabs">
        {seasonsOrder.map(s => (
          <button
            key={s}
            className={`season-tab${season === s ? ' active' : ''}`}
            style={season === s ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
            onClick={() => onSeasonChange(s)}
          >
            {SEASON_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Day grid: 4 rows × 7 */}
      <div className="day-controls">
        <span className="day-label">📅 Día:</span>
        <div className="day-grid">
          {[0, 1, 2, 3].map(row => (
            <div key={row} className="day-row">
              {Array.from({ length: 7 }, (_, col) => row * 7 + col + 1).map(d => (
                <button
                  key={d}
                  className={`day-btn${day === d ? ' active' : ''}`}
                  style={day === d ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                  onClick={() => onDayChange(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Weather selector */}
      <div className="weather-selector">
        <span className="day-label" style={{ alignSelf: 'center' }}>Clima:</span>
        {WEATHER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`weather-btn${weather === opt.value ? ' active' : ''}`}
            style={weather === opt.value ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
            onClick={() => onWeatherChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
