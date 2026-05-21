import { crops } from '../data/crops';
import { fish } from '../data/fish';
import { npcs } from '../data/npcs';
import { foraging } from '../data/foraging';
import { getNPCLocation } from '../data/schedules';

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matches(text, query) {
  return normalize(text).includes(normalize(query));
}

function searchAll(query) {
  const results = [];

  // Crops
  for (const item of crops) {
    if (
      matches(item.name, query) ||
      (item.tip && matches(item.tip, query)) ||
      (item.seedShop && matches(item.seedShop, query))
    ) {
      results.push({ type: 'crop', item, icon: '🌱' });
    }
  }

  // Fish
  for (const item of fish) {
    if (
      matches(item.name, query) ||
      matches(item.location, query) ||
      (item.tip && matches(item.tip, query))
    ) {
      results.push({ type: 'fish', item, icon: '🎣' });
    }
  }

  // NPCs
  for (const item of npcs) {
    if (
      matches(item.name, query) ||
      (item.location && matches(item.location, query)) ||
      item.loves.some(l => matches(l, query)) ||
      item.likes.some(l => matches(l, query)) ||
      (item.tip && matches(item.tip, query))
    ) {
      results.push({ type: 'npc', item, icon: '👤' });
    }
  }

  // Foraging
  for (const item of foraging) {
    if (
      matches(item.name, query) ||
      item.locations.some(l => matches(l, query)) ||
      (item.tip && matches(item.tip, query))
    ) {
      results.push({ type: 'foraging', item, icon: '🍄' });
    }
  }

  return results;
}

const TYPE_LABELS = {
  crop: '🌱 Cultivo',
  fish: '🎣 Pez',
  npc: '👤 NPC',
  foraging: '🍄 Forrajeo',
};

export default function SearchResults({ query, season, day, currentHour, accentColor }) {
  const results = searchAll(query);

  if (results.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <p>Sin resultados para "<strong>{query}</strong>"</p>
        <p style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: '#aaa' }}>
          Intenta con otro término: nombre, ubicación, regalo...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: '0.75rem' }}>
        {results.length} resultado{results.length !== 1 ? 's' : ''} para "<strong>{query}</strong>"
      </div>
      {results.map(({ type, item, icon }, idx) => (
        <ResultCard key={`${type}-${item.id}-${idx}`} type={type} item={item} icon={icon} currentHour={currentHour} accentColor={accentColor} />
      ))}
    </div>
  );
}

function ResultCard({ type, item, icon, currentHour, accentColor }) {
  const label = TYPE_LABELS[type];

  let meta = '';
  let extra = null;

  if (type === 'crop') {
    meta = `${item.seasons?.join(', ')} • ${item.daysToGrow} días • 💰 ${item.sellPrice}g`;
    if (item.tip) extra = <div className="card-tip">{item.tip}</div>;
  }

  if (type === 'fish') {
    const fmtH = h => h >= 24 ? `${h-24}am+1` : h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`;
    meta = `📍 ${item.location} • ⏰ ${fmtH(item.timeStart)}–${fmtH(item.timeEnd)} • ${item.seasons?.join(', ')}`;
    if (item.tip) extra = <div className="card-tip">{item.tip}</div>;
  }

  if (type === 'npc') {
    const loc = getNPCLocation(item.id, currentHour);
    meta = loc ? `Ahora: ${loc}` : `📍 ${item.location}`;
    extra = (
      <>
        {item.loves?.length > 0 && (
          <div style={{ marginTop: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>💖 </span>
            {item.loves.slice(0, 4).map(g => (
              <span key={g} className="gift-tag" style={{ marginRight: '0.2rem' }}>{g}</span>
            ))}
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.2rem' }}>
          🎂 {item.birthday?.season} día {item.birthday?.day}
        </div>
      </>
    );
  }

  if (type === 'foraging') {
    meta = `📍 ${item.locations?.join(', ')} • ${item.seasons?.join(', ')} • 💰 ${item.sellPrice}g`;
    if (item.tip) extra = <div className="card-tip">{item.tip}</div>;
  }

  return (
    <div className="card" style={{ borderLeftColor: accentColor }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{item.emoji || icon}</span>
          <div>
            <span className="card-title">{item.name}</span>
            <span className="card-badge" style={{ background: accentColor, marginLeft: '0.5rem' }}>{label}</span>
          </div>
        </div>
      </div>
      {meta && <div className="card-details">{meta}</div>}
      {extra}
    </div>
  );
}
