import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'

const chips = [
  { icon: '🤒', title: 'Headache & Fever', desc: 'Symptoms analysis + urgency check', text: 'I have been experiencing chest pain on the left side with shortness of breath and occasional dizziness for 3 days. I am also sweating more than usual. What could this be? Is it serious?' },
  { icon: '🏥', title: 'Best Hospitals India', desc: 'Knee replacement — costs & Ayushman Bharat', text: 'I need to undergo knee replacement surgery. Which hospitals in India offer this at the best quality and lowest cost?' },
  { icon: '🔬', title: 'Lab Result Analysis', desc: 'Blood sugar, HbA1c, cholesterol — interpret', text: 'My fasting blood glucose is 186 mg/dL, HbA1c is 8.2%, total cholesterol is 248 mg/dL. What do these results mean?' },
  { icon: '🌏', title: 'বাংলা / हिंदी / தமிழ்', desc: 'Ask in any Indian language', text: 'মুঝে এক সপ্তাহ ধরে জ্বর, মাথাব্যথা এবং শরীরে ব্যথা হচ্ছে। এটা কি ডেঙ্গু হতে পারে?' },
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
          <div className="welcome-badge">🩺</div>
          <h1 className="welcome-title">Hi, I'm Medifriend</h1>
          <p className="welcome-sub">Your compassionate AI Medical Advisor. Describe symptoms, upload medical reports, or ask about hospitals and treatment costs in India. I understand multiple languages.</p>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, maxWidth: 760, margin: '0 auto', width: '100%', paddingBottom: 4 }}>
          <div className="typing-av">🩺</div>
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
