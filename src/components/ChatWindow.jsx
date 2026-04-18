import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble.jsx'

const CHIPS = [
  ['🤒 Headache & fever', 'I have a headache and fever'],
  ['🩸 Blood report', 'Explain my blood report'],
  ['🏥 Find hospitals', 'Find hospitals near me'],
  ['💊 Cold medicines', 'What medicines for cold?'],
  ['💪 Immunity tips', 'How to boost immunity?'],
]

export default function ChatWindow({ messages, isLoading, onChipClick }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="messages">
      {messages.length === 0 && (
        <div className="welcome">
          <div className="welcome-icon">🩺</div>
          <div className="welcome-title">Hi, I'm MediFriend</div>
          <p className="welcome-desc">
            Your AI-powered medical companion. Ask about symptoms, medications, health tips, or upload a report.
          </p>
          <div className="chips">
            {CHIPS.map(([label, text]) => (
              <div key={label} className="chip" onClick={() => onChipClick(text)}>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {isLoading && (
        <div className="message ai">
          <div className="msg-avatar ai">🩺</div>
          <div className="msg-bubble">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}