import React from 'react'

const MODELS = [
  { value: 'meta-llama/llama-3.2-11b-vision-instruct:free', label: '🖼️ Llama 3.2 11B Vision — Images + Text (Recommended)' },
  { value: 'meta-llama/llama-3.3-70b-instruct', label: '💬 Llama 3.3 70B — Text only (Best quality)' },
  { value: 'meta-llama/llama-3.1-8b-instruct', label: '💬 Llama 3.1 8B — Text only (Fastest)' },
  { value: 'mistralai/mistral-7b-instruct', label: '💬 Mistral 7B — Text only (Lightweight)' },
  { value: 'google/gemma-2-9b-it:free', label: '💬 Google Gemma 2 9B — Text only (Free)' },
]

const LANGS = [
  { value: 'auto', label: 'Auto-detect from your message (Recommended)' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi (हिंदी)' },
  { value: 'Bengali', label: 'Bengali (বাংলা)' },
  { value: 'Tamil', label: 'Tamil (தமிழ்)' },
  { value: 'Telugu', label: 'Telugu (తెలుగు)' },
  { value: 'Kannada', label: 'Kannada (ಕನ್ನಡ)' },
  { value: 'Malayalam', label: 'Malayalam (മലയാളം)' },
  { value: 'Marathi', label: 'Marathi (मराठी)' },
  { value: 'Gujarati', label: 'Gujarati (ગુજરાતી)' },
  { value: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
]

export default function SettingsModal({ open, model, lang, onSave, onClose }) {
  const [localModel, setLocalModel] = React.useState(model)
  const [localLang, setLocalLang] = React.useState(lang)

  React.useEffect(() => {
    setLocalModel(model)
    setLocalLang(lang)
  }, [open, model, lang])

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="mhd">
          <div className="mtitle">⚙️ Medifriend Settings</div>
          <button className="mclose" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="fgrp">
          <label className="flbl">AI Model</label>
          <select className="finp" value={localModel} onChange={e => setLocalModel(e.target.value)}>
            {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <div className="fhint">🖼️ models support image uploads (ECG, X-ray, reports). 💬 models are text only.</div>
        </div>

        <div className="fgrp">
          <label className="flbl">Preferred Response Language</label>
          <select className="finp" value={localLang} onChange={e => setLocalLang(e.target.value)}>
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <div className="mfooter">
          <button className="btn-sec" onClick={onClose}>Cancel</button>
          <button className="btn-pri" onClick={() => onSave(localModel, localLang)}>Save Settings</button>
        </div>
      </div>
    </div>
  )
}
