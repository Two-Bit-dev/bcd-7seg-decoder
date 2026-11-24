import { EXPRESSIONS, GRAY, kmapValue, matches } from '../logic'
import { LED, INK, XCOL, tc } from '../theme'

const CODES = ['00', '01', '11', '10']

/**
 * K-map as a grid of cells.
 * - tint: term indexes whose cells get tinted
 * - cur: current input (outlined)
 * - dots: show a dot per covering term (dimmed unless in `tint`, when dimOthers)
 */
export default function KMapGrid({ seg, tint = [], cur = null, dots = true, dimOthers = false, small = false }) {
  const terms = EXPRESSIONS[seg]
  return (
    <div className={`kgrid ${small ? 'small' : ''}`} role="table" aria-label={`Karnaugh map for ${seg}`}>
      <div className="krow head" role="row">
        <span className="klabel">{small ? '' : 'AB\\CD'}</span>
        {CODES.map((c) => <span key={c} className="kcol">{c}</span>)}
      </div>
      {GRAY.map((r, ri) => (
        <div className="krow" role="row" key={r}>
          <span className="klabel">{CODES[ri]}</span>
          {GRAY.map((c) => {
            const n = r * 4 + c
            const val = String(kmapValue(seg, n))
            const cover = terms.map((t, i) => (matches(t.cube, n) ? i : -1)).filter((i) => i >= 0)
            const hit = tint.find((i) => cover.includes(i))
            const isCur = cur === n
            return (
              <div
                key={n}
                role="cell"
                className={`kcell ${isCur ? 'cur' : ''}`}
                style={{
                  background: hit != null ? tc(hit, 0.24) : 'rgba(236,232,225,0.03)',
                  borderColor: isCur ? LED : undefined,
                }}
              >
                <span
                  className="kval"
                  style={{
                    color: val === '1' ? INK : val === 'X' ? XCOL : '#7a756d',
                    fontWeight: val === '1' ? 700 : 400,
                  }}
                >
                  {val}
                </span>
                {!small && <span className="kidx">{n}</span>}
                {dots && !small && (
                  <span className="kdots">
                    {cover.map((i) => (
                      <span
                        key={i}
                        style={{
                          background: !dimOthers || tint.length === 0 || tint.includes(i) ? tc(i) : 'rgba(236,232,225,0.12)',
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
