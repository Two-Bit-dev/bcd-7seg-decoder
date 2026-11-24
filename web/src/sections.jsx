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

/* 00 ─ Inicio */
const HERO = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 12]
export function Title() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO.length), 1100)
    return () => clearInterval(t)
  }, [])
  const n = HERO[i]
  return (
    <Slide id="s0" idx={0} label="Inicio">
      <div className="title-grid">
        <Reveal className="title-text">
          <div className="eyebrow">IS-237 · Organización Computacional · UNADECA</div>
          <h1>Decodificador BCD a 7&nbsp;segmentos</h1>
          <p className="lede">Cuatro bits de entrada, siete segmentos y solo compuertas lógicas en medio.</p>
          <div className="meta">
            <span>Joseph Cordova y Nelson</span>
            <span>Desliza ↓</span>
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

/* 01 ─ Problema */
export function Problem() {
  return (
    <Slide id="s1" idx={1} label="Problema">
      <div className="stack-56">
        <Reveal className="intro" style={{ maxWidth: 760 }}>
          <Kicker>01 — PROBLEMA Y OBJETIVO</Kicker>
          <h2 className="h2-lg">Convertir un número de 4 bits en un dígito legible.</h2>
          <p className="body-lg">
            Un circuito combinacional recibe la entrada BCD <b>A B C D</b> (A es el MSB) y controla los segmentos{' '}
            <b>a–g</b> para mostrar del 0 al 9. Las entradas 10–15 no son BCD válido, así que el display muestra{' '}
            <b className="acc">E</b>.
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
            <span className="flow-title">Decodificador</span>
            <span className="mono-sm muted">solo NOT · AND · OR<br />sin CI decodificador<br />sin Hex Digit Display</span>
          </div>
          <div className="flow-line" />
          <SevenSeg lit="abcdefg" labels glow={false} width={150} />
        </Reveal>
      </div>
    </Slide>
  )
}

/* 02 ─ Tabla de verdad */
export function TruthTable({ n, setN, go }) {
  return (
    <Slide id="s2" idx={2} label="Tabla de verdad">
      <div className="split">
        <Reveal className="intro split-side">
          <Kicker>02 — TABLA DE VERDAD</Kicker>
          <h2>4 entradas, 7 salidas, 16 filas.</h2>
          <p className="body">
            Las filas 10–15 nunca ocurren en BCD válido. Las marcamos con <b style={{ color: XCOL }}>X</b> («no
            importa») para que los mapas K formen grupos más grandes.
          </p>
          <p className="mono-sm muted">Haz clic en una fila para seleccionarla.</p>
          <button className="ghost" onClick={() => go(7)}>
            Enviar {bitString(n)} a la demo en vivo ↓
          </button>
        </Reveal>
        <Reveal delay={120} className="split-main tt-scroll">
          <div className="tt" role="table" aria-label="Tabla de verdad">
            <div className="tt-row tt-head" role="row">
              <span>#</span><span>A</span><span>B</span><span>C</span><span>D</span><span />
              {SEGMENTS.map((s) => <span key={s}>{s}</span>)}
              <span className="right">muestra</span>
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

/* 03 ─ Mapas K */
export function KMaps() {
  const [seg, setSeg] = useState('a')
  const [term, setTerm] = useState(null)
  const terms = EXPRESSIONS[seg]
  const note =
    term == null
      ? 'Los puntos indican qué términos cubren cada celda. X = no importa (10–15); se toma como 1 cuando ayuda.'
      : (() => {
          const cells = coveredCells(terms[term].cube)
          return `${terms[term].label} cubre ${cells.length} celdas: ${cells.join(', ')}`
        })()
  return (
    <Slide id="s3" idx={3} label="Mapas K">
      <div className="stack-48">
        <Reveal className="head-row">
          <div className="intro" style={{ maxWidth: 640 }}>
            <Kicker>03 — MAPAS DE KARNAUGH</Kicker>
            <h2>Un mapa por segmento.</h2>
            <p className="body">
              Filas y columnas siguen el código Gray, así que las celdas vecinas difieren en un solo bit. Cada grupo de
              color se convierte en un término. Haz clic en un término para aislarlo.
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

/* 04 ─ Expresiones */
export function Expressions() {
  const list = [
    ...SEGMENTS.map((s) => ({ name: s, expr: EXPRESSIONS[s].map((t) => t.label).join(' + '), on: s, color: LED })),
    { name: 'INVALID', expr: 'AB + AC', on: E_PATTERN, color: XCOL },
  ]
  return (
    <Slide id="s4" idx={4} label="Expresiones">
      <div className="stack-48">
        <Reveal className="intro" style={{ maxWidth: 720 }}>
          <Kicker>04 — EXPRESIONES SIMPLIFICADAS</Kicker>
          <h2>Siete ecuaciones y una alarma.</h2>
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

/* 05 ─ Circuito */
function Shot({ file, placeholder }) {
  return (
    <div className="shot">
      {file ? <img src={`${BASE}img/screenshots/${file}`} alt={placeholder} /> : <span>{placeholder}</span>}
    </div>
  )
}
export function Circuit() {
  return (
    <Slide id="s5" idx={5} label="Circuito">
      <div className="stack-40">
        <Reveal className="head-row">
          <div className="intro" style={{ maxWidth: 620 }}>
            <Kicker>05 — CIRCUITO</Kicker>
            <h2>Construido compuerta por compuerta en Logisim-evolution.</h2>
          </div>
          <div className="stats">
            <div><b>19</b><span>decodificador<br />3 NOT · 9 AND · 7 OR</span></div>
            <div><b>+3</b><span>detector<br />INVALID</span></div>
            <div><b>+8</b><span>forzado<br />de «E»</span></div>
            <div><b className="acc">30</b><span>compuertas<br />en total</span></div>
          </div>
        </Reveal>
        <div className="shots">
          <Reveal delay={100} className="shot-wrap">
            <Shot file={SCREENSHOTS.decoder} placeholder="Captura de Logisim: decodificador 0–9 (3 NOT, 9 AND, 7 OR)" />
            <span className="mono-sm muted">Decodificador: términos AND compartidos entre segmentos</span>
          </Reveal>
          <Reveal delay={200} className="shot-wrap">
            <Shot file={SCREENSHOTS.invalid} placeholder="Captura de Logisim: detector INVALID + forzado de E" />
            <span className="mono-sm muted">INVALID = AB + AC · a,d,e,f,g = seg + INVALID · b,c = seg · INVALID'</span>
          </Reveal>
        </div>
        <a className="mono-sm" href={`${BASE}img/circuit-overview.svg`} target="_blank" rel="noreferrer">
          Abrir el diagrama de bloques ↗
        </a>
      </div>
    </Slide>
  )
}

/* 06 ─ Eficiencia */
const METRICS = [['gates', 'Compuertas'], ['inputs', 'Entradas de compuertas'], ['literals', 'Literales']]
const EFF_NAMES = [['SOP canónica', 'mintérminos'], ['Mapa K', 'sin «no importa»'], ['Mapa K', 'con «no importa»']]
export function Efficiency() {
  const [metric, setMetric] = useState('gates')
  const max = EFFICIENCY[0][metric]
  const best = EFFICIENCY[2][metric]
  const label = METRICS.find((m) => m[0] === metric)[1].toLowerCase()
  return (
    <Slide id="s6" idx={6} label="Eficiencia">
      <div className="stack-48">
        <Reveal className="head-row">
          <div className="intro">
            <Kicker>06 — EFICIENCIA</Kicker>
            <h2 className="h2-xl">{max} → {best}</h2>
            <p className="body-lg">{Math.round((1 - best / max) * 100)}% menos {label} usando «no importa»</p>
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
          Los conteos tratan cada segmento como un circuito independiente. Al compartir los términos AND entre
          segmentos, el decodificador real queda en 19 compuertas.
        </Reveal>
      </div>
    </Slide>
  )
}

/* 07 ─ Demo en vivo */
export function Demo({ n, setN, override, setOverride }) {
  const [dSeg, setDSeg] = useState('a')
  const inv = isInvalid(n)
  const firing = EXPRESSIONS[dSeg].map((t, i) => (matches(t.cube, n) ? i : -1)).filter((i) => i >= 0)
  const caption = n < 10 ? `muestra ${n}` : override ? 'BCD inválido → E' : 'BCD inválido, sin forzado: restos de los «no importa»'
  return (
    <Slide id="s7" idx={7} label="Demo en vivo" className="alt">
      <div className="stack-44">
        <Reveal className="head-row">
          <div className="intro">
            <Kicker>07 — DEMO EN VIVO</Kicker>
            <h2>Cambia los bits.</h2>
          </div>
          <span className="mono-sm muted">Teclas A B C D cambian las entradas · E activa el forzado · 0–9 eligen un dígito</span>
        </Reveal>
        <Reveal delay={100} className="demo-row">
          <div className="demo-ctl">
            <div className="toggles">
              {bits(n).map((b, k) => (
                <button
                  key={k}
                  className={`toggle ${b ? 'on' : ''}`}
                  aria-pressed={!!b}
                  aria-label={`Entrada ${'ABCD'[k]}`}
                  onClick={() => setN(n ^ (1 << (3 - k)))}
                >
                  <span className="mono-sm">{'ABCD'[k]}</span>
                  <span className="toggle-v">{b}</span>
                </button>
              ))}
            </div>
            <div className="readout">
              <span className="mono-sm muted">entrada</span>
              <span className="readout-n">{bitString(n)} <span className="muted">= {n}</span></span>
              <span style={{ color: inv ? XCOL : MUTED }}>INVALID = {inv ? 1 : 0}</span>
            </div>
            <button className="switch" aria-pressed={override} onClick={() => setOverride(!override)}>
              <span className={`switch-track ${override ? 'on' : ''}`}><span /></span>
              Forzar «E»
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
                  <span className="forced">{forced ? (out ? 'forzado a 1' : 'forzado a 0') : ''}</span>
                  <span className="state" style={{ color: out ? ACC : MUTED }}>{out ? 'ENC' : 'apag'}</span>
                </button>
              )
            })}
          </div>
        </Reveal>
        <Reveal delay={150} className="demo-k">
          <KMapGrid seg={dSeg} tint={firing} cur={n} dots={false} small />
          <p className="body-sm muted">
            Mapa K del segmento <b className="acc">{dSeg}</b>. La celda con borde es la entrada actual; las celdas
            teñidas son los grupos que la encienden. Haz clic en una fila de arriba para cambiar de segmento.
          </p>
        </Reveal>
      </div>
    </Slide>
  )
}

/* 08 ─ Ejemplos */
const EXAMPLES = [
  { n: 5, title: 'cinco', note: "B y D están en 1. BD enciende a, B enciende c, BC'D enciende d y BC' enciende f y g. Ningún término de b ni de e es verdadero." },
  { n: 9, title: 'nueve', note: 'Solo A enciende a, d, f y g. Los «no importa» permiten que A cubra toda la mitad inferior de esos mapas.' },
  { n: 12, title: 'la trampa', note: 'Sin corrección, los «no importa» hacen que 1100 parezca un 9. INVALID = AB se activa: apaga b y c, enciende a d e f g y se ve una E.' },
]
export function Examples({ load }) {
  return (
    <Slide id="s8" idx={8} label="Ejemplos">
      <div className="stack-48">
        <Reveal className="intro" style={{ maxWidth: 720 }}>
          <Kicker>08 — EJEMPLOS RESUELTOS</Kicker>
          <h2>Tres entradas, paso a paso.</h2>
        </Reveal>
        <div className="examples">
          {EXAMPLES.map((ex, k) => {
            const displays =
              ex.n < 10
                ? [{ on: lit(ex.n), cap: `muestra ${ex.n}`, color: LED }]
                : [{ on: lit(ex.n, false), cap: 'sin forzado', color: XCOL }, { on: lit(ex.n), cap: 'con forzado', color: LED }]
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
                        {f.length ? `${s} ← ${f.join(', ')}` : `${s}   apagado`}
                      </span>
                    )
                  })}
                </div>
                <p className="body-sm">{ex.note}</p>
                <button className="ghost" onClick={() => load(ex.n)}>Cargar en la demo ↑</button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}

/* 09 ─ Pruébalo */
export function TryIt() {
  return (
    <Slide id="s9" idx={9} label="Pruébalo">
      <div className="title-grid">
        <Reveal className="intro" style={{ flex: '1 1 480px' }}>
          <Kicker>09 — PRUÉBALO</Kicker>
          <h2 className="h2-xl">¿Preguntas?</h2>
          <p className="body-lg" style={{ maxWidth: '32ch' }}>Escanea el código para usar la demo en tu teléfono.</p>
          <div className="links">
            <a href={SITE}>two-bit-dev.github.io/bcd-7seg-decoder</a>
            <a href={REPO}>github.com/Two-Bit-dev/bcd-7seg-decoder</a>
            <span className="muted">Joseph Cordova y Nelson</span>
          </div>
        </Reveal>
        <Reveal delay={150} className="qr-box">
          <img src={`${BASE}img/qr.svg`} alt="Código QR del sitio" />
        </Reveal>
      </div>
    </Slide>
  )
}
