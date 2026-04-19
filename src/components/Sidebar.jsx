const LANGS = [
  ['en','🌐 English'],['hi','हिन्दी'],['bn','বাংলা'],['te','తెలుగు'],
  ['mr','मराठी'],['ta','தமிழ்'],['gu','ગુજરાતી'],['kn','ಕನ್ನಡ'],
  ['ml','മലയാളം'],['pa','ਪੰਜਾਬੀ'],
]

export default function Sidebar({ open, history, currentId, onNewChat, onLoadChat, onFeedback, onSettings, lang, onLangChange }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sb-head">
        <div className="logo">
          <div className="logo-mark">🩺</div>
          <div>
            <div className="logo-name">MediFriend</div>
            <div className="logo-tag">AI Medical Advisor</div>
          </div>
        </div>
        <button className="new-btn" onClick={onNewChat}>
          <i className="fa fa-plus" style={{ fontSize: '.72rem' }} /> New Consultation
        </button>
      </div>

      <div className="sb-hist">
        <div className="hist-label">Recent</div>
        {!history.length && (
          <div style={{ padding: '14px 8px', fontSize: '.72rem', color: 'var(--t3)', textAlign: 'center' }}>
            No consultations yet
          </div>
        )}
        {history.map(item => (
          <div
            key={item.id}
            className={`hist-item ${item.id === currentId ? 'active' : ''}`}
            onClick={() => onLoadChat(item)}
          >
            <i className="fa fa-comment-medical" />
            {item.label}…
          </div>
        ))}
      </div>

      <div className="sb-foot">
        <div className="sb-lang-mobile">
          <select
            className="glass-input"
            value={lang}
            onChange={e => onLangChange(e.target.value)}
            style={{ width: '100%', fontSize: '.8rem', padding: '9px 12px' }}
          >
            {LANGS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </div>

        <div className="status-row">
          <div className="status-pill">
            <div className="status-dot" />
            <span className="status-text">AI Online</span>
          </div>
          <button className="feedback-pill" onClick={onFeedback}>
            <i className="fa fa-comment-dots" style={{ fontSize: '.7rem' }} />
            Feedback
          </button>
        </div>

        <div className="settings-row" onClick={onSettings}>
          <i className="fa fa-gear" style={{ fontSize: '.78rem' }} />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  )
}
