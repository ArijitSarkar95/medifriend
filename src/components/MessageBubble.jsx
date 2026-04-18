import React from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default function MessageBubble({ role, text, attachedFiles = [] }) {
  const isUser = role === 'user'

  const avatar = isUser
    ? 'You'
    : (
      <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="white"/>
      </svg>
    )

  const bubbleContent = isUser
    ? <span dangerouslySetInnerHTML={{ __html: esc(text).replace(/\n/g, '<br>') }} />
    : <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(text)) }} />

  return (
    <div className={`msg ${role}`}>
      <div className="msg-av">{avatar}</div>
      <div className="msg-body">
        <div className="msg-who">{isUser ? 'You' : 'Medifriend'}</div>
        {attachedFiles.length > 0 && (
          <div className="msg-files">
            {attachedFiles.map((f, i) => (
              <div key={i} className="file-tag">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}>
                  <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
                {f.name}
              </div>
            ))}
          </div>
        )}
        <div className="bubble">{bubbleContent}</div>
      </div>
    </div>
  )
}
