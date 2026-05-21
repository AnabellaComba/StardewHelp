// Panel compacto de Día + Hora organizados verticalmente
import DaySelector from './DaySelector';
import TimeSlider from './TimeSlider';

export default function DateTimePanel({
  season, day, year, weather, currentHour,
  onSeasonChange, onDayChange, onYearChange, onWeatherChange, onHourChange,
  accentColor, seasonsOrder
}) {
  return (
    <div className="datetime-panel">
      <div className="datetime-main">
        <div className="datetime-days-col">
          <DaySelector
            season={season}
            day={day}
            year={year}
            weather={weather}
            onSeasonChange={onSeasonChange}
            onDayChange={onDayChange}
            onYearChange={onYearChange}
            onWeatherChange={onWeatherChange}
            seasonEmoji=""
            accentColor={accentColor}
            seasonsOrder={seasonsOrder}
            compact={true}
          />
        </div>
        <aside className="datetime-time-col">
          <TimeSlider
            currentHour={currentHour}
            onHourChange={onHourChange}
            accentColor={accentColor}
            compact={false}
          />
        </aside>
      </div>
    </div>
  );
}
