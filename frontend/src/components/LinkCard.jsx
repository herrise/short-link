import { useState } from 'react'

export default function LinkCard({ link, onDelete }) {
    const [copied, setCopied] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // In production (Docker/nginx), same origin works. In dev, override via .env.development
    const baseUrl = import.meta.env.VITE_SHORT_URL_BASE || window.location.origin
    const shortUrl = `${baseUrl}/${link.short_code}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // fallback
            const ta = document.createElement('textarea')
            ta.value = shortUrl
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDelete = async () => {
        if (deleting) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/links/${link.id}`, { method: 'DELETE' })
            if (res.ok || res.status === 204) {
                onDelete(link.id)
            }
        } catch {
            // ignore
        } finally {
            setDeleting(false)
        }
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'Z')
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="link-card">
            <div className="link-card-top">
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url"
                >
                    {shortUrl.replace(/^https?:\/\//, '')}
                </a>
            </div>

            <span className="original-url" title={link.original_url}>
                {link.original_url}
            </span>

            <div className="link-card-bottom">
                <div className="link-meta">
                    <span className="click-badge">
                        🔥 {link.click_count} click{link.click_count !== 1 ? 's' : ''}
                    </span>
                    <span>{formatDate(link.created_at)}</span>
                </div>

                <div className="link-actions">
                    <button
                        className={`btn-icon ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                        title="Copy short URL"
                        id={`copy-btn-${link.id}`}
                    >
                        {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                        className="btn-icon delete"
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Delete link"
                        id={`delete-btn-${link.id}`}
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    )
}
