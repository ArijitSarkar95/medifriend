import { marked } from 'marked'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const text = typeof message.content === 'string'
    ? message.content
    : message.content?.find?.(c => c.type === 'text')?.text || ''
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className={`msg-avatar ${isUser ? 'user' : 'ai'}`}>
        {isUser ? '👤' : '🩺'}
      </div>
      <div className="msg-bubble">
        {/* Image attachments */}
        {message.attachments?.filter(a => a.type === 'img').map((a, i) => (
          <img key={i} src={a.data} alt="attachment" />
        ))}
        {/* File attachments */}
        {message.attachments?.filter(a => a.type === 'file').map((a, i) => (
          <div key={i} className="file-chip" style={{ marginBottom: 6 }}>
            <i className="fa fa-file" style={{ fontSize: '.7rem' }} /> {a.name}
          </div>
        ))}
        {/* Message text */}
        {text && (
          <div dangerouslySetInnerHTML={{ __html: marked.parse(text) }} />
        )}
        <div className="msg-time">{time}</div>
      </div>
    </div>
  )
}