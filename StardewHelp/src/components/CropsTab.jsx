import { getCropsForDay, getTooLateCrops } from '../data/crops';
import ChecklistItem from './ChecklistItem';

export default function CropsTab({ season, day, checkedItems, onCheck, accentColor }) {
  const plantable = getCropsForDay(season, day);
  const tooLate = getTooLateCrops(season, day);

  const checkedCount = plantable.filter(c => checkedItems[c.id]).length;

  const formatMeta = (crop) => {
    const parts = [];
    parts.push(`🌱 ${crop.daysToGrow} días para crecer`);
    if (crop.regrowDays) parts.push(`🔄 Regresa en ${crop.regrowDays} días`);
    if (crop.seedShop) parts.push(`🏪 ${crop.seedShop}`);
    if (crop.yearRequirement) parts.push(`📅 Año ${crop.yearRequirement}+`);
    return parts.join(' • ');
  };

  return (
    <div>
      {/* Progreso */}
      {plantable.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div className="progress-label">{checkedCount} / {plantable.length} revisados</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{
              width: `${plantable.length > 0 ? (checkedCount / plantable.length) * 100 : 0}%`,
              background: accentColor,
            }} />
          </div>
        </div>
      )}

      {/* Cultivos plantables hoy */}
      {plantable.length > 0 ? (
        <>
          <div className="section-header" style={{ borderColor: accentColor, color: accentColor }}>
            ✅ Puedes plantar hoy ({plantable.length})
          </div>
          {plantable.map(crop => (
            <ChecklistItem
              key={crop.id}
              id={crop.id}
              emoji={crop.emoji}
              name={crop.name}
              meta={formatMeta(crop)}
              price={crop.sellPrice}
              tip={crop.tip}
              checked={!!checkedItems[crop.id]}
              onCheck={onCheck}
              badgeText={crop.canBeGiant ? '🌟 Gigante posible' : undefined}
              badgeType="info"
            />
          ))}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🌾</div>
          <p>No hay cultivos que puedas plantar hoy</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>Ya es muy tarde en la estación para que maduren a tiempo.</p>
        </div>
      )}

      {/* Cultivos que ya no llegan */}
      {tooLate.length > 0 && (
        <>
          <div className="section-warning">
            ⚠️ Ya es tarde para plantar ({tooLate.length})
          </div>
          {tooLate.map(crop => (
            <div key={crop.id} className="checklist-item" style={{ opacity: 0.5, cursor: 'default', borderLeft: '4px solid #d0392b' }}>
              <span className="item-emoji">{crop.emoji}</span>
              <div className="item-body">
                <span className="item-name" style={{ textDecoration: 'line-through' }}>{crop.name}</span>
                <div className="item-meta">Necesita {crop.daysToGrow} días — quedan {28 - day} días</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Estaciones y contexto */}
      <div style={{ marginTop: '1rem', padding: '0.7rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.8rem', color: '#666' }}>
        💡 Día {day} de {season} — quedan <strong>{28 - day}</strong> días en la estación.
        {day <= 7 && ' ¡Buen momento para plantar cultivos lentos!'}
        {day > 14 && day <= 21 && ' Solo plantas de 7 días o menos.'}
        {day > 21 && ' Muy pocos cultivos pueden madurar. ¡Prepara la siguiente estación!'}
      </div>
    </div>
  );
}
