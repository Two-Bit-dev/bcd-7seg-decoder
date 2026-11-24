import { useEffect, useRef, useState } from 'react'

// Fades and lifts its content in the first time it scrolls into view.
// Skipped entirely when the viewer prefers reduced motion (see CSS).
export default function Reveal({ delay = 0, className = '', style, children, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={{ ...style, '--d': `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
