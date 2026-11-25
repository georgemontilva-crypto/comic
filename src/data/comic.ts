// ------------------------------------------------------------------
// TODO EL CONTENIDO DE LA WEB VIVE AQUÍ.
// Cambia título, textos, personajes y números sin tocar los componentes.
//
// Arte: las imágenes están en /public/arte/. Los retratos del elenco son
// recortes de la portada; para usar arte propio de un personaje, pon el
// archivo en /public/arte/ (vertical 4:5, WebP) y cambia su `image`.
// Los nombres, textos y cifras son PROVISIONALES.
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
  /** personaje aún no revelado: el canal solo muestra estática */
  classified?: boolean
}

export type Issue = { n: string; time: string; title: string; status: string }

export const art = {
  cover: './arte/portada.webp',
  city: './arte/d-ciudad.webp',
  eyes: './arte/d-ojos.webp',
  sword: './arte/d-espada.webp',
  gaze: './arte/d-mirada.webp',
}

export const comic = {
  title: ['MALA', 'SEÑAL'] as const,
  channel: 33,
  tagline: 'Una ciudad cuelga del cielo. Algo la está mirando.',
  lead: 'Seis desconocidos, una espada sin dueño y una señal que nadie debería haber recibido.',
  synopsis:
    'Sobre las ruinas flota una ciudad que nadie recuerda haber construido. Cada noche, a las 3:33, se abre un anillo de luz y algo encapuchado mira hacia abajo. Seis desconocidos le sostuvieron la mirada. Ahora no pueden apartarla.',
  facts: [
    { value: 6, label: 'elegidos a la fuerza' },
    { value: 1, label: 'ciudad colgada del cielo' },
    { value: 0, label: 'formas de bajarla' },
  ],
  marqueeA: ['NO MIRES ARRIBA', 'LA CIUDAD NO BAJA', 'SEÑAL: MALA', 'ALGO TE MIRA'],
  marqueeB: ['TRANSMITIENDO DESDE LAS RUINAS', '3:33 A. M.', 'NADIE ESTÁ AL MANDO', 'SIGA VIENDO'],
  bumps: [
    ['son las 3:33 de la madrugada.', 'la ciudad sigue flotando.', 'nadie sabe quién la sostiene.'],
    ['lo de arriba abrió los ojos.', 'no te pongas nervioso.', 'ya te vio.'],
  ],
  cover: {
    meta: [
      ['Número', '01'],
      ['Estado', 'En producción'],
      ['Formato', 'Por confirmar'],
      ['Estreno', 'Muy pronto'],
    ],
    text: 'Esta es la portada del primer número. Todo lo que aparece en ella va a importar: el anillo, la ciudad, la espada y lo que mira desde arriba.',
  },
}

export const characters: Character[] = [
  {
    id: 'portador',
    name: 'El Portador',
    alias: 'Capa roja',
    role: 'El que encontró la espada',
    bio: 'No buscaba nada y encontró una espada que late. Desde entonces todos esperan que sepa qué hacer con ella.',
    quote: 'Yo solo pasaba por aquí.',
    color: '#ff3048',
    image: './arte/p-portador.webp',
    stats: [
      { label: 'Temple', value: 78 },
      { label: 'Control', value: 22 },
      { label: 'Suerte', value: 9 },
    ],
  },
  {
    id: 'albina',
    name: 'La Albina',
    alias: 'Pelo de ceniza',
    role: 'La que ya estuvo arriba',
    bio: 'Bajó de la ciudad flotante y no cuenta cómo. Sonríe poco, y cuando lo hace conviene correr.',
    quote: 'Arriba no hay nada que quieras ver.',
    color: '#d9e2ff',
    image: './arte/p-albina.webp',
    stats: [
      { label: 'Temple', value: 95 },
      { label: 'Secretos', value: 100 },
      { label: 'Paciencia', value: 12 },
    ],
  },
  {
    id: 'centinela',
    name: 'El Centinela',
    alias: 'Cuello dorado',
    role: 'Desertor de la guardia',
    bio: 'Juró proteger la ciudad y rompió el juramento el mismo día. Conserva el abrigo, las cicatrices y ninguna orden que seguir.',
    quote: 'Las órdenes venían de más arriba.',
    color: '#f5b72e',
    image: './arte/p-centinela.webp',
    stats: [
      { label: 'Fuerza', value: 92 },
      { label: 'Lealtad', value: 40 },
      { label: 'Culpa', value: 88 },
    ],
  },
  {
    id: 'chicle',
    name: 'Chicle',
    alias: 'Interferencia',
    role: 'Pirata de frecuencias',
    bio: 'Escucha todo lo que la ciudad transmite y lo remezcla. Si la señal es mala, probablemente fue ella.',
    quote: 'No lo rompí. Lo mejoré.',
    color: '#ff5fd0',
    image: './arte/p-chicle.webp',
    stats: [
      { label: 'Ingenio', value: 97 },
      { label: 'Ruido', value: 100 },
      { label: 'Respeto', value: 4 },
    ],
  },
  {
    id: 'encapuchado',
    name: 'El Encapuchado',
    alias: 'Sin rostro',
    role: 'Nadie le ha visto los ojos',
    bio: 'Habla poco y siempre sabe dónde va a abrirse el anillo. Se parece demasiado a lo que mira desde arriba.',
    quote: 'Aún no es la hora.',
    color: '#6f86ff',
    image: './arte/p-encapuchado.webp',
    stats: [
      { label: 'Misterio', value: 100 },
      { label: 'Palabras', value: 6 },
      { label: 'Confianza', value: 31 },
    ],
  },
  {
    id: 'clasificado',
    name: '??????',
    alias: 'Sin señal',
    role: 'Sexto integrante',
    bio: 'Este canal todavía no transmite. Quien falta en la portada llega en el número uno.',
    quote: '…',
    color: '#9a94b8',
    classified: true,
    stats: [
      { label: 'Datos', value: 0 },
      { label: 'Rumores', value: 73 },
      { label: 'Ganas', value: 100 },
    ],
  },
]

export const issues: Issue[] = [
  { n: '01', time: '03:33', title: 'La ciudad que no cae', status: 'Muy pronto' },
  { n: '02', time: '03:34', title: 'Seis miradas', status: 'En producción' },
  { n: '03', time: '03:35', title: 'Espada sin dueño', status: 'En producción' },
  { n: '04', time: '03:36', title: 'Interferencia', status: 'En guion' },
  { n: '05', time: '03:37', title: 'Lo que vigila', status: 'En guion' },
  { n: '06', time: '03:38', title: 'Fin de la transmisión', status: 'Clasificado' },
]
