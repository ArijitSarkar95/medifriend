import { useState } from 'react'

const MODELS = [
  ['openrouter/auto',                                   '🤖 Auto — OpenRouter picks best free model'],
  ['meta-llama/llama-3.3-70b-instruct:free',            '💬 Llama 3.3 70B — Best quality (Free)'],
  ['google/gemma-3-27b-it:free',                        '🧠 Google Gemma 3 27B — Fast & free'],
  ['meta-llama/llama-3.2-11b-vision-instruct:free',     '🖼️ Llama 3.2 Vision — Images + Text'],
  ['deepseek/deepseek-r1:free',                         '🔬 DeepSeek R1 — Strong reasoning'],
  ['mistralai/mistral-7b-instruct:free',                '⚡ Mistral 7B — Lightweight'],
]

export default function SettingsModal({ settings, onSave, onClose, onAdminLogin }) {
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model,  setModel]  = useState(settings.model || 'openrouter/auto')

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon" style={{ background: 'linear-gradient(140deg,#9b6dff,#e879b8)' }}>⚙️</div>
            Settings
          </div>
          <button className="modal-close" onClick={onClose}><i className="fa fa-times" /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">OpenRouter API Key</label>
            <input
              className="glass-input"
              type="password"
              value={apiKey}
              placeholder="sk-or-v1-xxxxxxxxxxxxxxxx"
              onChange={e => setApiKey(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">AI Model</label>
            <select className="glass-input" value={model} onChange={e => setModel(e.target.value)}>
              {MODELS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>

          <div className="modal-divider" />

          {/* Admin Panel entry */}
          <div className="settings-menu-item" onClick={onAdminLogin}>
            <i className="fa fa-shield-halved" />
            <span>Admin Panel</span>
            <i className="fa fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '.7rem', color: 'var(--t3)' }} />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave({ ...settings, apiKey, model })}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}