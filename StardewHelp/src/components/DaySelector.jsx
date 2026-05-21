const SEASON_OPTIONS = {
  primavera: { icon: '🌸', label: 'Primavera' },
  verano: { icon: '☀️', label: 'Verano' },
  otoño: { icon: '🍂', label: 'Otoño' },
  invierno: { icon: '❄️', label: 'Invierno' },
};

const WEATHER_OPTIONS = [
  { value: 'sol', label: '☀️ Sol' },
  { value: 'lluvia', label: '🌧️ Lluvia' },
  { value: 'cualquiera', label: '⛅ Cualquiera' },
];

const WEEKDAY_HEADERS = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DaySelector({
  season, day, year, weather,
  onSeasonChange, onDayChange, onYearChange, onWeatherChange,
  accentColor, seasonsOrder, compact = false,
}) {
  return (
    <div className={`day-selector${compact ? ' compact' : ''}`}>

      {/* Season tabs */}
      <div className="season-tabs">
        {seasonsOrder.map(s => (
          <button
            key={s}
            className={`season-tab${season === s ? ' active' : ''}${compact ? ' compact' : ''}`}
            style={season === s ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
            onClick={() => onSeasonChange(s)}
          >
            <span className="season-tab-icon" aria-hidden="true">{SEASON_OPTIONS[s].icon}</span>
            <span className="season-tab-label">{SEASON_OPTIONS[s].label}</span>
          </button>
        ))}
      </div>

      {/* Day grid: 4 rows × 7 */}
      <div className={`day-controls${compact ? ' compact' : ''}`}>
        <div className="year-control">
          <label htmlFor="year-input" className="year-label">Año</label>
          <input
            id="year-input"
            className="year-input"
            type="number"
            min="1"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          />
        </div>
        <div className="day-grid-wrap">
          <div className="day-grid-header" aria-hidden="true">
            {WEEKDAY_HEADERS.map(label => (
              <span key={label} className="day-col-label">{label}</span>
            ))}
          </div>
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
      </div>

      {/* Weather selector */}
      <div className={`weather-selector${compact ? ' compact' : ''}`}>
        {WEATHER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`weather-btn${weather === opt.value ? ' active' : ''}${compact ? ' compact' : ''}`}
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
