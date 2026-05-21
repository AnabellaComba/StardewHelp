// Horario aproximado de los NPCs de Stardew Valley
// from/to en horas de 24h (25 = 1am del día siguiente, techo del juego)
// Los horarios son orientativos basados en el comportamiento general del juego

export const schedules = {
  abigail: [
    { from: 6,  to: 10, location: '🏠 Casa de Pierre (cuarto)' },
    { from: 10, to: 14, location: '🏪 Tienda de Pierre' },
    { from: 14, to: 18, location: '⚔️ Cementerio / Montaña' },
    { from: 18, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Casa (dormida)' },
  ],
  alex: [
    { from: 6,  to: 10, location: '🏠 Casa de Alex (jardín)' },
    { from: 10, to: 17, location: '🏖️ Playa' },
    { from: 17, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Casa (dormido)' },
  ],
  caroline: [
    { from: 6,  to: 9,  location: '🏠 Casa (cocina)' },
    { from: 9,  to: 17, location: '🏪 Tienda de Pierre' },
    { from: 17, to: 20, location: '🍵 Jardín de té secreto' },
    { from: 20, to: 25, location: '🌙 Casa (dormida)' },
  ],
  clint: [
    { from: 6,  to: 9,  location: '🏠 Casa (desayuno)' },
    { from: 9,  to: 17, location: '⚒️ Herrería' },
    { from: 17, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Casa (dormido)' },
  ],
  demetrius: [
    { from: 6,  to: 9,  location: '🏠 Casa (desayuno)' },
    { from: 9,  to: 14, location: '🔬 Laboratorio (casa)' },
    { from: 14, to: 18, location: '⛰️ Montaña (investigación)' },
    { from: 18, to: 21, location: '🏠 Casa' },
    { from: 21, to: 25, location: '🌙 Casa (dormido)' },
  ],
  dwarf: [
    { from: 6,  to: 25, location: '⛏️ Las Minas (nivel 5)' },
  ],
  elliott: [
    { from: 6,  to: 10, location: '🏠 Cabaña en la playa (escribiendo)' },
    { from: 10, to: 16, location: '🏖️ Playa' },
    { from: 16, to: 20, location: '📚 Biblioteca' },
    { from: 20, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Cabaña (dormido)' },
  ],
  emily: [
    { from: 6,  to: 9,  location: '🏠 Casa (dormida)' },
    { from: 9,  to: 14, location: '🧵 Casa (cosiendo)' },
    { from: 14, to: 18, location: '🏘️ Pueblo' },
    { from: 18, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Casa (dormida)' },
  ],
  evelyn: [
    { from: 6,  to: 9,  location: '🏠 Casa (cocina)' },
    { from: 9,  to: 13, location: '🌳 Parque del pueblo' },
    { from: 13, to: 18, location: '🏠 Casa' },
    { from: 18, to: 25, location: '🌙 Casa (dormida)' },
  ],
  george: [
    { from: 6,  to: 14, location: '🏠 Casa (sillón — TV)' },
    { from: 14, to: 18, location: '🏘️ Pueblo (caminata breve)' },
    { from: 18, to: 25, location: '🏠 Casa (dormido)' },
  ],
  gil: [
    { from: 6,  to: 25, location: '⚔️ Gremio de Aventureros (silla)' },
  ],
  gus: [
    { from: 6,  to: 9,  location: '🏠 Salón (habitación)' },
    { from: 9,  to: 25, location: '🍻 Salón de Gus (mostrador)' },
  ],
  harvey: [
    { from: 6,  to: 9,  location: '🏠 Apartamento (arriba de la clínica)' },
    { from: 9,  to: 17, location: '🏥 Clínica médica' },
    { from: 17, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Apartamento (dormido)' },
  ],
  haley: [
    { from: 6,  to: 11, location: '🏠 Casa (dormida tarde)' },
    { from: 11, to: 15, location: '🌳 Parque del pueblo (fotos)' },
    { from: 15, to: 19, location: '🏖️ Playa' },
    { from: 19, to: 25, location: '🏠 Casa (dormida)' },
  ],
  jas: [
    { from: 6,  to: 12, location: '🐄 Granja de Marnie' },
    { from: 12, to: 17, location: '🌳 Parque / Cementerio (con Vincent)' },
    { from: 17, to: 25, location: '🐄 Granja de Marnie (dormida)' },
  ],
  jodi: [
    { from: 6,  to: 9,  location: '🏠 Casa (cocina)' },
    { from: 9,  to: 14, location: '🌳 Parque del pueblo' },
    { from: 14, to: 19, location: '🏠 Casa' },
    { from: 19, to: 25, location: '🌙 Casa (dormida)' },
  ],
  kent: [
    { from: 6,  to: 10, location: '🏠 Casa (desayuno)' },
    { from: 10, to: 17, location: '🏘️ Pueblo / Parque' },
    { from: 17, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Casa (dormido)' },
  ],
  krobus: [
    { from: 6,  to: 14, location: '🚰 Alcantarillas (tienda abierta)' },
    { from: 14, to: 21, location: '🚰 Alcantarillas (camina)' },
    { from: 21, to: 25, location: '🌙 Alcantarillas (duerme)' },
  ],
  leah: [
    { from: 6,  to: 10, location: '🏠 Cabaña (escultura)' },
    { from: 10, to: 16, location: '🌲 Bosque / Río (forrajeo)' },
    { from: 16, to: 20, location: '🍻 Salón de Gus' },
    { from: 20, to: 25, location: '🌙 Cabaña (dormida)' },
  ],
  lewis: [
    { from: 6,  to: 9,  location: '🏛️ Mansión del Alcalde' },
    { from: 9,  to: 15, location: '🏘️ Pueblo (recorrido de alcalde)' },
    { from: 15, to: 19, location: '🌳 Parque / Tiendas' },
    { from: 19, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Mansión del Alcalde (dormido)' },
  ],
  linus: [
    { from: 6,  to: 10, location: '⛺ Tienda (montaña)' },
    { from: 10, to: 16, location: '⛰️ Montaña (recolectando)' },
    { from: 16, to: 20, location: '⛺ Tienda (frente)' },
    { from: 20, to: 25, location: '🌙 Tienda (durmiendo)' },
  ],
  marlon: [
    { from: 6,  to: 9,  location: '⚔️ Gremio de Aventureros' },
    { from: 9,  to: 17, location: '⚔️ Gremio de Aventureros (atiende)' },
    { from: 17, to: 25, location: '🌙 Gremio (privado — dormido)' },
  ],
  marnie: [
    { from: 6,  to: 9,  location: '🐄 Granja de Marnie (casa)' },
    { from: 9,  to: 16, location: '🐄 Granja de Marnie (tienda abierta)' },
    { from: 16, to: 21, location: '🐄 Granja (establo / jardín)' },
    { from: 21, to: 25, location: '🌙 Granja (dormida)' },
  ],
  maru: [
    { from: 6,  to: 9,  location: '🏠 Casa (desayuno)' },
    { from: 9,  to: 13, location: '🏥 Clínica médica (asistente)' },
    { from: 13, to: 18, location: '🔬 Laboratorio (casa)' },
    { from: 18, to: 21, location: '🏠 Casa' },
    { from: 21, to: 25, location: '🌙 Casa (dormida)' },
  ],
  pam: [
    { from: 6,  to: 9,  location: '🏠 Tráiler (desayuno)' },
    { from: 9,  to: 17, location: '🚌 Bus Stop / Desierto (conductora)' },
    { from: 17, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Tráiler (dormida)' },
  ],
  penny: [
    { from: 6,  to: 9,  location: '🏠 Tráiler' },
    { from: 9,  to: 13, location: '📚 Biblioteca' },
    { from: 13, to: 17, location: '🌳 Parque (con Jas y Vincent)' },
    { from: 17, to: 20, location: '🏠 Tráiler (cocinando)' },
    { from: 20, to: 25, location: '🌙 Tráiler (dormida)' },
  ],
  pierre: [
    { from: 6,  to: 9,  location: '🏠 Casa' },
    { from: 9,  to: 17, location: '🏪 Tienda de Pierre (abierta)' },
    { from: 17, to: 21, location: '🏠 Casa' },
    { from: 21, to: 25, location: '🌙 Casa (dormido)' },
  ],
  robin: [
    { from: 6,  to: 9,  location: '🏠 Casa (desayuno)' },
    { from: 9,  to: 17, location: '🪵 Carpintería (atiende)' },
    { from: 17, to: 20, location: '🏠 Casa' },
    { from: 20, to: 25, location: '🌙 Casa (dormida)' },
  ],
  sam: [
    { from: 6,  to: 10, location: '🏠 Casa (guitarreando)' },
    { from: 10, to: 14, location: '🏘️ Pueblo / Skate park' },
    { from: 14, to: 18, location: '🏪 JojaMart (trabajo)' },
    { from: 18, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Casa (dormido)' },
  ],
  sandy: [
    { from: 6,  to: 9,  location: '🏜️ Oasis (preparando)' },
    { from: 9,  to: 18, location: '🏜️ Oasis (tienda abierta, Desierto)' },
    { from: 18, to: 25, location: '🌙 Oasis (dormida)' },
  ],
  sebastian: [
    { from: 6,  to: 11, location: '🏠 Cuarto de Sebastian (dormido tarde)' },
    { from: 11, to: 16, location: '💻 Cuarto (programando)' },
    { from: 16, to: 20, location: '⛰️ Montaña / Lago' },
    { from: 20, to: 22, location: '🍻 Salón de Gus' },
    { from: 22, to: 25, location: '🌙 Casa (dormido)' },
  ],
  shane: [
    { from: 6,  to: 9,  location: '🐄 Granja de Marnie (desayuno)' },
    { from: 9,  to: 17, location: '🐄 Granja de Marnie (trabajando)' },
    { from: 17, to: 21, location: '🍻 Salón de Gus' },
    { from: 21, to: 25, location: '🌙 Granja (cuarto — dormido)' },
  ],
  vincent: [
    { from: 6,  to: 9,  location: '🏠 Casa (desayuno)' },
    { from: 9,  to: 13, location: '🏫 Escuela (biblioteca)' },
    { from: 13, to: 17, location: '🌳 Parque / Cementerio (con Jas)' },
    { from: 17, to: 25, location: '🏠 Casa (dormido)' },
  ],
  willy: [
    { from: 6,  to: 9,  location: '🎣 Muelle (pescando temprano)' },
    { from: 9,  to: 17, location: '🐟 Tienda de pesca (muelle)' },
    { from: 17, to: 21, location: '🏖️ Playa (pescando)' },
    { from: 21, to: 25, location: '🌙 Tienda de pesca (dormido)' },
  ],
  wizard: [
    { from: 6,  to: 10, location: '🧙 Torre del Mago (piso principal)' },
    { from: 10, to: 17, location: '🧙 Torre del Mago (sótano / rituales)' },
    { from: 17, to: 25, location: '🌙 Torre del Mago (dormido)' },
  ],
};

/**
 * Devuelve la ubicación de un NPC a una hora dada (6-25)
 */
export function getNPCLocation(npcId, hour) {
  const schedule = schedules[npcId];
  if (!schedule) return null;
  const slot = schedule.find(s => hour >= s.from && hour < s.to);
  return slot ? slot.location : '🌙 Casa (dormido)';
}
