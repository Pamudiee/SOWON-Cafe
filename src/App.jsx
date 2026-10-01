import { useEffect, useRef, useState } from 'react'
import { Navbar, Footer } from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Workshops from './pages/Workshops'
import Gifts from './pages/Gifts'
import { About, Contact } from './pages/Information'
import './styles/site.css'
const pages = { home: Home, menu: Menu, workshops: Workshops, gifts: Gifts, about: About, contact: Contact }
const getPage = () => window.location.hash.slice(1) || 'home'
export default function App() {
  const [page, setPage] = useState(getPage)
  const lastPage = useRef(page)
  useEffect(() => {
    const navigate = () => { setPage(getPage()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  useEffect(() => {
    if (lastPage.current !== page) {
      document.getElementById('main')?.focus({ preventScroll: true })
      lastPage.current = page
    }
    document.title = `${page.charAt(0).toUpperCase() + page.slice(1)} · SOWON Café` }, [page])
  const Page = pages[page]
  return <><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main').focus() }}>Skip to content</a><Navbar key={page} page={page} /><main id="main" tabIndex="-1">{Page ? <Page key={page} /> : <section className="page-intro"><h1>A little lost?</h1><a className="button" href="#home">Back to our café</a></section>}</main><Footer page={page} /></>
}
