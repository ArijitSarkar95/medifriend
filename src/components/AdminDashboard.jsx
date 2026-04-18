export default function AdminDashboard({ onClose }) {
  const feedbacks = JSON.parse(localStorage.getItem('mf_fb') || '[]')
  const rated = feedbacks.filter(f => f.rating && f.rating !== 'Not rated')
  const avgRating = rated.length
    ? (rated.reduce((s, f) => s + Number(f.rating), 0) / rated.length).toFixed(1)
    : '—'
  const today = new Date().toDateString()
  const todayCount = feedbacks.filter(f => new Date(f.ts).toDateString() === today).length

  function exportJSON() {
    const blob = new Blob([JSON.stringify(feedbacks, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'medifriend_feedback.json'
    a.click()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal-box">

        <div className="admin-head">
          <div className="admin-title">
            <i className="fa fa-shield-halved" style={{ color: '#9b6dff', fontSize: '.95rem' }} />
            Admin Dashboard
            <span className="admin-badge">ADMIN</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '.75rem' }} onClick={exportJSON}>
              <i className="fa fa-download" style={{ marginRight: 5, fontSize: '.7rem' }} />Export JSON
            </button>
            <button className="modal-close" onClick={onClose}><i className="fa fa-times" /></button>
          </div>
        </div>

        <div className="admin-body">
          {/* Stats row */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-num">{feedbacks.length}</div>
              <div className="stat-lbl">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{avgRating}</div>
              <div className="stat-lbl">Avg Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{todayCount}</div>
              <div className="stat-lbl">Today</div>
            </div>
          </div>

          {feedbacks.length === 0 && (
            <div className="empty-state">
              <i className="fa fa-inbox" style={{ fontSize: '2rem', marginBottom: 10, display: 'block', opacity: .3 }} />
              No feedback submitted yet.
            </div>
          )}

          {[...feedbacks].reverse().map(f => (
            <FeedbackCard key={f.id} f={f} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedbackCard({ f }) {
  const initials = f.name
    ? f.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const stars = f.rating && f.rating !== 'Not rated'
    ? '⭐'.repeat(Number(f.rating))
    : 'No rating'
  const dt = new Date(f.ts).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
  const loc = f.location || {}
  const dev = f.device || {}
  const locStr = loc.city && loc.city !== 'Unknown'
    ? `${loc.city}, ${loc.region}, ${loc.country}`
    : loc.country || 'Unknown'

  return (
    <div className="fb-card">
      <div className="fb-card-head">
        <div className="fb-user">
          <div className="fb-avatar">{initials}</div>
          <div>
            <div className="fb-name">{f.name || 'Unknown'}</div>
            <div className="fb-age">Age: {f.age || 'N/A'}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '.85rem' }}>{stars}</div>
          <div style={{ fontSize: '.65rem', color: 'var(--t3)', marginTop: 2 }}>{dt}</div>
        </div>
      </div>

      <div className="fb-desc">"{f.feedback || ''}"</div>

      <div className="fb-meta">
        <div className="meta-chip"><i className="fa fa-location-dot" />{locStr}</div>
        <div className="meta-chip"><i className="fa fa-network-wired" />IP: {loc.ip || 'Unknown'}</div>
        {dev.device  && <div className="meta-chip"><i className="fa fa-mobile-screen" />{dev.device}</div>}
        {dev.os      && <div className="meta-chip"><i className="fa fa-laptop" />{dev.os}</div>}
        {dev.browser && <div className="meta-chip"><i className="fa fa-globe" />{dev.browser}</div>}
        {dev.screen  && <div className="meta-chip"><i className="fa fa-expand" />{dev.screen}</div>}
      </div>
    </div>
  )
}