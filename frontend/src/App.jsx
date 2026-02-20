import { useState, useEffect } from 'react'
import ShortenForm from './components/ShortenForm'
import LinkList from './components/LinkList'
import './index.css'

export default function App() {
  const [links, setLinks] = useState([])
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetchLinks()

    // Poll every 5s for real-time click count updates
    const interval = setInterval(fetchLinks, 1000)

    // Also refresh instantly when user tabs back
    const onFocus = () => fetchLinks()
    window.addEventListener('focus', onFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links')
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch {
      // backend maybe not running yet
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleCreated = (link) => {
    setLinks((prev) => [link, ...prev])
    showToast('✨ Short link created!')
  }

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
    showToast('🗑️ Link deleted')
  }

  return (
    <>
      <header className="header">
        <h1><span className="emoji">⚡</span> Shortly</h1>
        <p className="subtitle">Make your links short, sweet & trackable</p>
      </header>

      <ShortenForm onCreated={handleCreated} />
      <LinkList links={links} onDelete={handleDelete} />

      <div className={`toast ${toast ? 'visible' : ''}`}>{toast}</div>
    </>
  )
}
