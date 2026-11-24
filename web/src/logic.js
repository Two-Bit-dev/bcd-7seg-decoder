// All the circuit's logic lives here, so every section shows the same truth.

export const SEGMENTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

// Which segments light for each valid digit.
export const DIGITS = {
  0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg',
  5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg',
}
export const E_PATTERN = 'adefg'

// A term is a "cube" over A B C D: '1' = variable, '0' = complemented, '-' = absent.
const t = (label, cube) => ({ label, cube })

export const EXPRESSIONS = {
  a: [t('A', '1---'), t('C', '--1-'), t('BD', '-1-1'), t("B'D'", '-0-0')],
  b: [t("B'", '-0--'), t("C'D'", '--00'), t('CD', '--11')],
  c: [t('B', '-1--'), t("C'", '--0-'), t('D', '---1')],
  d: [t('A', '1---'), t("B'D'", '-0-0'), t("B'C", '-01-'), t("CD'", '--10'), t("BC'D", '-101')],
  e: [t("B'D'", '-0-0'), t("CD'", '--10')],
  f: [t('A', '1---'), t("C'D'", '--00'), t("BC'", '-10-'), t("BD'", '-1-0')],
  g: [t('A', '1---'), t("B'C", '-01-'), t("BC'", '-10-'), t("CD'", '--10')],
  INV: [t('AB', '11--'), t('AC', '1-1-')],
}

export const bits = (n) => [3, 2, 1, 0].map((i) => (n >> i) & 1)
export const bitString = (n) => bits(n).join('')

export const matches = (cube, n) =>
  bits(n).every((b, i) => cube[i] === '-' || Number(cube[i]) === b)

export const isInvalid = (n) => EXPRESSIONS.INV.some((term) => matches(term.cube, n))

// Raw output of the K-map expressions (no override).
export const rawSegment = (seg, n) => EXPRESSIONS[seg].some((term) => matches(term.cube, n))

// Final output, after the "E" override.
export const finalSegment = (seg, n) => {
  if (!isInvalid(n)) return rawSegment(seg, n)
  return E_PATTERN.includes(seg)
}

export const litSet = (n, { override = true } = {}) =>
  SEGMENTS.filter((s) => (override ? finalSegment(s, n) : rawSegment(s, n)))

export const shownSymbol = (n) => (n <= 9 ? String(n) : 'E')

// K-map value for a cell: 1, 0 or 'X' (don't care).
export const kmapValue = (seg, n) => {
  if (seg === 'INV') return isInvalid(n) ? 1 : 0
  if (n > 9) return 'X'
  return DIGITS[n].includes(seg) ? 1 : 0
}

export const GRAY = [0, 1, 3, 2] // 00 01 11 10
export const cellIndex = (row, col) => GRAY[row] * 4 + GRAY[col]

export const termToHuman = (cube) => {
  const parts = cube
    .split('')
    .map((ch, i) => (ch === '-' ? null : `${'ABCD'[i]}=${ch}`))
    .filter(Boolean)
  return parts.join(', ')
}

export const coveredCells = (cube) =>
  Array.from({ length: 16 }, (_, n) => n).filter((n) => matches(cube, n))

// Efficiency comparison: every segment built on its own (textbook count).
// Computed by exact minimisation (see README), canonical = one AND per minterm.
export const EFFICIENCY = [
  { method: 'Canonical SOP (minterms)', gates: 60, inputs: 245, literals: 196 },
  { method: "K-map, no don't-cares", gates: 37, inputs: 99, literals: 73 },
  { method: "K-map with don't-cares", gates: 26, inputs: 58, literals: 42 },
]

export const GATE_COUNT = [
  { part: 'Decoder (0–9)', not: 3, and: 9, or: 7 },
  { part: 'INVALID detector', not: 0, and: 2, or: 1 },
  { part: '"E" override', not: 1, and: 2, or: 5 },
]

