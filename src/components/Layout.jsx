import { useEffect, useRef, useState } from 'react'
import { cafe } from '../data/cafe'

const links = ['Home', 'Menu', 'Workshops', 'Gifts', 'About', 'Contact']

export function Logo() {
  return (
    <a href="#home" className="logo" aria-label="SOWON Café home">
      sowon<span className="logo-flower" aria-hidden="true">✳</span>
      <small>CAFÉ & CREATIVE SPACE</small>
    </a>
  )
}

export function Navbar({ page }) {
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const dismiss = event => {
      if (!headerRef.current?.contains(event.target)) setOpen(false)
    }
    const escape = event => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const close = () => setOpen(false)
    const desktop = window.matchMedia('(min-width: 961px)')
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    document.addEventListener('focusin', dismiss)
    window.addEventListener('hashchange', close)
    desktop.addEventListener('change', close)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
      document.removeEventListener('focusin', dismiss)
      window.removeEventListener('hashchange', close)
      desktop.removeEventListener('change', close)
    }
  }, [open])

  return (
    <header className="site-header" ref={headerRef} onClick={event => {
      const link = event.target.closest('a')
      if (!open || !link) return
      setOpen(false)
      if (link.getAttribute('href') === `#${page}`) toggleRef.current?.focus()
    }}>
      <div className="nav-shell">
        <Logo />
        <button ref={toggleRef} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} onClick={() => setOpen(!open)}>
          <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true"><i /><i /></span>
          <span>{open ? 'Close' : 'Menu'}</span>
        </button>
        <span className="mobile-current" aria-label="Current page">{page === 'gifts' ? 'Custom Gifts' : links.find(link => link.toLowerCase() === page)}</span>
        <nav id="main-navigation" className={`nav-links${open ? ' open' : ''}`} aria-label="Main navigation">
          {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} aria-current={page === link.toLowerCase() ? 'page' : undefined} onClick={() => setOpen(false)}>{link === 'Gifts' ? 'Custom Gifts' : link}</a>)}
          <a className="button nav-cta" href="#workshops" onClick={() => setOpen(false)}>Explore Workshops <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  )
}

export function Footer({ page }) {
  return (
    <footer>
      <div className="footer-grid">
        <div><Logo /><p>Coffee · Create · Slow Down</p><p className="footer-note">{cafe.description}<br />A little space for life’s little joys.</p></div>
        <div><h3>Find your moment</h3><nav className="footer-links" aria-label="Footer navigation">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} aria-current={page === link.toLowerCase() ? 'page' : undefined}>{link === 'Gifts' ? 'Custom Gifts' : link}</a>)}</nav></div>
        <div><h3>Take your time</h3><dl className="opening-hours">{cafe.openingHours.map(({ shortDays, hours }) => <div key={shortDays}><dt>{shortDays}</dt><dd>{hours}</dd></div>)}</dl><a href="#contact" className="text-link">Plan your visit <span aria-hidden="true">↗</span></a></div>
        <div><h3>Stay a little closer</h3><p>Instagram · {cafe.instagram}<br /><small>Placeholder profile · coming soon</small></p><a href={'mailto:' + cafe.email}>{cafe.email}</a><p>{cafe.phone}<br /><small>Demo contact number</small></p><address className="footer-address">{cafe.location}</address></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} SOWON Café. Made for slower days.</span><span>소원 · A little wish, a little joy.</span><span>Fictional café · Portfolio concept</span></div>
    </footer>
  )
}
