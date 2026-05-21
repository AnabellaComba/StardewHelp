import { getBirthdays, getUpcomingBirthdays } from '../data/npcs';
import { getNPCLocation } from '../data/schedules';

export default function NPCTab({ season, day, currentHour, checkedItems, onCheck, accentColor }) {
  const todayBirthdays = getBirthdays(season, day);
  const upcoming = getUpcomingBirthdays(season, day, 7).filter(b => b.daysUntil > 0);

  return (
    <div>
      {/* Cumpleaños HOY */}
      {todayBirthdays.length > 0 ? (
        <>
          <div className="section-header" style={{ color: '#f06292', borderColor: '#f06292' }}>
            🎂 ¡Cumpleaños hoy! ({todayBirthdays.length})
          </div>
          {todayBirthdays.map(npc => (
          <BirthdayCard key={npc.id} npc={npc} isToday currentHour={currentHour} accentColor="#f06292" />
          ))}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', background: '#f9f9f9', borderRadius: '10px', marginBottom: '0.75rem', fontSize: '0.88rem', color: '#888' }}>
          🎈 No hay cumpleaños hoy.
        </div>
      )}

      {/* Próximos cumpleaños */}
      {upcoming.length > 0 && (
        <>
          <div className="section-header" style={{ color: accentColor, borderColor: accentColor }}>
            📅 Próximos 7 días
          </div>
          {upcoming.map(({ npc, daysUntil, day: bday }) => (
            <BirthdayCard
              key={npc.id}
              npc={npc}
              isToday={false}
              daysUntil={daysUntil}
              birthdayDay={bday}
              currentHour={currentHour}
              accentColor={accentColor}
            />
          ))}
        </>
      )}

      {/* Todos los NPCs */}
      <div className="section-header" style={{ color: accentColor, borderColor: accentColor }}>
        👥 Todos los NPCs esta estación
      </div>
      <AllNPCsThisSeason season={season} accentColor={accentColor} />
    </div>
  );
}

function BirthdayCard({ npc, isToday, daysUntil, birthdayDay, currentHour, accentColor }) {
  const currentLocation = getNPCLocation(npc.id, currentHour);
  return (
    <div className={`card${isToday ? ' birthday-today' : ''}`} style={!isToday ? { borderLeftColor: accentColor } : {}}>
      <div className="card-header">
        <div>
          <span className="card-emoji">{npc.emoji || '👤'}</span>
          <span className="card-title" style={{ marginLeft: '0.4rem' }}>{npc.name}</span>
        </div>
        {isToday
          ? <span className="birthday-badge">🎂 ¡HOY!</span>
          : <span className="card-badge" style={{ background: accentColor }}>en {daysUntil} día{daysUntil !== 1 ? 's' : ''} (día {birthdayDay})</span>
        }
      </div>

      {/* Ubicación actual según horario */}
      {currentLocation && (
        <div className="npc-location-now" style={{ borderColor: accentColor + '55', backgroundColor: accentColor + '11' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: accentColor }}>AHORA</span>
          <span style={{ fontSize: '0.85rem', marginLeft: '0.4rem' }}>{currentLocation}</span>
        </div>
      )}

      {npc.loves && npc.loves.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '0.25rem' }}>💖 Le encanta:</div>
          <div className="gifts-list">
            {npc.loves.map(g => <span key={g} className="gift-tag">{g}</span>)}
          </div>
        </div>
      )}
      {npc.likes && npc.likes.length > 0 && (
        <div style={{ marginTop: '0.4rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: '0.25rem' }}>💛 Le gusta:</div>
          <div className="gifts-list">
            {npc.likes.map(g => <span key={g} className="gift-tag liked">{g}</span>)}
          </div>
        </div>
      )}
      {npc.tip && <div className="card-tip" style={{ marginTop: '0.4rem' }}>{npc.tip}</div>}
    </div>
  );
}

import { npcs } from '../data/npcs';

function AllNPCsThisSeason({ season, accentColor }) {
  const thisSeasonNpcs = npcs.filter(n => n.birthdaySeason === season);
  const otherNpcs = npcs.filter(n => n.birthdaySeason !== season);

  return (
    <div>
      {thisSeasonNpcs.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem', fontStyle: 'italic' }}>
            Con cumpleaños en {season}:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {thisSeasonNpcs.map(n => (
              <div key={n.id} style={{
                background: accentColor + '22',
                border: `1px solid ${accentColor}66`,
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.8rem',
              }}>
                {n.emoji || '👤'} {n.name} <span style={{ color: '#888' }}>día {n.birthdayDay}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
