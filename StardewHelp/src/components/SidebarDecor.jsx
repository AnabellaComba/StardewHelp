// Decoraciones laterales con ilustraciones inspiradas en la granja.
export default function SidebarDecor({ position = 'left' }) {
  const leftItems = [
    {
      image: '/decor/real/cow.png',
      title: 'Vacas felices',
      subtitle: 'Leche y queso',
      fit: 'contain',
    },
    {
      image: '/decor/real/chicken.png',
      title: 'Gallinero',
      subtitle: 'Huevos frescos',
      fit: 'contain',
    },
    {
      image: '/decor/real/barn.png',
      title: 'Granero',
      subtitle: 'Centro de la granja',
    },
  ];

  const rightItems = [
    {
      image: '/decor/real/crops.png',
      title: 'Cultivos',
      subtitle: 'Temporada actual',
    },
    {
      image: '/decor/real/fruits.png',
      title: 'Frutas',
      subtitle: 'Mejor calidad',
    },
    {
      image: '/decor/real/harvest.png',
      title: 'Cosecha',
      subtitle: 'Listo para vender',
    },
  ];

  const items = position === 'left' ? leftItems : rightItems;

  return (
    <div className={`sidebar-decor sidebar-${position}`}>
      <div className="sidebar-heading">
        {position === 'left' ? 'Vida en la granja' : 'Producción del día'}
      </div>
      <div className="decor-items">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="decor-card"
            style={{
              animationDelay: `${idx * 0.15}s`,
            }}
            title={item.title}
          >
            <img
              src={item.image}
              alt={item.title}
              className={`decor-image${item.fit === 'contain' ? ' decor-image-contain' : ''}`}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
                const card = event.currentTarget.closest('.decor-card');
                if (card) {
                  card.classList.add('decor-card-missing-image');
                }
              }}
            />
            <div className="decor-image-required">Sprite real requerido</div>
            <div className="decor-meta">
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
