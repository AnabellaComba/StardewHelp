// Componente reutilizable para items con checkbox
export default function ChecklistItem({ id, emoji, name, meta, price, tip, checked, onCheck, badgeText, badgeType }) {
  return (
    <div
      className={`checklist-item${checked ? ' checked' : ''}`}
      onClick={() => onCheck(id)}
    >
      <div className="item-checkbox">{checked ? '✓' : ''}</div>
      <span className="item-emoji">{emoji}</span>
      <div className="item-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="item-name">{name}</span>
          {badgeText && (
            <span className={`card-badge ${badgeType || ''}`}>{badgeText}</span>
          )}
        </div>
        {meta && <div className="item-meta">{meta}</div>}
        {price !== undefined && <div className="item-price">💰 {price}g</div>}
        {tip && <div className="card-tip">{tip}</div>}
      </div>
    </div>
  );
}
