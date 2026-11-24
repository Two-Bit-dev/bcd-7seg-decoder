// Colors from the Claude Design file ("BCD Decoder Presentation").
export const LED = 'oklch(0.72 0.2 35)'
export const ACC = 'oklch(0.78 0.16 40)'
export const INK = '#ece8e1'
export const MUTED = '#8f8a82'
export const XCOL = 'oklch(0.8 0.1 250)'
export const DIM = '#6f6a63'

const HUES = [35, 200, 140, 300, 85]
// Color of term i (optionally with alpha).
export const tc = (i, a) => `oklch(0.78 0.14 ${HUES[i % HUES.length]}${a != null ? ` / ${a}` : ''})`
