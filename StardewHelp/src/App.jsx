import { useState, useEffect, useMemo } from 'react';
import DaySelector from './components/DaySelector';
import TimeSlider from './components/TimeSlider';
import DateTimePanel from './components/DateTimePanel';
import SidebarDecor from './components/SidebarDecor';
import CropsTab from './components/CropsTab';
import FishTab from './components/FishTab';
import NPCTab from './components/NPCTab';
import ForagingTab from './components/ForagingTab';
import SearchResults from './components/SearchResults';
import AnimalsTab from './components/AnimalsTab';
import { ANIMAL_TYPES, toAbsoluteDay } from './data/animals';
import { getCropsForDay } from './data/crops';
import { getBirthdays } from './data/npcs';
import './App.css';

const TABS = [
  { id: 'crops', label: '🌱 Cultivos' },
  { id: 'fish', label: '🎣 Pesca' },
  { id: 'npcs', label: '🎂 NPCs' },
  { id: 'foraging', label: '🍄 Forrajeo' },
  { id: 'animals', label: '🐾 Animales' },
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
const FESTIVAL_BY_DATE = {
  'primavera-13': 'Festival del Huevo (9:00 - 14:00)',
  'primavera-24': 'Danza de las Flores (9:00 - 14:00)',
  'verano-11': 'Luau (9:00 - 14:00)',
  'verano-28': 'Danza de las Medusas Lunares (22:00 - 00:00)',
  'otoño-16': 'Feria de Stardew Valley (9:00 - 15:00)',
  'otoño-27': 'Víspera de los Espíritus (22:00 - 00:00)',
  'invierno-8': 'Festival del Hielo (9:00 - 14:00)',
  'invierno-25': 'Fiesta de la Estrella Invernal (9:00 - 14:00)',
};

const STORAGE_KEY = 'stardewhelper-state-v2';
const DEFAULT_ANIMAL_TRACKING = {
  cow: { entries: [], friendshipActions: 0, awardedActions: {} },
  chicken: { entries: [] },
};

function readStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (parsed && typeof parsed === 'object') ? parsed : null;
  } catch {
    return null;
  }
}

function mergeAnimalTrackingDefaults(savedTracking) {
  return {
    ...DEFAULT_ANIMAL_TRACKING,
    ...(savedTracking || {}),
    cow: {
      ...DEFAULT_ANIMAL_TRACKING.cow,
      ...((savedTracking && savedTracking.cow) || {}),
      entries: ((savedTracking && savedTracking.cow && savedTracking.cow.entries) || []),
    },
    chicken: {
      ...DEFAULT_ANIMAL_TRACKING.chicken,
      ...((savedTracking && savedTracking.chicken) || {}),
      entries: ((savedTracking && savedTracking.chicken && savedTracking.chicken.entries) || []),
    },
  };
}

function getCowFriendshipActions(animalTracking, checkedItemsByDay) {
  const cowEntries = (animalTracking?.cow?.entries || []);
  if (cowEntries.length === 0) return 0;

  let actions = 0;
  const sortedDayKeys = Object.keys(checkedItemsByDay || {})
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  sortedDayKeys.forEach(dayNumber => {
    const dayChecks = checkedItemsByDay[String(dayNumber)] || {};
    let dayActions = 0;

    cowEntries.forEach(entry => {
      const entryId = entry.id;
      const isMature = dayNumber >= ((entry.acquiredDay || 1) + 5);
      if (!isMature) return;

      if (dayChecks[`feed-cow-${entryId}`]) dayActions += 1;
      if (dayChecks[`pet-cow-${entryId}`]) dayActions += 1;
    });

    // Compatibilidad con datos viejos (cuando solo existía un check global por vaca)
    if (dayActions === 0 && cowEntries.length === 1) {
      const onlyCow = cowEntries[0];
      const isMature = dayNumber >= ((onlyCow.acquiredDay || 1) + 5);
      if (isMature) {
        if (dayChecks['feed-cow']) dayActions += 1;
        if (dayChecks['pet-cow']) dayActions += 1;
      }
    }

    actions += dayActions;
  });

  return actions;
}

