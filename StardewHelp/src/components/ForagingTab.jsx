import { getForagingForSeason } from '../data/foraging';
import ChecklistItem from './ChecklistItem';

function groupByFirstLocation(items) {
  const groups = {};
  for (const item of items) {
    const loc = item.locations[0] || 'Otros';
    if (!groups[loc]) groups[loc] = [];
    groups[loc].push(item);
  }
  return groups;
}

export default function ForagingTab({ season, checkedItems, onCheck, accentColor }) {
  const items = getForagingForSeason(season);
  const checkedCount = items.filter(i => checkedItems[i.id]).length;

  // Separar especiales / valiosos
  const special = items.filter(i => i.sellPrice >= 500 || i.npcFavorite);
  const regular = items.filter(i => !special.includes(i));
  const groups = groupByFirstLocation(regular);

  return (
    <div>
      {/* Progreso */}
      {items.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div className="progress-label">{checkedCount} / {items.length} encontrados</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${(checkedCount / items.length) * 100}%`, background: accentColor }} />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍄</div>
          <p>No hay items de forrajeo esta estación.</p>
        </div>
      ) : (
        <>
          {/* Especiales / valiosos */}
          {special.length > 0 && (
            <>
              <div className="section-header" style={{ color: '#f0a500', borderColor: '#f0a500' }}>
                ⭐ Especiales y valiosos ({special.length})
              </div>
              {special.map(item => (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  emoji={item.emoji}
                  name={item.name}
                  meta={item.locations.map(l => `📍 ${l}`).join(' • ')}
                  price={item.sellPrice}
                  tip={item.tip}
                  checked={!!checkedItems[item.id]}
                  onCheck={onCheck}
                  badgeText={item.npcFavorite ? 'Favorito de NPCs 💖' : undefined}
                  badgeType="warning"
                />
              ))}
            </>
          )}

          {/* Por ubicación */}
          {Object.entries(groups).map(([loc, locItems]) => (
            <div key={loc}>
              <div className="section-header" style={{ color: accentColor, borderColor: accentColor }}>
                📍 {loc} ({locItems.length})
              </div>
              {locItems.map(item => (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  emoji={item.emoji}
                  name={item.name}
                  meta={item.locations.length > 1 ? item.locations.slice(1).map(l => `también: ${l}`).join(' • ') : undefined}
                  price={item.sellPrice}
                  tip={item.tip}
                  checked={!!checkedItems[item.id]}
                  onCheck={onCheck}
                  badgeText={item.canDonate ? 'Donar al museo' : undefined}
                  badgeType="info"
                />
              ))}
            </div>
          ))}

          {/* Tip general */}
          <div style={{ marginTop: '1rem', padding: '0.7rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.8rem', color: '#666' }}>
            💡 Consejo: Sube el nivel de forrajeo recolectando regularmente. A nivel 4+ obtienes versiones doradas.
            {season === 'invierno' && ' En invierno no crecen cultivos, ¡forrajear es clave para ingresos!'}
          </div>
        </>
      )}
    </div>
  );
}
