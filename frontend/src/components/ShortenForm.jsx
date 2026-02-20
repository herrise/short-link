import { useState } from 'react'

export default function ShortenForm({ onCreated }) {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const trimmed = url.trim()
        if (!trimmed) return

        // auto-add https:// if missing
        const finalUrl = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`

        setLoading(true)
        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ original_url: finalUrl }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.detail || 'Failed to create short link')
            }
            const link = await res.json()
            onCreated(link)
            setUrl('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-card">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste your long URL here..."
                        id="url-input"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !url.trim()}
                        id="shorten-btn"
                    >
                        {loading ? 'Shortening...' : 'Shorten'}
                    </button>
                </div>
                {error && <div className="error-msg">{error}</div>}
            </form>
        </div>
    )
}
