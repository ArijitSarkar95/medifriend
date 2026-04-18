import { useState, useRef } from 'react'

export default function InputArea({ onSend, attachments, setAttachments, lang }) {
  const [text, setText] = useState('')
  const [recording, setRecording] = useState(false)
  const srRef = useRef(null)
  const taRef = useRef(null)

  function autoResize() {
    const el = taRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleSend() {
    onSend(text)
    setText('')
    if (taRef.current) taRef.current.style.height = 'auto'
  }

  function handleFiles(e) {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader()
      if (file.type.startsWith('image/')) {
        reader.onload = ev => setAttachments(a => [...a, { type: 'img', data: ev.target.result, name: file.name }])
        reader.readAsDataURL(file)
      } else {
        setAttachments(a => [...a, { type: 'file', name: file.name }])
      }
    })
    e.target.value = ''
  }

  function removeAttachment(name) {
    setAttachments(a => a.filter(x => x.name !== name))
  }

  function toggleVoice() {
    if (recording) {
      srRef.current?.stop(); setRecording(false); return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = lang === 'en' ? 'en-IN' : lang
    r.onresult = e => { setText(e.results[0][0].transcript); autoResize() }
    r.onend = () => setRecording(false)
    r.start(); srRef.current = r; setRecording(true)
  }

  return (
    <div className="input-area">
      {attachments.length > 0 && (
        <div className="file-chips">
          {attachments.map(a => (
            <div key={a.name} className="file-chip">
              <i className={`fa ${a.type === 'img' ? 'fa-image' : 'fa-file'}`} style={{ fontSize: '.7rem' }} />
              {a.name.length > 20 ? a.name.slice(0, 20) + '…' : a.name}
              <span className="file-chip-remove" onClick={() => removeAttachment(a.name)}>✕</span>
            </div>
          ))}
        </div>
      )}

      <div className="input-row">
        <div className="input-actions">
          <label className="input-icon-btn" title="Attach file">
            <i className="fa fa-paperclip" />
            <input type="file" accept="image/*,.pdf,.txt" multiple onChange={handleFiles} style={{ display: 'none' }} />
          </label>
          <button
            className={`input-icon-btn ${recording ? 'recording' : ''}`}
            title="Voice input"
            onClick={toggleVoice}
          >
            <i className="fa fa-microphone" />
          </button>
        </div>

        <textarea
          ref={taRef}
          className="chat-input"
          rows={1}
          value={text}
          placeholder="Describe your symptoms or ask a health question…"
          onChange={e => { setText(e.target.value); autoResize() }}
          onKeyDown={handleKey}
        />

        <button className="send-btn" onClick={handleSend} disabled={!text.trim() && !attachments.length}>
          <i className="fa fa-paper-plane" />
        </button>
      </div>

      <div className="disclaimer">⚕️ Not a substitute for professional medical advice.</div>
    </div>
  )
}