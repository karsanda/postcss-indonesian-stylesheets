import type { Translation } from './properties.ts'

// Media types, features and operators. Features that share a name with a property
// (lebar-minimal, tinggi, aspek-rasio, …) come from the property dictionary.
const dictionary = {
  // media types
  print: 'cetak',
  screen: 'layar',

  // logical operators
  and: 'dan',
  not: 'bukan',
  only: 'hanya',
  or: 'atau',

  // features
  hover: 'arahkan',
  orientation: 'orientasi',
  pointer: 'penunjuk',
  'prefers-color-scheme': 'preferensi-skema-warna',
  'prefers-contrast': 'preferensi-kontras',
  'prefers-reduced-motion': 'preferensi-kurangi-gerakan',
  resolution: 'resolusi',

  // feature values
  coarse: 'kasar',
  fine: 'halus',
  landscape: 'lanskap',
  less: 'kurang',
  more: 'lebih',
  'no-preference': 'tanpa-preferensi',
  portrait: 'potret',
  reduce: 'kurangi'
} as const satisfies Record<string, string>

const media: Translation[] = Object.entries(dictionary).map(([en, id]) => ({
  en,
  id
}))

export default media
