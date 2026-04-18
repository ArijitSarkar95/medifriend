import { useState } from 'react'

// Admin credentials
const ADMIN_ID = '1'
const ADMIN_PW = '236985'

export default function AdminLoginModal({ onSuccess, onClose }) {
  const [id, setId]       = useState('')
  const [pw, setPw]       = useState('')
  const [error, setError] = useState(false)

  function handleLogin() {
    if (id.trim() === ADMIN_ID && pw === ADMIN_PW) {
      onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 360 }}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon" style={{ background: 'linear-gradient(140deg,#1e3a8a,#9b6dff)' }}>🔐</div>
            Admin Login
          </div>
          <button className="modal-close" onClick={onClose}><i className="fa fa-times" /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Admin ID</label>
            <input
              className="glass-input"
              type="text"
              value={id}
              placeholder="Enter admin ID"
              onChange={e => setId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="glass-input"
              type="password"
              value={pw}
              placeholder="Enter password"
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={error ? { borderColor: 'rgba(255,80,80,.7)' } : {}}
            />
          </div>
          {error && (
            <div className="error-text">❌ Invalid credentials. Please try again.</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleLogin}>
            <i className="fa fa-arrow-right-to-bracket" style={{ marginRight: 6, fontSize: '.75rem' }} />
            Login
          </button>
        </div>
      </div>
    </div>
  )
}