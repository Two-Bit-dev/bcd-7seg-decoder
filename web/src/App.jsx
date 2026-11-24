import { useEffect, useRef, useState } from 'react'
import {
  Title, Problem, TruthTable, KMaps, Expressions, Circuit, Efficiency, Demo, Examples, TryIt,
} from './sections'

const SECTIONS = ['Inicio', 'Problema', 'Tabla de verdad', 'Mapas K', 'Expresiones', 'Circuito', 'Eficiencia', 'Demo en vivo', 'Ejemplos', 'Pruébalo']
const DEMO = 7

const go = (i) => document.getElementById(`s${i}`)?.scrollIntoView({ behavior: 'smooth' })

export default function App() {
  // One input shared by the truth table, the demo and the examples.
  const [n, setN] = useState(5)
  const [override, setOverride] = useState(true)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  useEffect(() => { activeRef.current = active }, [active])

  // Which section is in the middle of the screen; honour #s3-style links on load.
  useEffect(() => {
    const m = window.location.hash.match(/^#s(\d)$/)
    if (m) document.getElementById(`s${m[1]}`)?.scrollIntoView({ behavior: 'instant' })
    const so = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.sec))),
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )
    document.querySelectorAll('[data-sec]').forEach((el) => so.observe(el))
    return () => so.disconnect()
  }, [])

  // Keyboard: ↑/↓ sections · 0–9 set the input · ←/→ step · on the demo: A B C D flip bits, E override.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target.closest?.('input, textarea')) return
      const k = e.key
      const a = activeRef.current
      if (k === 'ArrowDown' || k === 'PageDown') { e.preventDefault(); go(Math.min(a + 1, SECTIONS.length - 1)) }
      else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); go(Math.max(a - 1, 0)) }
      else if (k === 'ArrowRight') setN((x) => (x + 1) % 16)
      else if (k === 'ArrowLeft') setN((x) => (x + 15) % 16)
      else if (/^[0-9]$/.test(k)) setN(Number(k))
      else if (a === DEMO) {
        const idx = 'abcd'.indexOf(k.toLowerCase())
        if (idx >= 0) setN((x) => x ^ (1 << (3 - idx)))
        else if (k.toLowerCase() === 'e') setOverride((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const load = (x) => { setN(x); setOverride(true); go(DEMO) }

  return (
    <>
      <nav className="rail" aria-label="Secciones">
        {SECTIONS.map((label, i) => (
          <button key={label} onClick={() => go(i)} aria-current={active === i ? 'true' : undefined} className={active === i ? 'on' : ''}>
            <span className="rail-label">{label}</span>
            <span className="rail-bar" />
          </button>
        ))}
      </nav>
      <main>
        <Title />
        <Problem />
        <TruthTable n={n} setN={setN} go={go} />
        <KMaps />
        <Expressions />
        <Circuit />
        <Efficiency />
        <Demo n={n} setN={setN} override={override} setOverride={setOverride} />
        <Examples load={load} />
        <TryIt />
      </main>
    </>
  )
}
