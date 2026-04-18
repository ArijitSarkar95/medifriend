import React from 'react'

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white"/>
  </svg>
)

const navItems = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    label: 'Symptom Checker',
    text: 'I have been experiencing symptoms and would like a medical assessment. Please help me understand what might be happening.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    label: 'Analyze Medical Report',
    text: 'I want to upload and analyze my medical reports. Please analyze them carefully and explain all findings in simple language.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
    label: 'Hospital Finder 🇮🇳',
    text: 'Which are the best hospitals in India for cardiac bypass surgery? Please provide specific hospital names, their specialties, and approximate cost estimates.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
    label: 'Surgery Cost Guide',
    text: 'I need guidance on surgery costs and treatment options in India. What government schemes like Ayushman Bharat can help reduce costs?',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>,
    label: 'हिंदी / বাংলা / தமிழ்',
    text: 'मुझे पिछले कुछ दिनों से स्वास्थ्य समस्या हो रही है। कृपया हिंदी में मेरी मदद करें।',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    label: 'ECG / Lab Analysis',
    text: 'I have ECG and blood test reports. Please analyze them together to understand my heart health condition.',
  },
]

export default function Sidebar({ onSuggest, onNewChat, onOpenSettings }) {
  return (
    <aside id="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-icon"><HeartIcon /></div>
          <div>
            <div className="brand-name">Medifriend</div>
            <div className="brand-tag">AI Medical Advisor</div>
          </div>
        </div>
      </div>

      <div className="sidebar-body">
        <button className="btn-new" onClick={onNewChat}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M12 5v14M5 12h14"/></svg>
          New Conversation
        </button>

        <div className="sec-title">Quick Start</div>

        {navItems.map((item, i) => (
          <div key={i} className="nav-item" onClick={() => onSuggest(item.text)}>
            <span style={{ width: 15, height: 15, flexShrink: 0, opacity: 0.65 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="disclaimer-box">
          <strong>⚠️ Medical Disclaimer</strong>
          Medifriend provides informational guidance only. Always consult a qualified doctor for diagnosis and treatment. For emergencies call <strong>112</strong>.
        </div>
        <button className="btn-settings-footer" onClick={onOpenSettings}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </button>
      </div>
    </aside>
  )
}
