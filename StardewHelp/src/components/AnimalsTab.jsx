import ChecklistItem from './ChecklistItem';
import { ANIMAL_TYPES, fromAbsoluteDay } from '../data/animals';

function formatAbsoluteDay(absoluteDay) {
  const { season, day, year } = fromAbsoluteDay(absoluteDay);
  if (year > 1) {
    return `Año ${year} · Día ${day} de ${season}`;
  }
  return `Día ${day} de ${season}`;
}

function getHeartFillState(heartValue, heartIndex) {
  if (heartValue >= heartIndex + 1) return 'full';
  if (heartValue >= heartIndex + 0.5) return 'half';
  return 'empty';
}

function AnimalCard({
  animal,
  state,
  cowFriendshipActions,
  animalFriendshipByEntry,
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
      friendship: animalFriendshipByEntry?.[animal.id]?.[entry.id],
    };
  });
  const readyEntries = entries.filter(entry => currentAbsoluteDay >= (entry.acquiredDay + animal.maturityNights));
  const pendingEntries = entries.filter(entry => currentAbsoluteDay < (entry.acquiredDay + animal.maturityNights));
  const readyFedTodayCount = entryCare.filter(care => care.isReady && care.feedChecked).length;
  const fedTodayCount = entryCare.filter(care => care.feedChecked).length;
  const petTodayCount = entryCare.filter(care => care.petChecked).length;
  const canTrackDaily = count > 0;
  const canCollectToday = canTrackDaily && readyFedTodayCount > 0;

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
            const friendship = animalFriendshipByEntry?.[animal.id]?.[entry.id];
            const entryLabel = animal.id === 'cow'
              ? (entry.name?.trim() || `Vaca #${idx + 1}`)
              : `${animal.name} #${idx + 1}`;

            return (
              <div key={entry.id} className="animal-entry-row">
                <div className="animal-entry-topline">
                  <div className="animal-entry-title-row">
                    <span className="animal-entry-label">{entryLabel}</span>
                    <span className="card-badge info">{entry.purchaseState || 'Comprada'}</span>
                  </div>
                  <div className="animal-entry-hearts" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, heartIdx) => {
                      const fillState = getHeartFillState(friendship?.hearts || 0, heartIdx);
                      return <span key={heartIdx} className={`animal-heart animal-heart-${fillState}`}>♥</span>;
                    })}
                  </div>
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

                <div className="animal-entry-actions">
                  <button
                    type="button"
                    className={`animal-care-btn${entryCare[idx].feedChecked ? ' active' : ''}`}
                    onClick={() => onCheck(entryCare[idx].feedId)}
                  >
                    🌾 Alimentado
                  </button>
                  <button
                    type="button"
                    className={`animal-care-btn${entryCare[idx].petChecked ? ' active' : ''}`}
                    onClick={() => onCheck(entryCare[idx].petId)}
                  >
                    🤲 Acariciado
                  </button>
                </div>

                <select
                  id={`${animal.id}-entry-${entry.id}`}
                  className="animal-select animal-select-wide"
                  value={entry.acquiredDay}
                  onChange={(e) => onEntryDayChange(animal.id, entry.id, Number(e.target.value))}
                >
                  {dayOptions.map(option => (
                    <option key={option} value={option}>{formatAbsoluteDay(option)}</option>
                  ))}
                </select>

                <div className="animal-entry-meta animal-entry-meta-compact">
                  <span className="animal-entry-line">
                    {isReady
                      ? `${animal.productEmoji} Produce diario si está alimentado.`
                      : `⏳ Empieza a producir en ${formatAbsoluteDay(firstProductDay)}.`}
                  </span>
                  {animal.id === 'cow' && (
                    <span className="animal-entry-line">🎂 Cumpleaños anual: cada 4 estaciones (referencia: {formatAbsoluteDay(nextBirthday)}).</span>
                  )}
                  <span className="animal-entry-line animal-entry-tone">
                    Estado: {entryCare[idx].feedChecked ? 'alimentada' : 'sin alimentar'} · {entryCare[idx].petChecked ? 'acariciada' : 'sin acariciar'}
                  </span>
                </div>

                <div className="animal-care-indicator">
                  <span>
                    Afecto hoy: +{(friendship?.todayIncrease || 0).toFixed(1)} ❤
                  </span>
                  <span>
                    Total: {(friendship?.hearts || 0).toFixed(1)} / 5 ❤
                  </span>
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
          <div className="animal-care-grid">
            <div className="animal-care-row animal-care-row-summary">
              <span className="animal-care-name">Resumen de {animal.name.toLowerCase()}</span>
              <span className="animal-care-summary-pill">🌾 {fedTodayCount} / {count}</span>
              <span className="animal-care-summary-pill">🤲 {petTodayCount} / {count}</span>
              <span className="animal-care-summary-pill animal-care-summary-pill-soft">
                {readyEntries.length > 0
                  ? `${readyFedTodayCount} listas para recoger`
                  : `Pendientes de madurar: ${pendingEntries.length}`}
              </span>
            </div>
          </div>

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
  animalFriendshipByEntry,
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
            animalFriendshipByEntry={animalFriendshipByEntry}
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
