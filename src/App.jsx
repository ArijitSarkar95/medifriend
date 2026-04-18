import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import InputArea from './components/InputArea.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import FeedbackModal from './components/FeedbackModal.jsx'
import AdminLoginModal from './components/AdminLoginModal.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import { useOpenRouter } from './hooks/useOpenRouter.js'

export default function App() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mf_settings')
    return saved ? JSON.parse(saved) : {
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      model: 'openrouter/auto',
      lang: 'en',
    }
  })

  const [messages, setMessages]       = useState([])
  const [attachments, setAttachments] = useState([])
  const [history, setHistory]         = useState(() => JSON.parse(localStorage.getItem('mf_hist') || '[]'))
  const [currentId, setCurrentId]     = useState(() => Date.now())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Modal states
  const [showSettings,   setShowSettings]   = useState(false)
  const [showFeedback,   setShowFeedback]   = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminDash,  setShowAdminDash]  = useState(false)

  const { sendMessage, isLoading } = useOpenRouter(settings)

  useEffect(() => {
    localStorage.setItem('mf_settings', JSON.stringify(settings))
  }, [settings])

  function saveCurrentToHistory() {
    if (!messages.length) return
    const first = messages.find(m => m.role === 'user')
    const label = typeof first?.content === 'string'
      ? first.content.slice(0, 34)
      : (first?.content?.find?.(c => c.type === 'text')?.text || 'Consultation').slice(0, 34)
    const updated = [{ id: currentId, label, messages }, ...history.filter(h => h.id !== currentId)].slice(0, 20)
    setHistory(updated)
    localStorage.setItem('mf_hist', JSON.stringify(updated))
  }

  function newChat() {
    saveCurrentToHistory()
    setMessages([])
    setAttachments([])
    setCurrentId(Date.now())
  }

  function loadChat(item) {
    saveCurrentToHistory()
    setMessages(item.messages)
    setCurrentId(item.id)
    setSidebarOpen(false)
  }

  async function handleSend(text) {
    if (!text.trim() && !attachments.length) return
    if (!settings.apiKey) { setShowSettings(true); return }

    const userContent = []
    if (text.trim()) userContent.push({ type: 'text', text })
    attachments.forEach(a => {
      if (a.type === 'img') userContent.push({ type: 'image_url', image_url: { url: a.data } })
    })
    const userMsg = {
      role: 'user',
      content: userContent.length === 1 && userContent[0].type === 'text' ? text : userContent,
      attachments: [...attachments],
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setAttachments([])

    const reply = await sendMessage(newMessages, settings.lang)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
  }

  function openAdminLogin() {
    setShowSettings(false)
    setShowAdminLogin(true)
  }

  function onAdminLoginSuccess() {
    setShowAdminLogin(false)
    setShowAdminDash(true)
  }

  return (
    <>
      <div className="bg" />
      <div className="bokeh bokeh-1" />
      <div className="bokeh bokeh-2" />
      <div className="bokeh bokeh-3" />

      {/* Sidebar overlay for mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app">
        <Sidebar
          open={sidebarOpen}
          history={history}
          currentId={currentId}
          onNewChat={newChat}
          onLoadChat={loadChat}
          onFeedback={() => { setSidebarOpen(false); setShowFeedback(true) }}
          onSettings={() => { setSidebarOpen(false); setShowSettings(true) }}
          lang={settings.lang}
          onLangChange={lang => setSettings(s => ({ ...s, lang }))}
        />

        <main className="main">
          {/* TOP BAR */}
          <div className="topbar">
            <div className="tb-left">
              <button className="ham-btn" onClick={() => setSidebarOpen(o => !o)}>
                <i className="fa fa-bars" />
              </button>
              <div>
                <div className="tb-title">🩺 MediFriend</div>
                <div className="tb-sub">{modelLabel(settings.model)}</div>
              </div>
            </div>
            <div className="tb-right">
              <select
                className="lang-select"
                value={settings.lang}
                onChange={e => setSettings(s => ({ ...s, lang: e.target.value }))}
              >
                {LANGS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
              <button className="icon-btn" onClick={newChat}>
                <i className="fa fa-broom" style={{ fontSize: '.72rem' }} />
                <span>Clear chat</span>
              </button>
              <button className="icon-btn" onClick={() => setShowFeedback(true)}>
                <i className="fa fa-comment-dots" style={{ fontSize: '.72rem' }} />
                <span>Feedback</span>
              </button>
              <button className="icon-btn" onClick={() => setShowSettings(true)}>
                <i className="fa fa-gear" style={{ fontSize: '.72rem' }} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* CHAT */}
          <div className="chat-wrap">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onChipClick={handleSend}
            />
            <InputArea
              onSend={handleSend}
              attachments={attachments}
              setAttachments={setAttachments}
              lang={settings.lang}
            />
          </div>
        </main>
      </div>

      {/* MODALS */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={s => { setSettings(s); setShowSettings(false) }}
          onClose={() => setShowSettings(false)}
          onAdminLogin={openAdminLogin}
        />
      )}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={onAdminLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminDash && (
        <AdminDashboard onClose={() => setShowAdminDash(false)} />
      )}
    </>
  )
}

const LANGS = [
  ['en','🌐 English'],['hi','हिन्दी'],['bn','বাংলা'],['te','తెలుగు'],
  ['mr','मराठी'],['ta','தமிழ்'],['gu','ગુજરાતી'],['kn','ಕನ್ನಡ'],
  ['ml','മലയാളം'],['pa','ਪੰਜਾਬੀ'],
]

function modelLabel(model) {
  const map = {
    'openrouter/auto': 'Auto — Best free model',
    'meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B',
    'google/gemma-3-27b-it:free': 'Google Gemma 3 27B',
    'meta-llama/llama-3.2-11b-vision-instruct:free': 'Llama 3.2 Vision',
    'deepseek/deepseek-r1:free': 'DeepSeek R1',
    'mistralai/mistral-7b-instruct:free': 'Mistral 7B',
  }
  return map[model] || 'Auto — Best free model'
}