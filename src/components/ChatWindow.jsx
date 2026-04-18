import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'

const chips = [
  {
    icon: '💗',
    title: 'Analyze Chest Pain',
    desc: 'Left side pain, shortness of breath, dizziness — full analysis',
    text: 'I have been experiencing chest pain on the left side with shortness of breath and occasional dizziness for 3 days. I am also sweating more than usual. What could this be? Is it serious?',
  },
  {
    icon: '🏥',
    title: 'Best Hospitals India',
    desc: 'Knee replacement — hospitals, costs & Ayushman Bharat options',
    text: 'I need to undergo knee replacement surgery. Which hospitals in India offer this at the best quality and lowest cost? Please give me specific hospital names and approximate cost ranges including government and private options.',
  },
  {
    icon: '🔬',
    title: 'Lab Result Analysis',
    desc: 'Blood sugar 186, HbA1c 8.2%, cholesterol 248 — interpret results',
    text: 'My fasting blood glucose is 186 mg/dL, HbA1c is 8.2%, total cholesterol is 248 mg/dL, LDL is 160 mg/dL, triglycerides are 220 mg/dL. What do these results mean and what should I do?',
  },
  {
    icon: '🌏',
    title: 'বাংলা / हिंदी / தமிழ்',
    desc: 'Ask in any Indian language — I understand all of them',
    text: 'মুঝে এক সপ্তাহ ধরে জ্বর, মাথাব্যথা এবং শরীরে ব্যথা হচ্ছে। এটা কি ডেঙ্গু হতে পারে? আমার কী করা উচিত?',
  },
]

export default function ChatWindow({ messages, busy, onSuggest }) {
  const wrapRef = useRef(null)
  const showWelcome = messages.length === 0

  useEffect(() => {
    if (wrapRef.current) {
      wrapRef.current.scrollTo({ top: wrapRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages, busy])

  return (
    <div id="chat-wrap" ref={wrapRef}>
      {showWelcome && (
        <div id="welcome">
          <div className="welcome-badge">
            <svg viewBox="0 0 24 24" fill="none" width="42" height="42">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white"/>
            </svg>
          </div>
          <h1 className="welcome-title">Hello, I'm Medifriend</h1>
          <p className="welcome-sub">Your compassionate AI Medical Advisor. Describe symptoms, upload medical reports (ECG, blood tests, X-rays), or ask about hospitals and treatment costs in India. I understand multiple languages.</p>
          <div className="chips-grid">
            {chips.map((c, i) => (
              <div key={i} className="chip" onClick={() => onSuggest(c.text)}>
                <div className="chip-icon">{c.icon}</div>
                <div className="chip-title">{c.title}</div>
                <div className="chip-desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="messages">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} attachedFiles={m.files || []} />
        ))}
      </div>

      {busy && (
        <div id="typing" className="on" style={{ maxWidth: 760, margin: '0 auto', width: '100%', paddingBottom: 4 }}>
          <div className="typing-av">
            <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white"/>
            </svg>
          </div>
          <div className="typing-bub">
            <div className="t-dot"></div>
            <div className="t-dot"></div>
            <div className="t-dot"></div>
          </div>
        </div>
      )}
    </div>
  )
}
