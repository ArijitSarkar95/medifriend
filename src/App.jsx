import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import InputArea from './components/InputArea.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import { useClaude } from './hooks/useClaude.js'
import './App.css'

export default function App() {
  const [messages, setMessages] = useState([])
  const [files, setFiles] = useState([])
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [model, setModel] = useState(() => localStorage.getItem('mf_model') || 'meta-llama/llama-3.3-70b-instruct')
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
      {/* Sidebar overlay (mobile) */}
      <div
        id="sb-ov"
        className={sidebarOpen ? 'on' : ''}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={sidebarOpen ? 'open' : ''} style={{ display: 'contents' }}>
        <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
          <Sidebar
            onSuggest={handleSuggest}
            onNewChat={handleNewChat}
            onOpenSettings={() => setSettingsOpen(true)}
          />
        </aside>
      </div>

      {/* Main area */}
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
              <div className="brand-icon" style={{ width: 30, height: 30, borderRadius: 9 }}>
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white"/>
                </svg>
              </div>
              Medifriend
            </div>
            <div className="topbar-pill">
              <div className="online-dot"></div>
              AI Online
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={handleNewChat} title="New Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
            <button className="icon-btn" onClick={() => setSettingsOpen(true)} title="Settings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Chat */}
        <ChatWindow messages={messages} busy={busy} onSuggest={handleSuggest} />

        {/* Input */}
        <InputArea
          onSend={handleSend}
          busy={busy}
          files={files}
          setFiles={setFiles}
          onToast={showToast}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        model={model}
        lang={lang}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Voice HUD */}
      <div id="voice-hud">🎤 Listening… speak now</div>

      {/* Toast */}
      {toast.visible && (
        <div id="toast" className={`on ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  )
}
