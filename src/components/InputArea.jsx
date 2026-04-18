import React, { useRef, useEffect, useState } from 'react'

function toB64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result.split(',')[1])
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

export default function InputArea({ onSend, busy, files, setFiles, onToast }) {
  const txtRef = useRef(null)
  const fileInputRef = useRef(null)
  const [hearing, setHearing] = useState(false)
  const recogRef = useRef(null)

  useEffect(() => {
    setupVoice()
    // eslint-disable-next-line
  }, [])

  function grow(el) {
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  function setupVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const recog = new SR()
    recog.continuous = false
    recog.interimResults = true
    recog.maxAlternatives = 1
    let final = ''
    recog.onstart = () => { setHearing(true); final = '' }
    recog.onresult = e => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        e.results[i].isFinal ? final += e.results[i][0].transcript : interim += e.results[i][0].transcript
      }
      if (txtRef.current) { txtRef.current.value = final + interim; grow(txtRef.current) }
    }
    recog.onend = () => setHearing(false)
    recog.onerror = ev => { setHearing(false); if (ev.error !== 'aborted') onToast('Voice error: ' + ev.error, 'err') }
    recogRef.current = recog
  }

  function toggleVoice() {
    if (!recogRef.current) { onToast('Voice not supported in this browser', 'err'); return }
    if (hearing) recogRef.current.stop()
    else { try { recogRef.current.start() } catch (e) { onToast('Could not start voice', 'err') } }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function handleSend() {
    const txt = txtRef.current?.value.trim()
    if (!txt && !files.length) return
    if (busy) return
    const msg = txt || 'Please analyze the attached medical report(s) in detail.'
    const fSnap = [...files]
    txtRef.current.value = ''
    grow(txtRef.current)
    setFiles([])
    onSend(msg, fSnap)
  }

  async function onFilesSelected(e) {
    const newFiles = []
    for (const f of Array.from(e.target.files)) {
      if (f.size > 25 * 1024 * 1024) { onToast(f.name + ' exceeds 25MB limit', 'err'); continue }
      const b64 = await toB64(f)
      newFiles.push({ name: f.name, mime: f.type || 'application/octet-stream', b64, isImg: f.type.startsWith('image/'), url: URL.createObjectURL(f) })
    }
    setFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  function rmFile(i) {
    setFiles(prev => {
      URL.revokeObjectURL(prev[i].url)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  // Paste image
  useEffect(() => {
    const el = txtRef.current
    if (!el) return
    const handler = async (e) => {
      const imgItem = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'))
      if (!imgItem) return
      e.preventDefault()
      const blob = imgItem.getAsFile()
      const b64 = await toB64(blob)
      setFiles(prev => [...prev, { name: `pasted-${Date.now()}.png`, mime: 'image/png', b64, isImg: true, url: URL.createObjectURL(blob) }])
      onToast('Image pasted ✓', 'ok')
    }
    el.addEventListener('paste', handler)
    return () => el.removeEventListener('paste', handler)
  }, [])

  return (
    <>
      {files.length > 0 && (
        <div id="file-bar" className="on">
          {files.map((f, i) => (
            <div key={i} className="fpi">
              <div className="fpi-thumb">
                {f.isImg
                  ? <img src={f.url} alt="" style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 5 }} />
                  : <span style={{ fontSize: 16 }}>📄</span>}
              </div>
              <span className="fpi-name">{f.name}</span>
              <button className="fpi-rm" onClick={() => rmFile(i)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 11, height: 11 }}>
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div id="input-area">
        <div className="input-wrap">
          <textarea
            ref={txtRef}
            id="txt"
            rows={1}
            placeholder="Describe symptoms, ask about hospitals, or share health concerns... (attach reports with 📎)"
            onKeyDown={handleKey}
            onInput={e => grow(e.target)}
          />
          <div className="ibtns">
            <button className="ibtn" onClick={() => fileInputRef.current?.click()} title="Attach medical reports">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
            </button>
            <button
              className={`ibtn${hearing ? ' voice-on' : ''}`}
              id="voiceBtn"
              onClick={toggleVoice}
              title="Voice input"
              style={!recogRef.current ? { display: 'none' } : {}}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
              </svg>
            </button>
            <button className="ibtn send-btn" onClick={handleSend} disabled={busy} title="Send">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="input-caption">📎 Images & PDFs • 🎤 Voice input • 🇮🇳 Multi-language • 🏥 India hospital guidance</div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple onChange={onFilesSelected} style={{ display: 'none' }} />
    </>
  )
}
