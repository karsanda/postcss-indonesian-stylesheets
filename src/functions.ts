import type { Translation } from './properties.ts'

const dictionary = {
  // math
  calc: 'hitung',
  clamp: 'jepit',
  max: 'maksimal',
  min: 'minimal',

  // grid and sizing
  'fit-content': 'muat-konten',
  minmax: 'minmaks',
  repeat: 'ulangi',

  // images and gradients
  'conic-gradient': 'gradien-kerucut',
  image: 'gambar',
  'image-set': 'set-gambar',
  'linear-gradient': 'gradien-linear',
  'radial-gradient': 'gradien-radial',
  'repeating-conic-gradient': 'gradien-kerucut-berulang',
  'repeating-linear-gradient': 'gradien-linear-berulang',
  'repeating-radial-gradient': 'gradien-radial-berulang',

  // colors
  'color-mix': 'campuran-warna',
  'light-dark': 'terang-gelap',

  // transforms
  rotate: 'rotasi',
  rotateX: 'rotasi-x',
  rotateY: 'rotasi-y',
  rotateZ: 'rotasi-z',
  scale: 'skala',
  scaleX: 'skala-x',
  scaleY: 'skala-y',
  skew: 'condong',
  skewX: 'condong-x',
  skewY: 'condong-y',
  translate: 'translasi',
  translateX: 'translasi-x',
  translateY: 'translasi-y',
  translateZ: 'translasi-z',

  // filters
  blur: 'buram',
  brightness: 'kecerahan',
  contrast: 'kontras',
  'drop-shadow': 'bayangan-jatuh',
  grayscale: 'skala-abu-abu',
  'hue-rotate': 'rotasi-rona',
  invert: 'inversi',
  opacity: 'transparansi',
  saturate: 'saturasi',

  // timing
  'cubic-bezier': 'bezier-kubik',
  steps: 'langkah',

  // generated content and environment
  attr: 'atribut',
  counter: 'penghitung',
  env: 'lingkungan'
} as const satisfies Record<string, string>

const functions: Translation[] = Object.entries(dictionary).map(([en, id]) => ({
  en,
  id
}))

export default functions
