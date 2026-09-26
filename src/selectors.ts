import type { Translation } from './properties.ts'

const classes = {
  // user action
  active: 'aktif',
  focus: 'fokus',
  'focus-visible': 'fokus-terlihat',
  'focus-within': 'fokus-di-dalam',
  hover: 'arahkan',

  // links
  link: 'tautan',
  target: 'sasaran',
  visited: 'dikunjungi',

  // forms
  checked: 'tercentang',
  disabled: 'dinonaktifkan',
  enabled: 'diaktifkan',
  invalid: 'tidak-sah',
  optional: 'opsional',
  'placeholder-shown': 'penampung-tampil',
  required: 'wajib',
  valid: 'sah',

  // structure
  empty: 'kosong',
  'first-child': 'anak-pertama',
  'first-of-type': 'pertama-dari-jenis',
  'last-child': 'anak-terakhir',
  'last-of-type': 'terakhir-dari-jenis',
  'nth-child': 'anak-ke',
  'nth-last-child': 'anak-ke-dari-akhir',
  'nth-of-type': 'ke-dari-jenis',
  'only-child': 'anak-tunggal',
  root: 'akar',

  // logical
  has: 'memiliki',
  is: 'adalah',
  not: 'bukan',
  where: 'dimana'
} as const satisfies Record<string, string>

const elements = {
  after: 'sesudah',
  backdrop: 'tirai-latar',
  before: 'sebelum',
  'first-letter': 'huruf-pertama',
  'first-line': 'baris-pertama',
  marker: 'penanda',
  placeholder: 'penampung',
  selection: 'seleksi'
} as const satisfies Record<string, string>

function toList(dictionary: Record<string, string>): Translation[] {
  return Object.entries(dictionary).map(([en, id]) => ({ en, id }))
}

export const pseudoClasses = toList(classes)
export const pseudoElements = toList(elements)

const selectors: Translation[] = [...pseudoClasses, ...pseudoElements]

export default selectors
