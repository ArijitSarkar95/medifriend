import React, { useState, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import InputArea from './components/InputArea.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'
import { useClaude } from './hooks/useClaude.js'
import './App.css'

export default function App() {
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [model, setModel] = useState('openrouter/auto')
  const [lang, setLang] = useState(() => localStorage.getItem('mf_lang') || 'auto')
  const [toast, setToast] = useState({ msg: '', type: '', visible: false })
  const toastTimer = useRef(null)

  const { sendMessage, busy, resetHistory } = useClaude()

  function showToast(msg, type = '') {
    clearTimeout(toastTimer.current)
    setToast({ msg, type, visible: true })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200)
  }

  async function handleSend(text, attachedFiles) {
    setMessages(prev => [...prev, { role: 'user', text, files: attachedFiles }])
    try {
      const reply = await sendMessage(text, attachedFiles, lang, model)
      setMessages(prev => [...prev, { role: 'assistant', text: reply, files: [] }])
    } catch (err) {
      const m = err.message.includes('401')
        ? '**Invalid API Key** — please check your API key in Settings.'
        : `**Connection Error**: ${err.message}\n\nPlease verify your API key and try again.`
      setMessages(prev => [...prev, { role: 'assistant', text: '⚠️ ' + m, files: [] }])
    }
  }

  function handleSuggest(text) {
    setSidebarOpen(false)
    handleSend(text, [])
  }

  function handleNewChat() {
    setMessages([])
    setFiles([])
    resetHistory()
    setSidebarOpen(false)
    showToast('New conversation started', 'ok')
  }

  function handleSaveSettings(newModel, newLang) {
    setModel(newModel)
    setLang(newLang)
    localStorage.setItem('mf_model', newModel)
    localStorage.setItem('mf_lang', newLang)
    setSettingsOpen(false)
    showToast('Settings saved ✓', 'ok')
  }

  return (
    <div id="app">
      <div id="sb-ov" className={sidebarOpen ? 'on' : ''} onClick={() => setSidebarOpen(false)} />

      <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
        <Sidebar
          onSuggest={handleSuggest}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenFeedback={() => setFeedbackOpen(true)}
        />
      </aside>

      <main id="main">
        {/* Topbar */}
        <div id="topbar">
          <div className="topbar-left">
            <button id="menu-btn" onClick={() => setSidebarOpen(s => !s)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <div className="mobile-brand">
              <div className="brand-icon" style={{ width: 30, height: 30, borderRadius: 9, fontSize: 14 }}>🩺</div>
              Medifriend
            </div>
            <div className="topbar-pill">
              <div className="online-dot"></div>
              AI Online
            </div>
            {/* Feedback button — visible on mobile since sidebar is hidden */}
            <button className="feedback-btn" onClick={() => setFeedbackOpen(true)}>
              💬 Feedback
            </button>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={handleNewChat} title="Clear Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Clear Chat
            </button>
            <button className="icon-btn" onClick={() => setSettingsOpen(true)} title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Settings
            </button>
          </div>
        </div>

        <ChatWindow messages={messages} busy={busy} onSuggest={handleSuggest} />

        <InputArea onSend={handleSend} busy={busy} files={files} setFiles={setFiles} onToast={showToast} />
      </main>

      <SettingsModal open={settingsOpen} model={model} lang={lang} onSave={handleSaveSettings} onClose={() => setSettingsOpen(false)} />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} onToast={showToast} />

      <div id="voice-hud">🎤 Listening… speak now</div>
      {toast.visible && <div id="toast" className={`on ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
