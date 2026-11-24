import { useEffect, useState } from 'react'
import SevenSeg from './components/SevenSeg'
import KMapGrid from './components/KMapGrid'
import Reveal from './components/Reveal'
import {
  SEGMENTS, DIGITS, E_PATTERN, EXPRESSIONS, EFFICIENCY,
  bits, bitString, isInvalid, kmapValue, litSet, rawSegment, finalSegment, matches, coveredCells,
} from './logic'
import { LED, ACC, INK, MUTED, XCOL, DIM, tc } from './theme'
import { SCREENSHOTS } from './screenshots'

const BASE = import.meta.env.BASE_URL
const SITE = 'https://two-bit-dev.github.io/bcd-7seg-decoder/'
const REPO = 'https://github.com/Two-Bit-dev/bcd-7seg-decoder'
const lit = (n, override = true) => litSet(n, { override }).join('')

function Slide({ id, idx, label, children, className = '' }) {
  return (
    <section id={id} data-sec={idx} aria-label={label} className={`slide ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  )
}
const Kicker = ({ children }) => <div className="kicker">{children}</div>

/* 00 ─ Title */
const HERO = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12]
export function Title() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO.length), 1100)
    return () => clearInterval(t)
  }, [])
  const n = HERO[i]
  return (
    <Slide id="s0" idx={0} label="Title">
      <div className="title-grid">
        <Reveal className="title-text">
          <div className="eyebrow">IS-237 · Organización Computacional · UNADECA</div>
          <h1>BCD to 7&#8209;segment decoder</h1>
          <p className="lede">Four input bits, seven segments, and nothing but logic gates in between.</p>
          <div className="meta">
            <span>Joseph Cordova &amp; Nelson</span>
            <span>Scroll ↓</span>
          </div>
        </Reveal>
        <Reveal delay={150} className="hero-card">
          <SevenSeg lit={lit(n)} width={180} />
          <div className="hero-bits">
            {bits(n).map((b, k) => (
              <div key={k}>
                <span className="mono-xs">{'ABCD'[k]}</span>
                <span className={`bitbox ${b ? 'on' : ''}`}>{b}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Slide>
  )
}

/* 01 ─ Problem */
export function Problem() {
  return (
    <Slide id="s1" idx={1} label="Problem">
      <div className="stack-56">
        <Reveal className="intro" style={{ maxWidth: 760 }}>
          <Kicker>01 — PROBLEM &amp; GOAL</Kicker>
          <h2 className="h2-lg">Turn a 4-bit number into a digit you can read.</h2>
          <p className="body-lg">
            A combinational circuit takes BCD input <b>A B C D</b> (A is the MSB) and drives segments <b>a–g</b> to
            show 0–9. Inputs 10–15 aren't valid BCD, so the display shows <b className="acc">E</b>.
          </p>
        </Reveal>
        <Reveal delay={120} className="flow">
          <div className="flow-bits">
            {[['A', 'MSB · 8'], ['B', '4'], ['C', '2'], ['D', 'LSB · 1']].map(([name, w]) => (
              <div key={name}>
                <span className="bitbox outline">{name}</span>
                <span className="mono-sm muted">{w}</span>
              </div>
            ))}
          </div>
          <div className="flow-line" />
          <div className="flow-box">
            <span className="flow-title">Decoder</span>
            <span className="mono-sm muted">NOT · AND · OR only<br />no decoder IC<br />no Hex Digit Display</span>
          </div>
          <div className="flow-line" />
          <SevenSeg lit="abcdefg" labels glow={false} width={150} />
        </Reveal>
      </div>
    </Slide>
  )
}

/* 02 ─ Truth table */
export function TruthTable({ n, setN, go }) {
  return (
    <Slide id="s2" idx={2} label="Truth table">
      <div className="split">
        <Reveal className="intro split-side">
          <Kicker>02 — TRUTH TABLE</Kicker>
          <h2>4 inputs, 7 outputs, 16 rows.</h2>
          <p className="body">
            Rows 10–15 never happen in valid BCD. We mark them <b style={{ color: XCOL }}>X</b>, don't care, so the
            K-maps can use them to make bigger groups.
          </p>
          <p className="mono-sm muted">Click a row to select it.</p>
          <button className="ghost" onClick={() => go(7)}>
            Send {bitString(n)} to the live demo ↓
          </button>
        </Reveal>
        <Reveal delay={120} className="split-main tt-scroll">
          <div className="tt" role="table" aria-label="Truth table">
            <div className="tt-row tt-head" role="row">
              <span>#</span><span>A</span><span>B</span><span>C</span><span>D</span><span />
              {SEGMENTS.map((s) => <span key={s}>{s}</span>)}
              <span className="right">shows</span>
            </div>
            {Array.from({ length: 16 }, (_, i) => {
              const valid = i < 10
              return (
                <div
                  key={i}
                  role="row"
                  tabIndex={0}
                  aria-selected={i === n}
                  className={`tt-row ${i === n ? 'sel' : ''} ${i === 10 ? 'divider' : ''}`}
                  style={{ color: valid ? INK : MUTED }}
                  onClick={() => setN(i)}
                  onKeyDown={(e) => e.key === 'Enter' && setN(i)}
                >
                  <span className="muted">{i}</span>
                  {bits(i).map((b, k) => <span key={k}>{b}</span>)}
                  <span />
                  {SEGMENTS.map((s) => {
                    const v = String(kmapValue(s, i))
                    return (
                      <span key={s} style={{ color: v === '1' ? INK : v === 'X' ? XCOL : DIM, fontWeight: v === '1' ? 700 : 400 }}>
                        {v}
                      </span>
                    )
                  })}
                  <span className="right">
                    <SevenSeg lit={valid ? DIGITS[i] : E_PATTERN} color={valid ? LED : XCOL} glow={false} width={14} />
                  </span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </Slide>
  )
}

/* 03 ─ K-maps */
export function KMaps() {
  const [seg, setSeg] = useState('a')
  const [term, setTerm] = useState(null)
  const terms = EXPRESSIONS[seg]
  const note =
    term == null
      ? "Dots show which terms cover each cell. X = don't care (10–15), treated as 1 when it helps."
      : (() => {
          const cells = coveredCells(terms[term].cube)
          return `${terms[term].label} covers ${cells.length} cells: ${cells.join(', ')}`
        })()
  return (
    <Slide id="s3" idx={3} label="K-maps">
      <div className="stack-48">
        <Reveal className="head-row">
          <div className="intro" style={{ maxWidth: 640 }}>
            <Kicker>03 — KARNAUGH MAPS</Kicker>
            <h2>One map per segment.</h2>
            <p className="body">
              Rows and columns follow Gray code, so neighbours differ by one bit. Each colored group becomes one term.
              Click a term to isolate it.
            </p>
          </div>
          <div className="seg-tabs" role="tablist">
            {[...SEGMENTS, 'INV'].map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={seg === s}
                className={`seg-tab ${seg === s ? 'on' : ''} ${s === 'INV' ? 'wide' : ''}`}
                onClick={() => { setSeg(s); setTerm(null) }}
              >
                {s}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="kmap-row">
          <div className="kmap-seg">
            <SevenSeg lit={seg === 'INV' ? E_PATTERN : seg} color={seg === 'INV' ? XCOL : LED} labels width={120} />
          </div>
          <KMapGrid seg={seg} tint={term == null ? [] : [term]} dimOthers />
          <div className="kmap-side">
            <div className="kmap-eq"><span className="acc">{seg === 'INV' ? 'INVALID' : seg}</span> =</div>
            <div className="term-btns">
              {terms.map((t, i) => (
                <button
                  key={t.label}
                  className="term-btn"
                  aria-pressed={term === i}
                  onClick={() => setTerm(term === i ? null : i)}
                  style={{
                    background: term === i ? tc(i, 0.22) : 'transparent',
                    borderColor: term === i ? tc(i) : 'rgba(236,232,225,0.16)',
                    opacity: term == null || term === i ? 1 : 0.45,
                  }}
                >
                  <span className="dot" style={{ background: tc(i) }} />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mono-sm muted">{note}</div>
          </div>
        </Reveal>
      </div>
    </Slide>
  )
}

/* 04 ─ Expressions */
export function Expressions() {
  const list = [
    ...SEGMENTS.map((s) => ({ name: s, expr: EXPRESSIONS[s].map((t) => t.label).join(' + '), on: s, color: LED })),
    { name: 'INVALID', expr: 'AB + AC', on: E_PATTERN, color: XCOL },
  ]
  return (
    <Slide id="s4" idx={4} label="Expressions">
      <div className="stack-48">
        <Reveal className="intro" style={{ maxWidth: 720 }}>
          <Kicker>04 — SIMPLIFIED EXPRESSIONS</Kicker>
          <h2>Seven equations and one alarm.</h2>
        </Reveal>
        <div className="expr-grid">
          {list.map((ex, i) => (
            <Reveal key={ex.name} delay={i * 70} className="expr-item">
              <SevenSeg lit={ex.on} color={ex.color} glow={false} width={30} />
              <div className="expr-text">
                <span style={{ color: ex.color, fontWeight: 700 }}>{ex.name}</span> = {ex.expr}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Slide>
  )
}

/* 05 ─ Circuit */
function Shot({ file, placeholder }) {
  return (
    <div className="shot">
      {file ? <img src={`${BASE}img/screenshots/${file}`} alt={placeholder} /> : <span>{placeholder}</span>}
    </div>
  )
}
export function Circuit() {
  return (
    <Slide id="s5" idx={5} label="Circuit">
      <div className="stack-40">
        <Reveal className="head-row">
          <div className="intro" style={{ maxWidth: 620 }}>
            <Kicker>05 — CIRCUIT</Kicker>
            <h2>Built gate by gate in Logisim-evolution.</h2>
          </div>
          <div className="stats">
            <div><b>19</b><span>decoder<br />3 NOT · 9 AND · 7 OR</span></div>
            <div><b>+3</b><span>INVALID<br />detector</span></div>
            <div><b>+8</b><span>"E"<br />override</span></div>
            <div><b className="acc">30</b><span>gates<br />total</span></div>
          </div>
        </Reveal>
        <div className="shots">
          <Reveal delay={100} className="shot-wrap">
            <Shot file={SCREENSHOTS.decoder} placeholder="Logisim screenshot: 0–9 decoder (3 NOT, 9 AND, 7 OR)" />
            <span className="mono-sm muted">Decoder: AND terms shared across segments</span>
          </Reveal>
          <Reveal delay={200} className="shot-wrap">
            <Shot file={SCREENSHOTS.invalid} placeholder="Logisim screenshot: INVALID detector + E override" />
            <span className="mono-sm muted">INVALID = AB + AC · a,d,e,f,g = seg + INVALID · b,c = seg · INVALID'</span>
          </Reveal>
        </div>
        <a className="mono-sm" href={`${BASE}img/circuit-overview.svg`} target="_blank" rel="noreferrer">
          Open the block diagram ↗
        </a>
      </div>
    </Slide>
  )
}

/* 06 ─ Efficiency */
const METRICS = [['gates', 'Gates'], ['inputs', 'Gate inputs'], ['literals', 'Literals']]
const EFF_NAMES = [['Canonical SOP', 'minterms'], ['K-map', "no don't-cares"], ['K-map', "with don't-cares"]]
export function Efficiency() {
  const [metric, setMetric] = useState('gates')
  const max = EFFICIENCY[0][metric]
  const best = EFFICIENCY[2][metric]
  const label = METRICS.find((m) => m[0] === metric)[1].toLowerCase()
  return (
    <Slide id="s6" idx={6} label="Efficiency">
      <div className="stack-48">
        <Reveal className="head-row">
          <div className="intro">
            <Kicker>06 — EFFICIENCY</Kicker>
            <h2 className="h2-xl">{max} → {best}</h2>
            <p className="body-lg">{Math.round((1 - best / max) * 100)}% fewer {label} with don't-cares</p>
          </div>
          <div className="seg-ctl" role="tablist">
            {METRICS.map(([key, l]) => (
              <button key={key} role="tab" aria-selected={metric === key} className={metric === key ? 'on' : ''} onClick={() => setMetric(key)}>
                {l}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="bars">
          {EFFICIENCY.map((r, i) => (
            <Reveal key={i} delay={i * 120} className="bar-item">
              <div className="bar-top">
                <span className="bar-name">
                  {EFF_NAMES[i][0]} <span className="mono-sm muted">{EFF_NAMES[i][1]}</span>
                </span>
                <span className="bar-num" style={{ color: i === 2 ? ACC : INK }}>{r[metric]}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(r[metric] / max) * 100}%`, background: i === 2 ? LED : 'rgba(236,232,225,0.22)' }} />
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal as="p" className="mono-md muted" style={{ maxWidth: 780 }}>
          Counts treat each segment as its own circuit. Sharing AND terms between segments brings the real decoder to 19
          gates.
        </Reveal>
      </div>
    </Slide>
  )
}