function getFriendshipByEntry(animalId, animalType, animalTracking, checkedItemsByDay, currentAbsoluteDay) {
  const entries = (animalTracking?.[animalId]?.entries || []);
  if (entries.length === 0) return {};

  const statsByEntry = Object.fromEntries(
    entries.map(entry => [entry.id, { totalActions: 0, hearts: 0, todayIncrease: 0, isMatureToday: false }])
  );

  const sortedDayKeys = Object.keys(checkedItemsByDay || {})
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);

  sortedDayKeys.forEach(dayNumber => {
    const dayChecks = checkedItemsByDay[String(dayNumber)] || {};

    entries.forEach(entry => {
      const entryStats = statsByEntry[entry.id];
      if (!entryStats) return;

      const isMature = dayNumber >= ((entry.acquiredDay || 1) + animalType.maturityNights);
      if (!isMature) return;

      const fed = !!dayChecks[`feed-${animalId}-${entry.id}`];
      const pet = !!dayChecks[`pet-${animalId}-${entry.id}`];
      entryStats.totalActions += (fed ? 1 : 0) + (pet ? 1 : 0);
    });

    // Compatibilidad con datos viejos (cuando solo existía un check global por vaca)
    if (entries.length === 1) {
      const onlyEntry = entries[0];
      const onlyStats = statsByEntry[onlyEntry.id];
      const isMature = dayNumber >= ((onlyEntry.acquiredDay || 1) + animalType.maturityNights);
      if (isMature) {
        if (dayChecks[`feed-${animalId}`]) onlyStats.totalActions += 1;
        if (dayChecks[`pet-${animalId}`]) onlyStats.totalActions += 1;
      }
    }
  });

  const todayChecks = checkedItemsByDay[String(currentAbsoluteDay)] || {};
  entries.forEach(entry => {
    const entryStats = statsByEntry[entry.id];
    if (!entryStats) return;

    const isMatureToday = currentAbsoluteDay >= ((entry.acquiredDay || 1) + animalType.maturityNights);
    const feedToday = !!todayChecks[`feed-${animalId}-${entry.id}`] || (entries.length === 1 && !!todayChecks[`feed-${animalId}`]);
    const petToday = !!todayChecks[`pet-${animalId}-${entry.id}`] || (entries.length === 1 && !!todayChecks[`pet-${animalId}`]);
    const todayActions = isMatureToday ? ((feedToday ? 1 : 0) + (petToday ? 1 : 0)) : 0;

    entryStats.isMatureToday = isMatureToday;
    entryStats.todayIncrease = todayActions * 0.5;
    entryStats.hearts = Math.min(5, entryStats.totalActions * 0.5);
  });

  return statsByEntry;
}

function getDailyTickerMessages({
  season,
  day,
  year,
  currentAbsoluteDay,
  checkedItems,
  animalTracking,
}) {
  const messages = [];

  const festival = FESTIVAL_BY_DATE[`${season}-${day}`];
  if (festival) {
    messages.push(`🎪 Hoy: ${festival}.`);
  }

  const birthdays = getBirthdays(season, day);
  if (birthdays.length > 0) {
    messages.push(`🎂 Cumpleaños de hoy: ${birthdays.map(npc => npc.name).join(', ')}.`);
  }

  const plantableToday = getCropsForDay(season, day)
    .filter(crop => !crop.yearRequirement || year >= crop.yearRequirement);
  if (plantableToday.length > 0) {
    const sample = plantableToday.slice(0, 3).map(crop => crop.name).join(', ');
    messages.push(`🌱 Plantaciones recomendadas hoy (${plantableToday.length}): ${sample}${plantableToday.length > 3 ? '…' : ''}.`);
  }

  ANIMAL_TYPES.forEach(animal => {
    const entries = animalTracking?.[animal.id]?.entries || [];
    if (entries.length === 0) return;

    const careByEntry = entries.map(entry => {
      const feedId = `feed-${animal.id}-${entry.id}`;
      const petId = `pet-${animal.id}-${entry.id}`;
      const isReady = currentAbsoluteDay >= ((entry.acquiredDay || 1) + animal.maturityNights);
      const isFed = !!checkedItems[feedId] || (entries.length === 1 && !!checkedItems[`feed-${animal.id}`]);
      const isPet = !!checkedItems[petId] || (entries.length === 1 && !!checkedItems[`pet-${animal.id}`]);
      return { isReady, isFed, isPet };
    });

    const pendingFeed = careByEntry.filter(item => !item.isFed).length;
    const pendingPet = careByEntry.filter(item => !item.isPet).length;
    const readyFed = careByEntry.filter(item => item.isReady && item.isFed).length;

    if (pendingFeed > 0) {
      messages.push(`🌾 ${animal.name}: faltan alimentar ${pendingFeed} de ${entries.length}.`);
    }

    if (pendingPet > 0) {
      messages.push(`🤲 ${animal.name}: faltan caricias en ${pendingPet} de ${entries.length}.`);
    }

    if (readyFed > 0 && !checkedItems[`collect-${animal.id}`]) {
      messages.push(`${animal.productEmoji} Recolección pendiente de ${animal.productName.toLowerCase()}: ${readyFed}.`);
    }
  });

  if (messages.length === 0) {
    messages.push('✅ Todo al día por ahora. Revisa clima y hora para optimizar pesca, cultivos y rutinas.');
  }

  return messages;
}

