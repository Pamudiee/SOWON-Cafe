import { useEffect, useRef, useState } from 'react'
import { cafe } from '../data/cafe'

export function Image({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`image-wrap ${className}${failed ? ' image-fallback' : ''}`}>
      {failed ? <span className="image-fallback-label" role="img" aria-label={alt}>{alt}</span> : <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />}
    </div>
  )
}

export function Heading({ eyebrow, title, children, link, href }) {
  return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children && <p>{children}</p>}</div>{link && <a className="text-link" href={href}>{link} <span aria-hidden="true">↗</span></a>}</div>
}

export function PageIntro({ eyebrow, title, children }) {
  return <header className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{children}</p></header>
}

export function Filters({ values, value, onChange, label }) {
  return <div className="filters" role="group" aria-label={label}>{values.map(item => <button type="button" key={item} className={value === item ? 'selected' : ''} aria-pressed={value === item} onClick={() => onChange(item)}><span className="filter-check" aria-hidden="true">{value === item ? '✓' : ''}</span>{item}</button>)}</div>
}

export function Modal({ title, children, onClose, className = '' }) {
  const ref = useRef(null)
  const headingRef = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const dialog = ref.current
    dialog.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    // Each preview step begins at its heading, including for keyboard users.
    ref.current.scrollTop = 0
    headingRef.current.focus({ preventScroll: true })
  }, [title])

  return (
    <dialog ref={ref} className={`modal ${className}`} aria-labelledby="modal-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="modal-inner">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        <p className="eyebrow">A LITTLE SOMETHING FOR YOU</p>
        <h2 ref={headingRef} tabIndex={-1} id="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}

export function VisitCTA() {
  return <section className="visit-cta"><span className="line-flower" aria-hidden="true">✳</span><p className="eyebrow">THERE’S A PLACE FOR YOU HERE</p><h2>Make a little time<br />for yourself.</h2><p>A good cup. A new hobby. A moment that’s yours in {cafe.location}.</p><a href="#contact" className="button">Come say hello <span aria-hidden="true">↗</span></a></section>
}