/* 07 ─ Live demo */
export function Demo({ n, setN, override, setOverride }) {
  const [dSeg, setDSeg] = useState('a')
  const inv = isInvalid(n)
  const firing = EXPRESSIONS[dSeg].map((t, i) => (matches(t.cube, n) ? i : -1)).filter((i) => i >= 0)
  const caption = n < 10 ? `shows ${n}` : override ? 'invalid BCD → E' : "invalid BCD, no override: don't-care leftovers"
  return (
    <Slide id="s7" idx={7} label="Live demo" className="alt">
      <div className="stack-44">
        <Reveal className="head-row">
          <div className="intro">
            <Kicker>07 — LIVE DEMO</Kicker>
            <h2>Flip the bits.</h2>
          </div>
          <span className="mono-sm muted">Keys A B C D toggle inputs · E toggles override · 0–9 set a digit</span>
        </Reveal>
        <Reveal delay={100} className="demo-row">
          <div className="demo-ctl">
            <div className="toggles">
              {bits(n).map((b, k) => (
                <button
                  key={k}
                  className={`toggle ${b ? 'on' : ''}`}
                  aria-pressed={!!b}
                  aria-label={`Input ${'ABCD'[k]}`}
                  onClick={() => setN(n ^ (1 << (3 - k)))}
                >
                  <span className="mono-sm">{'ABCD'[k]}</span>
                  <span className="toggle-v">{b}</span>
                </button>
              ))}
            </div>
            <div className="readout">
              <span className="mono-sm muted">input</span>
              <span className="readout-n">{bitString(n)} <span className="muted">= {n}</span></span>
              <span style={{ color: inv ? XCOL : MUTED }}>INVALID = {inv ? 1 : 0}</span>
            </div>
            <button className="switch" aria-pressed={override} onClick={() => setOverride(!override)}>
              <span className={`switch-track ${override ? 'on' : ''}`}><span /></span>
              "E" override
            </button>
          </div>
          <div className="demo-disp">
            <div className="disp-box">
              <SevenSeg lit={lit(n, override)} width={170} />
            </div>
            <span className="caption">{caption}</span>
          </div>
          <div className="demo-segs">
            {SEGMENTS.map((s) => {
              const raw = rawSegment(s, n)
              const out = override ? finalSegment(s, n) : raw
              const forced = override && inv && raw !== out
              return (
                <button key={s} className={`seg-line ${dSeg === s ? 'sel' : ''}`} onClick={() => setDSeg(s)}>
                  <span className="seg-name" style={{ color: out ? ACC : MUTED }}>{s}</span>
                  <span className="chips">
                    {EXPRESSIONS[s].map((t, i) => {
                      const on = matches(t.cube, n)
                      return (
                        <span
                          key={t.label}
                          className="chip"
                          style={{
                            background: on ? tc(i) : 'transparent',
                            color: on ? '#14110d' : MUTED,
                            borderColor: on ? tc(i) : 'rgba(236,232,225,0.14)',
                          }}
                        >
                          {t.label}
                        </span>
                      )
                    })}
                  </span>
                  <span className="forced">{forced ? (out ? 'forced on' : 'forced off') : ''}</span>
                  <span className="state" style={{ color: out ? ACC : MUTED }}>{out ? 'ON' : 'off'}</span>
                </button>
              )
            })}
          </div>
        </Reveal>
        <Reveal delay={150} className="demo-k">
          <KMapGrid seg={dSeg} tint={firing} cur={n} dots={false} small />
          <p className="body-sm muted">
            K-map for segment <b className="acc">{dSeg}</b>. The outlined cell is the current input; tinted cells are the
            groups that light it. Click a row above to switch segments.
          </p>
        </Reveal>
      </div>
    </Slide>
  )
}