function App() {
  const persistedState = useMemo(() => readStoredState(), []);

  const [season, setSeason] = useState(persistedState?.season || 'primavera');
  const [day, setDay] = useState(persistedState?.day || 1);
  const [year, setYear] = useState(Math.max(1, Number(persistedState?.year) || 1));
  const [activeTab, setActiveTab] = useState(persistedState?.activeTab || 'crops');
  const [weather, setWeather] = useState(persistedState?.weather || 'sol');
  const [checkedItemsByDay, setCheckedItemsByDay] = useState(persistedState?.checkedItemsByDay || {});
  const [currentHour, setCurrentHour] = useState(persistedState?.currentHour || 8);
  const [searchQuery, setSearchQuery] = useState(persistedState?.searchQuery || '');
  const [animalTracking, setAnimalTracking] = useState(mergeAnimalTrackingDefaults(persistedState?.animalTracking));

  const colors = SEASON_COLORS[season];
  const currentAbsoluteDay = ((year - 1) * 112) + toAbsoluteDay(season, day);
  const currentDayKey = String(currentAbsoluteDay);
  const checkedItems = checkedItemsByDay[currentDayKey] || {};
  const cowFriendshipActions = useMemo(
    () => getCowFriendshipActions(animalTracking, checkedItemsByDay),
    [animalTracking, checkedItemsByDay]
  );
  const animalFriendshipByEntry = useMemo(
    () => Object.fromEntries(
      ANIMAL_TYPES.map(animal => [
        animal.id,
        getFriendshipByEntry(animal.id, animal, animalTracking, checkedItemsByDay, currentAbsoluteDay),
      ])
    ),
    [animalTracking, checkedItemsByDay, currentAbsoluteDay]
  );
  const dailyTickerMessages = useMemo(
    () => getDailyTickerMessages({
      season,
      day,
      year,
      currentAbsoluteDay,
      checkedItems,
      animalTracking,
    }),
    [season, day, year, currentAbsoluteDay, checkedItems, animalTracking]
  );

  // Refleja la estación activa en <body> para cambiar el fondo global por CSS.
  useEffect(() => {
    document.body.setAttribute('data-season', season);
  }, [season]);

  useEffect(() => {
    const payload = {
      season,
      day,
      year,
      weather,
      currentHour,
      searchQuery,
      activeTab,
      checkedItemsByDay,
      animalTracking,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [season, day, year, weather, currentHour, searchQuery, activeTab, checkedItemsByDay, animalTracking]);

  const handleCheck = (id) => {
    setCheckedItemsByDay(prev => {
      const today = prev[currentDayKey] || {};
      return {
        ...prev,
        [currentDayKey]: {
          ...today,
          [id]: !today[id],
        },
      };
    });
  };

  const handleSeasonChange = (newSeason) => {
    setSeason(newSeason);
    setDay(1);
  };

  const handleYearChange = (newYear) => {
    setYear(Math.max(1, Number(newYear) || 1));
  };

  const handleAnimalCountChange = (animalId, delta) => {
    setAnimalTracking(prev => {
      const current = prev[animalId] || { entries: [] };
      const currentEntries = current.entries || [];

      if (delta > 0) {
        const newEntry = {
          id: `${animalId}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
          acquiredDay: currentAbsoluteDay,
          purchaseState: 'Comprada',
          ...(animalId === 'cow' ? { name: '' } : {}),
        };

        return {
          ...prev,
          [animalId]: {
            ...current,
            entries: [...currentEntries, newEntry],
          },
        };
      }

      if (currentEntries.length === 0) return prev;

      return {
        ...prev,
        [animalId]: {
          ...current,
          entries: currentEntries.slice(0, -1),
        },
      };
    });
  };

  const handleAnimalEntryDayChange = (animalId, entryId, newDay) => {
    setAnimalTracking(prev => ({
      ...prev,
      [animalId]: {
        ...(prev[animalId] || { entries: [] }),
        entries: ((prev[animalId] && prev[animalId].entries) || []).map(entry => (
          entry.id === entryId
            ? { ...entry, acquiredDay: newDay }
            : entry
        )),
      },
    }));
  };

  const handleAnimalEntryNameChange = (animalId, entryId, newName) => {
    setAnimalTracking(prev => ({
      ...prev,
      [animalId]: {
        ...(prev[animalId] || { entries: [] }),
        entries: ((prev[animalId] && prev[animalId].entries) || []).map(entry => (
          entry.id === entryId
            ? { ...entry, name: newName }
            : entry
        )),
      },
    }));
  };

  return (
    <div className="app" style={{
      '--season-bg': colors.bg,
      '--season-text': colors.text,
      '--season-accent': colors.accent,
    }}>

      {/* Header */}
      <header className="app-header" style={{ backgroundColor: colors.accent }}>
        <img
          className="app-logo"
          src="/decor/real/LogoSH.png"
          alt="StardewHelper"
        />
        <p className="app-subtitle">Tu guía diaria de Stardew Valley</p>
      </header>

      <div className="app-ticker" role="status" aria-live="polite">
        <div className="app-ticker-track">
          {[...dailyTickerMessages, ...dailyTickerMessages].map((message, idx) => (
            <span key={`${idx}-${message}`} className="app-ticker-item">{message}</span>
          ))}
        </div>
      </div>

      {/* Day Selector - REMOVED from here, now in DateTimePanel */}
      {/* Time Slider - REMOVED from here, now in DateTimePanel */}

      {/* Main Content with Sidebar Decorations */}
      <main className="main-content-with-sidebars">
        
        {/* Left Sidebar Decoration */}
        <SidebarDecor position="left" accentColor={colors.accent} />

        {/* Center Content */}
        <div className="main-center">

          {/* DateTime Panel (compact selector + slider) */}
          <DateTimePanel
            season={season}
            day={day}
            year={year}
            weather={weather}
            currentHour={currentHour}
            onSeasonChange={handleSeasonChange}
            onDayChange={setDay}
            onYearChange={handleYearChange}
            onWeatherChange={setWeather}
            onHourChange={setCurrentHour}
            accentColor={colors.accent}
            seasonsOrder={SEASONS_ORDER}
          />

          {/* Main Content */}
          <div className="main-content">

        {/* Status bar */}
        <div className="status-bar" style={{ borderColor: colors.accent, backgroundColor: colors.accent + '22' }}>
          <span>🗓️ Año <strong>{year}</strong></span>
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
          {activeTab === 'animals' && (
            <AnimalsTab
              currentAbsoluteDay={currentAbsoluteDay}
              checkedItems={checkedItems}
              onCheck={handleCheck}
              animalTracking={animalTracking}
              cowFriendshipActions={cowFriendshipActions}
              animalFriendshipByEntry={animalFriendshipByEntry}
              onAnimalCountChange={handleAnimalCountChange}
              onAnimalEntryDayChange={handleAnimalEntryDayChange}
              onAnimalEntryNameChange={handleAnimalEntryNameChange}
              accentColor={colors.accent}
            />
          )}
        </div>
          </>
        )}
        </div>
        </div>

        {/* Right Sidebar Decoration */}
        <SidebarDecor position="right" accentColor={colors.accent} />

      </main>

      <footer className="app-footer">
        <p>StardewHelper • Datos de <a href="https://es.stardewvalleywiki.com" target="_blank" rel="noreferrer">Stardew Valley Wiki</a></p>
      </footer>
    </div>
  );
}

export default App;

