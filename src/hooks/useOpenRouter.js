import { useState } from 'react'

const SYSTEM_PROMPT = `You are MediFriend, a compassionate AI medical assistant for Indian users.
Help with symptoms, medications, medical reports, and general health.
Always advise consulting a real doctor for serious conditions.
Be empathetic and clear. If images are medical reports or ECGs, analyze them carefully.
For emergencies, immediately advise calling 112.`

const LANG_NAMES = {
  hi:'Hindi', bn:'Bengali', te:'Telugu', mr:'Marathi',
  ta:'Tamil', gu:'Gujarati', kn:'Kannada', ml:'Malayalam', pa:'Punjabi',
}

export function useOpenRouter(settings) {
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(messages, lang) {
    setIsLoading(true)
    try {
      const langNote = lang && lang !== 'en' ? ` Please respond in ${LANG_NAMES[lang] || 'English'}.` : ''
      const history = messages.slice(-14).map(m => ({
        role: m.role,
        content: m.content,
      }))
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'MediFriend',
        },
        body: JSON.stringify({
          model: settings.model || 'openrouter/auto',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + langNote },
            ...history,
          ],
          max_tokens: 1200,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return `⚠️ ${err?.error?.message || 'Error ' + res.status}\n\nTry switching models in ⚙️ Settings.`
      }
      const data = await res.json()
      return data.choices?.[0]?.message?.content || 'No response received.'
    } catch (e) {
      return '⚠️ Network error. Please check your connection.'
    } finally {
      setIsLoading(false)
    }
  }

  return { sendMessage, isLoading }
}