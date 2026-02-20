import LinkCard from './LinkCard'

export default function LinkList({ links, onDelete }) {
    if (links.length === 0) {
        return (
            <div className="empty-state">
                <div className="icon">🔗</div>
                <p>No links yet. Paste a URL above to get started!</p>
            </div>
        )
    }

    return (
        <div>
            <div className="section-label">
                Your Links <span className="count">{links.length}</span>
            </div>
            <div className="link-list">
                {links.map((link) => (
                    <LinkCard key={link.id} link={link} onDelete={onDelete} />
                ))}
            </div>
        </div>
    )
}
