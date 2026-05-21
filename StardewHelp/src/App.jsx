import { useState, useEffect } from 'react';
import DaySelector from './components/DaySelector';
import TimeSlider from './components/TimeSlider';
import CropsTab from './components/CropsTab';
import FishTab from './components/FishTab';
import NPCTab from './components/NPCTab';
import ForagingTab from './components/ForagingTab';
import SearchResults from './components/SearchResults';
import './App.css';

const TABS = [
  { id: 'crops', label: '🌱 Cultivos' },
  { id: 'fish', label: '🎣 Pesca' },
  { id: 'npcs', label: '🎂 NPCs' },
  { id: 'foraging', label: '🍄 Forrajeo' },
];

const SEASON_COLORS = {
  primavera: { bg: '#e8f5d0', text: '#2d6a1a', accent: '#5aaa3c' },
  verano: { bg: '#fff8e1', text: '#8a5a00', accent: '#f0a500' },
  otoño: { bg: '#fdf0e0', text: '#7a3200', accent: '#e07a30' },
  invierno: { bg: '#e8f0fb', text: '#1a3a6a', accent: '#4a90d9' },
};

const SEASON_EMOJIS = {
  primavera: '🌸',
  verano: '☀️',
  otoño: '🍂',
  invierno: '❄️',
};

const SEASONS_ORDER = ['primavera', 'verano', 'otoño', 'invierno'];

function App() {
  const [season, setSeason] = useState('primavera');
  const [day, setDay] = useState(1);
  const [activeTab, setActiveTab] = useState('crops');
  const [weather, setWeather] = useState('sol');
  const [checkedItems, setCheckedItems] = useState({});
  const [currentHour, setCurrentHour] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = SEASON_COLORS[season];

  // Resetear checklist al cambiar día o estación
  useEffect(() => {
    setCheckedItems({});
  }, [day, season]);

  const handleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
    setDay(1);
  };

  return (
    <div className="app" style={{
      '--season-bg': colors.bg,
      '--season-text': colors.text,
      '--season-accent': colors.accent,
    }}>

      {/* Header */}
      <header className="app-header" style={{ backgroundColor: colors.accent }}>
        <h1 className="app-title">🌾 StardewHelper</h1>
        <p className="app-subtitle">Tu guía diaria de Stardew Valley</p>
      </header>

      {/* Day Selector */}
      <DaySelector
        season={season}
        day={day}
        weather={weather}
        onSeasonChange={handleSeasonChange}
        onDayChange={setDay}
        onWeatherChange={setWeather}
        seasonEmoji={SEASON_EMOJIS[season]}
        accentColor={colors.accent}
        seasonsOrder={SEASONS_ORDER}
      />

      {/* Time Slider */}
      <TimeSlider
        currentHour={currentHour}
        onHourChange={setCurrentHour}
        accentColor={colors.accent}
      />

      {/* Main Content */}
      <main className="main-content">

        {/* Status bar */}
        <div className="status-bar" style={{ borderColor: colors.accent, backgroundColor: colors.accent + '22' }}>
          <span>{SEASON_EMOJIS[season]} <strong>{season.charAt(0).toUpperCase() + season.slice(1)}</strong></span>
          <span>📅 Día <strong>{day}</strong> / 28</span>
          <span>{weather === 'sol' ? '☀️ Sol' : weather === 'lluvia' ? '🌧️ Lluvia' : '⛅ Nublado'}</span>
          <span>⏳ <strong>{28 - day}</strong> días restantes</span>
        </div>

        {/* Search bar */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar cultivo, pez, NPC, item..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Show search results OR tabs */}
        {searchQuery.trim() ? (
          <SearchResults
            query={searchQuery}
            season={season}
            day={day}
            weather={weather}
            currentHour={currentHour}
            accentColor={colors.accent}
          />
        ) : (
          <>
        {/* Tabs */}
        <div className="tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={activeTab === tab.id
                ? { backgroundColor: colors.accent, color: '#fff', borderColor: colors.accent }
                : { borderColor: colors.accent + '66' }
              }
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="tab-content">
          {activeTab === 'crops' && (
            <CropsTab season={season} day={day} checkedItems={checkedItems} onCheck={handleCheck} accentColor={colors.accent} />
          )}
          {activeTab === 'fish' && (
            <FishTab season={season} weather={weather} currentHour={currentHour} checkedItems={checkedItems} onCheck={handleCheck} accentColor={colors.accent} />
          )}
          {activeTab === 'npcs' && (
            <NPCTab season={season} day={day} currentHour={currentHour} checkedItems={checkedItems} onCheck={handleCheck} accentColor={colors.accent} />
          )}
          {activeTab === 'foraging' && (
            <ForagingTab season={season} checkedItems={checkedItems} onCheck={handleCheck} accentColor={colors.accent} />
          )}
        </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>StardewHelper • Datos de <a href="https://es.stardewvalleywiki.com" target="_blank" rel="noreferrer">Stardew Valley Wiki</a></p>
      </footer>
    </div>
  );
}

export default App;

