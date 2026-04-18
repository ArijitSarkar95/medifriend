import React, { useState } from 'react'

const RATINGS = [
  { emoji: '😞', label: 'Poor' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😊', label: 'Great' },
  { emoji: '🤩', label: 'Excellent' },
]

export default function FeedbackModal({ open, onClose, onToast }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [rating, setRating] = useState(null)
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  function handleSubmit() {
    if (!name.trim()) { onToast('Please enter your name', 'err'); return }
    if (!age || isNaN(age) || age < 1 || age > 120) { onToast('Please enter a valid age', 'err'); return }
    if (!description.trim()) { onToast('Please write your feedback', 'err'); return }
    // Save to localStorage
    const fb = JSON.parse(localStorage.getItem('mf_fb') || '[]')
    fb.push({ name, age, rating: rating !== null ? RATINGS[rating].label : 'N/A', description, ts: new Date().toISOString() })
    localStorage.setItem('mf_fb', JSON.stringify(fb))
    setSubmitted(true)
  }

  function handleClose() {
    setName(''); setAge(''); setRating(null); setDescription(''); setSubmitted(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) handleClose() }}>
      <div className="modal">
        <div className="mhd">
          <div className="mtitle">💬 Share Your Feedback</div>
          <button className="mclose" onClick={handleClose}>✕</button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎉</div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'rgba(255,255,255,.96)', marginBottom: 10 }}>
              Thank you, {name}!
            </div>
            <div style={{ fontSize: '.87rem', color: 'rgba(255,255,255,.62)', lineHeight: 1.65, maxWidth: 320, margin: '0 auto 24px' }}>
              Your feedback helps us improve Medifriend for everyone. We truly appreciate you taking the time! 🙏
            </div>
            <button className="btn-pri" onClick={handleClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ padding: '14px 24px 0', fontSize: '.82rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.55 }}>
              Help us improve Medifriend — takes less than a minute! 🚀
            </div>

            {/* Name & Age side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 24px 0' }}>
              <div>
                <label className="flbl">Name <span style={{ color: '#ff6b6b' }}>*</span></label>
                <input className="finp" type="text" placeholder="e.g. Arijit" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="flbl">Age <span style={{ color: '#ff6b6b' }}>*</span></label>
                <input className="finp" type="number" placeholder="e.g. 21" min="1" max="120" value={age} onChange={e => setAge(e.target.value)} />
              </div>
            </div>

            <div className="fgrp" style={{ paddingTop: 14 }}>
              <label className="flbl">Overall Experience</label>
              <div className="rating-grid">
                {RATINGS.map((r, i) => (
                  <button
                    key={i}
                    className={`rating-btn${rating === i ? ' selected' : ''}`}
                    onClick={() => setRating(i)}
                  >
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="fgrp">
              <label className="flbl">Your Feedback <span style={{ color: '#ff6b6b' }}>*</span></label>
              <textarea
                className="finp"
                placeholder="Tell us what you liked, what could be improved, or any issues you faced..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="mfooter">
              <button className="btn-sec" onClick={handleClose}>Cancel</button>
              <button className="btn-pri" onClick={handleSubmit}>Submit 🚀</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
