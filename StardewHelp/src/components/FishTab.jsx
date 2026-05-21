import { getFishForSeason } from '../data/fish';
import ChecklistItem from './ChecklistItem';

const LOCATION_ORDER = ['Océano', 'Río', 'Lago de montaña', 'Pantano', 'Bosque secreto', 'Las minas', 'Especial'];

function groupByLocation(fishList) {
  const groups = {};
  for (const fish of fishList) {
    const loc = fish.location;
    if (!groups[loc]) groups[loc] = [];
    groups[loc].push(fish);
  }
  return groups;
}

function formatTime(h) {
  if (h >= 24) {
    const adj = h - 24;
    return `${String(adj).padStart(2, '0')}:00 (+1)`;
  }
  return `${String(h).padStart(2, '0')}:00`;
}

export default function FishTab({ season, weather, currentHour, checkedItems, onCheck, accentColor }) {
  const allFish = getFishForSeason(season, weather === 'cualquiera' ? null : weather);

  const checkedCount = allFish.filter(f => checkedItems[f.id]).length;

  // Separar legendarios
  const legendary = allFish.filter(f => f.legendary);
  const normal = allFish.filter(f => !f.legendary);
  const groups = groupByLocation(normal);

  const locations = LOCATION_ORDER.filter(l => groups[l]);
  const otherLocations = Object.keys(groups).filter(l => !LOCATION_ORDER.includes(l));

  return (
    <div>
      {/* Progreso */}
      {allFish.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div className="progress-label">{checkedCount} / {allFish.length} vistos</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${(checkedCount / allFish.length) * 100}%`, background: accentColor }} />
          </div>
        </div>
      )}

      {allFish.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎣</div>
          <p>No hay peces disponibles con el clima actual</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>Intenta cambiar el clima en la selección superior.</p>
        </div>
      ) : (
        <>
          {/* Legendarios */}
          {legendary.length > 0 && (
            <>
              <div className="section-header" style={{ color: '#f0a500', borderColor: '#f0a500' }}>
                ⭐ Peces Legendarios
              </div>
              {legendary.map(fish => (
                <ChecklistItem
                  key={fish.id}
                  id={fish.id}
                  emoji={fish.emoji}
                  name={fish.name}
                  meta={`📍 ${fish.location} • ⏰ ${formatTime(fish.timeStart)}–${formatTime(fish.timeEnd)} • 💪 Dificultad: ${fish.difficulty}`}
                  price={fish.sellPrice}
                  tip={fish.tip}
                  checked={!!checkedItems[fish.id]}
                  onCheck={onCheck}
                  badgeText="Legendario ⭐"
                  badgeType="warning"
                />
              ))}
            </>
          )}

          {/* Por ubicación */}
          {[...locations, ...otherLocations].map(loc => (
            <div key={loc}>
              <div className="section-header" style={{ color: accentColor, borderColor: accentColor }}>
                📍 {loc} ({groups[loc].length})
              </div>
              {groups[loc].map(fish => {
                const activeNow = currentHour >= fish.timeStart && currentHour < fish.timeEnd;
                return (
                  <ChecklistItem
                    key={fish.id}
                    id={fish.id}
                    emoji={fish.emoji}
                    name={fish.name}
                    meta={`⏰ ${formatTime(fish.timeStart)}–${formatTime(fish.timeEnd)} • ${fish.weather === 'sol' ? '☀️ Solo con sol' : fish.weather === 'lluvia' ? '🌧️ Solo con lluvia' : '⛅ Cualquier clima'} • 💪 ${fish.difficulty}`}
                    price={fish.sellPrice}
                    tip={fish.tip}
                    checked={!!checkedItems[fish.id]}
                    onCheck={onCheck}
                    badgeText={activeNow ? '🟢 Ahora activo' : undefined}
                    badgeType="info"
                  />
                );
              })}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
