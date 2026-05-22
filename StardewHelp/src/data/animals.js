export const ANIMAL_TYPES = [
  {
    id: 'cow',
    name: 'Vaca',
    emoji: '🐮',
    productName: 'Leche',
    productEmoji: '🥛',
    maturityNights: 5,
    productionEveryDays: 1,
    wikiPath: '/Vaca',
  },
  {
    id: 'chicken',
    name: 'Gallina',
    emoji: '🐥',
    productName: 'Huevo',
    productEmoji: '🥚',
    maturityNights: 3,
    productionEveryDays: 1,
    wikiPath: '/Gallina',
  },
];

export const SEASONS_ORDER = ['primavera', 'verano', 'otoño', 'invierno'];

export function toAbsoluteDay(season, day) {
  const seasonIndex = SEASONS_ORDER.indexOf(season);
  if (seasonIndex < 0) return day;
  return seasonIndex * 28 + day;
}

export function fromAbsoluteDay(absoluteDay) {
  const safeDay = Math.max(1, absoluteDay);
  const year = Math.floor((safeDay - 1) / 112) + 1;
  const dayOfYear = ((safeDay - 1) % 112) + 1;
  const seasonIndex = Math.floor((dayOfYear - 1) / 28);
  const day = ((dayOfYear - 1) % 28) + 1;

  return {
    season: SEASONS_ORDER[seasonIndex],
    day,
    year,
  };
}

export function getAnimalStatus(animalType, currentAbsoluteDay, acquiredAbsoluteDay) {
  if (!acquiredAbsoluteDay) {
    return {
      isConfigured: false,
      firstProductDay: null,
      isReadyToProduce: false,
      daysUntilFirstProduct: null,
    };
  }

  const firstProductDay = acquiredAbsoluteDay + animalType.maturityNights;
  const isReadyToProduce = currentAbsoluteDay >= firstProductDay;

  return {
    isConfigured: true,
    firstProductDay,
    isReadyToProduce,
    daysUntilFirstProduct: isReadyToProduce ? 0 : firstProductDay - currentAbsoluteDay,
  };
}
