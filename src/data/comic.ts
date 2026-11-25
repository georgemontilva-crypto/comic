// ------------------------------------------------------------------
// TODO EL CONTENIDO DE LA WEB VIVE AQUÍ.
// Cambia título, textos, personajes y números sin tocar los componentes.
// Para usar arte real de un personaje: pon la imagen en /public/personajes/
// y escribe su ruta en `image` (ej. image: './personajes/greta.webp').
// Mientras `image` esté vacío se muestra el retrato provisional en SVG.
// ------------------------------------------------------------------

export type Stat = { label: string; value: number }

export type Character = {
  id: string
  name: string
  alias: string
  role: string
  bio: string
  quote: string
  color: string
  stats: Stat[]
  image?: string
}

export type Issue = { n: string; time: string; title: string; status: string }

export const comic = {
  title: ['MALA', 'SEÑAL'] as const,
  channel: 33,
  tagline: 'Un cómic para leer con la luz apagada y la tele encendida.',
  lead: 'Seis desconocidos. Un canal que no aparece en ninguna guía. Cero horas de sueño.',
  synopsis:
    'Cada noche, a las 3:33, un canal que no aparece en ninguna guía empieza a transmitir. Quien lo ve no vuelve a dormir. Seis desconocidos lo vieron. Ahora la señal los quiere de vuelta, y ellos solo quieren que alguien apague la tele.',
  facts: [
    { value: 6, label: 'inadaptados' },
    { value: 1, label: 'canal maldito' },
    { value: 0, label: 'horas de sueño' },
  ],
  marqueeA: ['NO AJUSTE SU TELEVISOR', 'EL PROBLEMA ERES TÚ', 'SEÑAL: MALA', 'ÁNIMO: PEOR'],
  marqueeB: ['TRANSMITIENDO DESDE NINGUNA PARTE', '3:33 A. M.', 'NADIE ESTÁ AL MANDO', 'SIGA VIENDO'],
  bumps: [
    ['son las 3:33 de la madrugada.', 'tu mamá cree que estás dormido.', 'nosotros sabemos que no.'],
    ['este cómic no fue aprobado por nadie.', 'ni siquiera por sus autores.', 'gracias por su preferencia.'],
  ],
}

export const characters: Character[] = [
  {
    id: 'greta',
    name: 'Greta Voltio',
    alias: 'La electricista',
    role: 'Líder a la fuerza',
    bio: 'Arreglaba postes de luz hasta que uno le respondió. Desde entonces conduce 20.000 voltios y cero paciencia.',
    quote: 'No estoy enojada. Estoy cargada.',
    color: '#c8ff1a',
    stats: [
      { label: 'Cordura', value: 34 },
      { label: 'Peligro', value: 91 },
      { label: 'Paciencia', value: 3 },
    ],
  },
  {
    id: 'pastor',
    name: 'Pastor Estática',
    alias: 'El televangelista',
    role: 'Profeta de la señal',
    bio: 'Predicaba a las 4 a. m. para nadie. Una noche la tele lo escuchó y se quedó a vivir en su cabeza.',
    quote: 'Hermanos, el control remoto es libre albedrío.',
    color: '#ff2e7e',
    stats: [
      { label: 'Cordura', value: 8 },
      { label: 'Carisma', value: 97 },
      { label: 'Audiencia', value: 1 },
    ],
  },
  {
    id: 'mosca',
    name: 'Mosca',
    alias: 'El repartidor',
    role: 'Mensajero del desastre',
    bio: 'Entrega pedidos que nadie hizo en direcciones que no existen. Ve cuatro segundos al futuro y aun así llega tarde.',
    quote: 'Ya sé lo que vas a decir. No, no traigo cambio.',
    color: '#27e6ff',
    stats: [
      { label: 'Cordura', value: 61 },
      { label: 'Velocidad', value: 88 },
      { label: 'Puntualidad', value: 4 },
    ],
  },
  {
    id: 'hueso',
    name: 'Don Hueso',
    alias: 'El burócrata',
    role: 'Jefe de trámites del más allá',
    bio: 'Murió en 1987 esperando un sello. Sigue en la fila. La diferencia es que ahora él decide quién pasa.',
    quote: 'Le falta el formulario 33-B. Por triplicado.',
    color: '#ffb21a',
    stats: [
      { label: 'Cordura', value: 99 },
      { label: 'Empatía', value: 0 },
      { label: 'Sellos', value: 100 },
    ],
  },
  {
    id: 'neon',
    name: 'La Tía Neón',
    alias: 'La vidente',
    role: 'Oráculo de línea caliente',
    bio: 'Lee el futuro por teléfono a 3,99 el minuto. Acierta siempre, y eso es lo que más asusta.',
    quote: 'Veo un hombre alto en tu vida. Es el cobrador.',
    color: '#a66bff',
    stats: [
      { label: 'Cordura', value: 47 },
      { label: 'Puntería', value: 100 },
      { label: 'Tarifa', value: 82 },
    ],
  },
  {
    id: 'babas',
    name: 'Babas',
    alias: 'La mascota',
    role: 'Perro. Probablemente.',
    bio: 'Tres ojos, una lengua y ningún dueño conocido. Se comió el control remoto y ahora cambia de canal cuando eructa.',
    quote: '…',
    color: '#ff5a2b',
    stats: [
      { label: 'Cordura', value: 50 },
      { label: 'Hambre', value: 100 },
      { label: 'Babas', value: 100 },
    ],
  },
]

export const issues: Issue[] = [
  { n: '01', time: '03:33', title: 'Piloto: nadie pidió esto', status: 'Muy pronto' },
  { n: '02', time: '03:34', title: 'La teletienda del más allá', status: 'En producción' },
  { n: '03', time: '03:35', title: 'Formulario 33-B', status: 'En producción' },
  { n: '04', time: '03:36', title: 'Babas se come el control', status: 'En guion' },
  { n: '05', time: '03:37', title: 'Interferencia familiar', status: 'En guion' },
  { n: '06', time: '03:38', title: 'Fin de la transmisión (mentira)', status: 'Clasificado' },
]
