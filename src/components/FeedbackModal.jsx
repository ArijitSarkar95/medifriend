import { useState } from 'react'

export default function FeedbackModal({ onClose }) {
  const [name,    setName]    = useState('')
  const [age,     setAge]     = useState('')
  const [rating,  setRating]  = useState('')
  const [desc,    setDesc]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors,  setErrors]  = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = true
    if (!age.trim())  e.age  = true
    if (!desc.trim()) e.desc = true
    setErrors(e)
    return !Object.keys(e).length
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)

    // Collect device info
    const device = getDeviceInfo()

    // Get location from IP (free, no key)
    let location = { city: 'Unknown', region: 'Unknown', country: 'Unknown', ip: 'Unknown', lat: '', lon: '' }
    try {
      const r = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) })
      if (r.ok) {
        const g = await r.json()
        location = { city: g.city || 'Unknown', region: g.region || 'Unknown', country: g.country_name || 'Unknown', ip: g.ip || 'Unknown', lat: g.latitude || '', lon: g.longitude || '' }
      }
    } catch (_) { /* silently fail */ }

    const fb = JSON.parse(localStorage.getItem('mf_fb') || '[]')
    fb.push({ id: Date.now(), name, age, rating: rating || 'Not rated', feedback: desc, device, location, ts: new Date().toISOString() })
    localStorage.setItem('mf_fb', JSON.stringify(fb))

    setSubmitting(false)
    onClose()
    showGlobalToast('🎉 Thanks for your feedback, ' + name + '!')
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon" style={{ background: 'linear-gradient(140deg,#e879b8,#ffd27a)' }}>💬</div>
            Share Your Feedback
          </div>
          <button className="modal-close" onClick={onClose}><i className="fa fa-times" /></button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="glass-input"
                type="text"
                value={name}
                placeholder="e.g. Arijit Sarkar"
                onChange={e => setName(e.target.value)}
                style={errors.name ? { borderColor: 'rgba(255,80,80,.7)', animation: 'shake .4s ease' } : {}}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                className="glass-input"
                type="number"
                value={age}
                placeholder="e.g. 22"
                min="1" max="120"
                onChange={e => setAge(e.target.value)}
                style={errors.age ? { borderColor: 'rgba(255,80,80,.7)', animation: 'shake .4s ease' } : {}}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="rating-grid">
              {[['5','⭐⭐⭐⭐⭐ Excellent'],['4','⭐⭐⭐⭐ Good'],['3','⭐⭐⭐ Average'],['2','⭐⭐ Needs work']].map(([v,l]) => (
                <label key={v} className="rating-label">
                  <input type="radio" name="rating" value={v} checked={rating===v} onChange={() => setRating(v)} />
                  {l}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback</label>
            <textarea
              className="glass-input"
              value={desc}
              placeholder="Tell us what you loved, what could be better, or any suggestions…"
              onChange={e => setDesc(e.target.value)}
              style={errors.desc ? { borderColor: 'rgba(255,80,80,.7)', animation: 'shake .4s ease' } : {}}
            />
          </div>

          <div style={{ fontSize: '.68rem', color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa fa-lock" style={{ fontSize: '.65rem' }} />
            Device info & approximate location are collected anonymously to improve MediFriend.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? <><i className="fa fa-spinner fa-spin" style={{ marginRight: 6 }} />Submitting…</>
              : <><i className="fa fa-paper-plane" style={{ marginRight: 6, fontSize: '.75rem' }} />Submit Feedback</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

function getDeviceInfo() {
  const ua = navigator.userAgent
  let device = 'Unknown', os = 'Unknown', browser = 'Unknown'
  if (/iPhone/.test(ua)) device = 'iPhone'
  else if (/iPad/.test(ua)) device = 'iPad'
  else if (/Android.*Mobile/.test(ua)) device = 'Android Phone'
  else if (/Android/.test(ua)) device = 'Android Tablet'
  else device = 'Desktop/Laptop'
  if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS'
  else if (/Android/.test(ua)) { const m = ua.match(/Android\s([\d.]+)/); os = 'Android' + (m ? ' ' + m[1] : '') }
  else if (/Windows NT/.test(ua)) { const m = ua.match(/Windows NT ([\d.]+)/); os = 'Windows' + (m ? ' ' + m[1] : '') }
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Linux/.test(ua)) os = 'Linux'
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome'
  else if (/Edg/.test(ua)) browser = 'Edge'
  else if (/Firefox/.test(ua)) browser = 'Firefox'
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari'
  else if (/OPR|Opera/.test(ua)) browser = 'Opera'
  return { device, os, browser, screen: `${window.screen.width}×${window.screen.height}`, userAgent: ua.slice(0, 120) }
}

function showGlobalToast(msg) {
  let t = document.getElementById('global-toast')
  if (!t) { t = document.createElement('div'); t.id = 'global-toast'; t.className = 'toast'; document.body.appendChild(t) }
  t.textContent = msg; t.classList.add('visible')
  setTimeout(() => t.classList.remove('visible'), 3200)
}