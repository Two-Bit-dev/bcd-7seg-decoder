import { LED } from '../theme'

// 7-segment display. Geometry follows the design's SevenSeg (100 × 160 box).
const BOX = {
  a: [12, 4, 76, 14, 'h'],
  b: [82, 14, 14, 64, 'v'],
  c: [82, 82, 14, 64, 'v'],
  d: [12, 142, 76, 14, 'h'],
  e: [4, 82, 14, 64, 'v'],
  f: [4, 14, 14, 64, 'v'],
  g: [12, 73, 76, 14, 'h'],
}
const H = [[9, 0], [91, 0], [100, 50], [91, 100], [9, 100], [0, 50]]
const V = [[50, 0], [100, 11], [100, 89], [50, 100], [0, 89], [0, 11]]

const points = ([x, y, w, h, kind]) =>
  (kind === 'h' ? H : V).map(([px, py]) => `${x + (w * px) / 100},${y + (h * py) / 100}`).join(' ')

export default function SevenSeg({ lit = '', color = LED, glow = true, labels = false, width = 100, off = 'rgba(236,232,225,0.06)' }) {
  return (
    <svg
      viewBox="0 0 100 160"
      width={width}
      height={width * 1.6}
      role="img"
      aria-label={`Segments on: ${[...lit].join(', ') || 'none'}`}
      className="sevenseg"
    >
      {Object.entries(BOX).map(([s, box]) => {
        const on = lit.includes(s)
        return (
          <g key={s}>
            <polygon
              points={points(box)}
              style={{
                fill: on ? color : off,
                filter: on && glow ? `drop-shadow(0 0 4px ${color})` : 'none',
              }}
            />
            {labels && (
              <text
                x={box[0] + box[2] / 2}
                y={box[1] + box[3] / 2 + 3}
                textAnchor="middle"
                className="seg-label"
                style={{ fill: on ? '#1a0f0a' : 'rgba(236,232,225,0.5)' }}
              >
                {s}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
