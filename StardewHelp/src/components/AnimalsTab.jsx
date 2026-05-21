import ChecklistItem from './ChecklistItem';
import { ANIMAL_TYPES, fromAbsoluteDay } from '../data/animals';

function formatAbsoluteDay(absoluteDay) {
  const { season, day, year } = fromAbsoluteDay(absoluteDay);
  if (year > 1) {
    return `Año ${year} · Día ${day} de ${season}`;
  }
  return `Día ${day} de ${season}`;
}

function AnimalCard({
  animal,
  state,
  cowFriendshipActions,
  currentAbsoluteDay,
  collectChecked,
  checkedItems,
  onCountChange,
  onEntryDayChange,
  onEntryNameChange,
  onCheck,
  accentColor,
}) {
  const entries = state.entries || [];
  const maxRecordedDay = entries.reduce((max, entry) => Math.max(max, entry.acquiredDay || 1), 1);
  const maxDayOption = Math.max(112, currentAbsoluteDay, maxRecordedDay);
  const dayOptions = Array.from({ length: maxDayOption }, (_, i) => i + 1);
  const count = entries.length;
  const entryCare = entries.map((entry, idx) => {
    const feedId = `feed-${animal.id}-${entry.id}`;
    const petId = `pet-${animal.id}-${entry.id}`;
    const isReady = currentAbsoluteDay >= (entry.acquiredDay + animal.maturityNights);

    return {
      entry,
      idx,
      feedId,
      petId,
      isReady,
      feedChecked: !!checkedItems[feedId],
      petChecked: !!checkedItems[petId],
    };
  });
  const readyEntries = entries.filter(entry => currentAbsoluteDay >= (entry.acquiredDay + animal.maturityNights));
  const pendingEntries = entries.filter(entry => currentAbsoluteDay < (entry.acquiredDay + animal.maturityNights));
  const readyFedTodayCount = entryCare.filter(care => care.isReady && care.feedChecked).length;
  const fedTodayCount = entryCare.filter(care => care.feedChecked).length;
  const petTodayCount = entryCare.filter(care => care.petChecked).length;
  const canTrackDaily = count > 0;
  const canCollectToday = canTrackDaily && readyFedTodayCount > 0;
  const cowHearts = animal.id === 'cow'
    ? Math.min(5, ((cowFriendshipActions || 0) * 0.5))
    : null;

  return (
    <div className="card animal-card" style={{ borderLeftColor: accentColor }}>
      <div className="card-header">
        <div>
          <span className="card-emoji">{animal.emoji}</span>
          <span className="card-title" style={{ marginLeft: '0.4rem' }}>{animal.name}</span>
        </div>
        <span className="card-badge" style={{ background: accentColor }}>
          {count} total
        </span>
      </div>

      <div className="animal-config-row">
        <span className="animal-config-label">Cantidad</span>
        <div className="animal-stepper">
          <button type="button" className="animal-stepper-btn" onClick={() => onCountChange(animal.id, -1)}>
            -
          </button>
          <strong className="animal-stepper-value">{count}</strong>
          <button type="button" className="animal-stepper-btn" onClick={() => onCountChange(animal.id, 1)}>
            +
          </button>
        </div>
      </div>

      {count > 0 && (
        <div className="animal-entry-list">
          {entries.map((entry, idx) => {
            const firstProductDay = entry.acquiredDay + animal.maturityNights;
            const isReady = currentAbsoluteDay >= firstProductDay;
            const nextBirthday = entry.acquiredDay + 112;

            return (
              <div key={entry.id} className="animal-entry-row">
                <div className="animal-entry-title-row">
                  <label htmlFor={`${animal.id}-entry-${entry.id}`} className="animal-config-label">
                    {animal.name} #{idx + 1}
                  </label>
                  {animal.id === 'cow' && (
                    <span className="card-badge info">{entry.purchaseState || 'Comprada'}</span>
                  )}
                </div>
                {animal.id === 'cow' && (
                  <input
                    type="text"
                    className="animal-name-input"
                    value={entry.name || ''}
                    onChange={(e) => onEntryNameChange(animal.id, entry.id, e.target.value)}
                    placeholder={`Nombre de la vaca #${idx + 1}`}
                  />
                )}
                <select
                  id={`${animal.id}-entry-${entry.id}`}
                  className="animal-select"
                  value={entry.acquiredDay}
                  onChange={(e) => onEntryDayChange(animal.id, entry.id, Number(e.target.value))}
                >
                  {dayOptions.map(option => (
                    <option key={option} value={option}>{formatAbsoluteDay(option)}</option>
                  ))}
                </select>
                <div className="animal-entry-meta">
                  {isReady
                    ? `${animal.productEmoji} Produce diario si está alimentado.`
                    : `⏳ Empieza a producir en ${formatAbsoluteDay(firstProductDay)}.`}
                  {animal.id === 'cow' && (
                    <span>🎂 Cumpleaños anual: cada 4 estaciones (referencia: {formatAbsoluteDay(nextBirthday)}).</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {count === 0 && (
        <div className="card-tip">Aumenta la cantidad para empezar a llevar el control de este animal.</div>
      )}

      {canTrackDaily && (
        <>
          <div className="animal-status-box" style={{ borderColor: accentColor + '55', background: accentColor + '12' }}>
            {readyEntries.length > 0 ? (
              <span>
                {animal.productEmoji} Listos para producir hoy: {readyEntries.length} de {count}. Alimentados y listos hoy: {readyFedTodayCount}.
              </span>
            ) : (
              <span>
                ⏳ Aún sin producción disponible. Pendientes de madurar: {pendingEntries.length}.
              </span>
            )}
          </div>

          <div className="animal-care-summary">
            🌾 Alimentados hoy: <strong>{fedTodayCount}</strong> / {count} · 🤲 Acariciados hoy: <strong>{petTodayCount}</strong> / {count}
          </div>

          <div className="animal-care-grid">
            {entryCare.map(care => {
              const entryLabel = animal.id === 'cow'
                ? (care.entry.name?.trim() || `Vaca #${care.idx + 1}`)
                : `${animal.name} #${care.idx + 1}`;

              return (
                <div key={care.entry.id} className="animal-care-row">
                  <span className="animal-care-name">{entryLabel}</span>
                  <button
                    type="button"
                    className={`animal-care-btn${care.feedChecked ? ' active' : ''}`}
                    onClick={() => onCheck(care.feedId)}
                  >
                    🌾 Alimentado
                  </button>
                  <button
                    type="button"
                    className={`animal-care-btn${care.petChecked ? ' active' : ''}`}
                    onClick={() => onCheck(care.petId)}
                  >
                    🤲 Acariciado
                  </button>
                </div>
              );
            })}
          </div>

          {animal.id === 'cow' && (
            <div className="animal-friendship" style={{ borderColor: accentColor + '55' }}>
              <strong>💖 Amistad de vacas:</strong> {cowHearts.toFixed(1)} / 5 corazones.
              <span>
                Sube 0.5 por alimentar y 0.5 por acariciar cada vaca madura por día (máximo 5).
              </span>
            </div>
          )}

          {readyEntries.length > 0 && (
            <ChecklistItem
              id={`collect-${animal.id}`}
              emoji={animal.productEmoji}
              name={`Retirar ${animal.productName.toLowerCase()} de hoy`}
              meta={`Casillero diario de retiro. Si fue alimentado, puedes retirar hasta ${readyEntries.length} ${animal.productName.toLowerCase()}${readyEntries.length !== 1 ? 's' : ''}.`}
              checked={collectChecked}
              onCheck={onCheck}
              badgeText={readyFedTodayCount > 0 ? 'Disponible hoy' : 'Primero alimentar'}
              badgeType={readyFedTodayCount > 0 ? 'info' : 'warning'}
            />
          )}

          {canCollectToday && (
            <div className="card-tip" style={{ marginTop: '0.15rem' }}>
              Hoy deberías tener {readyFedTodayCount} {animal.productName.toLowerCase()}{readyFedTodayCount !== 1 ? 's' : ''} para recoger.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AnimalsTab({
  currentAbsoluteDay,
  checkedItems,
  onCheck,
  animalTracking,
  cowFriendshipActions,
  onAnimalCountChange,
  onAnimalEntryDayChange,
  onAnimalEntryNameChange,
  accentColor,
}) {
  return (
    <div>
      <div className="section-header" style={{ color: accentColor, borderColor: accentColor }}>
        🐾 Animales de granja: control diario
      </div>

      {ANIMAL_TYPES.map(animal => {
        const state = animalTracking[animal.id] || { entries: [] };

        return (
          <AnimalCard
            key={animal.id}
            animal={animal}
            state={state}
            cowFriendshipActions={cowFriendshipActions}
            currentAbsoluteDay={currentAbsoluteDay}
            collectChecked={!!checkedItems[`collect-${animal.id}`]}
            checkedItems={checkedItems}
            onCountChange={onAnimalCountChange}
            onEntryDayChange={onAnimalEntryDayChange}
            onEntryNameChange={onAnimalEntryNameChange}
            onCheck={onCheck}
            accentColor={accentColor}
          />
        );
      })}

      <div style={{ marginTop: '0.9rem', padding: '0.7rem', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.8rem', color: '#666' }}>
        📚 Basado en Stardew Valley Wiki (ES):
        {' '}gallinas maduran en 3 noches y vacas en 5 noches; ambas producen a diario cuando están alimentadas.
      </div>
    </div>
  );
}