/* 08 ─ Examples */
const EXAMPLES = [
  { n: 5, title: 'five', note: "B and D are high. BD lights a, B lights c, BC'D lights d, BC' lights f and g. No term of b or e is true." },
  { n: 9, title: 'nine', note: "A alone lights a, d, f and g. The don't-cares let A cover the whole bottom half of those maps." },
  { n: 12, title: 'the trap', note: "Left alone, the don't-cares make 1100 look like a 9. INVALID = AB fires, forces b and c off, a d e f g on: E." },
]
export function Examples({ load }) {
  return (
    <Slide id="s8" idx={8} label="Examples">
      <div className="stack-48">
        <Reveal className="intro" style={{ maxWidth: 720 }}>
          <Kicker>08 — WORKED EXAMPLES</Kicker>
          <h2>Three inputs, traced.</h2>
        </Reveal>
        <div className="examples">
          {EXAMPLES.map((ex, k) => {
            const displays =
              ex.n < 10
                ? [{ on: lit(ex.n), cap: `shows ${ex.n}`, color: LED }]
                : [{ on: lit(ex.n, false), cap: 'no override', color: XCOL }, { on: lit(ex.n), cap: 'with override', color: LED }]
            return (
              <Reveal key={ex.n} delay={k * 120} className={`example ${ex.n > 9 ? 'trap' : ''}`}>
                <div className="ex-head">
                  <span className="ex-bin">{bitString(ex.n)}</span>
                  <span className="mono-sm muted">{ex.title}</span>
                </div>
                <div className="ex-disps">
                  {displays.map((d) => (
                    <div key={d.cap}>
                      <SevenSeg lit={d.on} color={d.color} width={64} />
                      <span className="mono-xs muted">{d.cap}</span>
                    </div>
                  ))}
                </div>
                <div className="trace">
                  {SEGMENTS.map((s) => {
                    const f = EXPRESSIONS[s].filter((t) => matches(t.cube, ex.n)).map((t) => t.label)
                    return (
                      <span key={s} style={{ color: f.length ? INK : DIM }}>
                        {f.length ? `${s} ← ${f.join(', ')}` : `${s}   off`}
                      </span>
                    )
                  })}
                </div>
                <p className="body-sm">{ex.note}</p>
                <button className="ghost" onClick={() => load(ex.n)}>Load in demo ↑</button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}

/* 09 ─ Try it */
export function TryIt() {
  return (
    <Slide id="s9" idx={9} label="Try it">
      <div className="title-grid">
        <Reveal className="intro" style={{ flex: '1 1 480px' }}>
          <Kicker>09 — TRY IT</Kicker>
          <h2 className="h2-xl">Questions?</h2>
          <p className="body-lg" style={{ maxWidth: '32ch' }}>Scan to run the demo on your phone.</p>
          <div className="links">
            <a href={SITE}>two-bit-dev.github.io/bcd-7seg-decoder</a>
            <a href={REPO}>github.com/Two-Bit-dev/bcd-7seg-decoder</a>
            <span className="muted">Joseph Cordova &amp; Nelson</span>
          </div>
        </Reveal>
        <Reveal delay={150} className="qr-box">
          <img src={`${BASE}img/qr.svg`} alt="QR code to the live site" />
        </Reveal>
      </div>
    </Slide>
  )
}
