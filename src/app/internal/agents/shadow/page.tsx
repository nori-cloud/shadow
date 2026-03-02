'use client'

import { useState } from 'react'
import { ANALYST_SYSTEM_PROMPT as ANALYST_PROMPT, DIALOGUE_SYSTEM_PROMPT as DIALOGUE_PROMPT } from '@/mastra/agents/prompts'

type Message = { role: 'user' | 'assistant'; content: string }

const PRESETS = {
  analyst: ANALYST_PROMPT,
  dialogue: DIALOGUE_PROMPT,
}

export default function ShadowPlayground() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [activePrompt, setActivePrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  function loadPreset(key: keyof typeof PRESETS) {
    setSystemPrompt(PRESETS[key])
  }

  function applyPrompt() {
    setActivePrompt(systemPrompt)
    setMessages([])
  }

  async function sendMessage() {
    if (!input.trim() || !activePrompt) return
    const userMsg: Message = { role: 'user', content: input }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/internal/agents/shadow/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: activePrompt, messages: next }),
      })
      const { text } = await res.json()
      setMessages([...next, { role: 'assistant', content: text ?? '(no response)' }])
    } catch {
      setMessages([...next, { role: 'assistant', content: '(error: failed to reach agent)' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left panel — prompt editor */}
      <div className="w-1/2 flex flex-col gap-3 p-4 border-r border-gray-200">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">System Prompt</h2>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">Load preset into editor</span>
          <div className="flex gap-2">
            <button
              onClick={() => loadPreset('analyst')}
              className="px-3 py-1 text-sm rounded border border-gray-600 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              Shadow Analyst
            </button>
            <button
              onClick={() => loadPreset('dialogue')}
              className="px-3 py-1 text-sm rounded border border-gray-600 hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              Shadow Dialogue
            </button>
          </div>
        </div>
        <textarea
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          className="flex-1 font-mono text-sm p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
          placeholder="Paste or type a system prompt, then click Apply…"
        />
        <button
          onClick={applyPrompt}
          disabled={!systemPrompt.trim()}
          className="py-2 text-sm font-medium rounded bg-gray-900 text-white disabled:opacity-40 hover:bg-gray-700"
        >
          Apply & Reset Chat
        </button>
      </div>

      {/* Right panel — chat */}
      <div className="w-1/2 flex flex-col p-4 gap-3">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">Chat</h2>
        {!activePrompt && (
          <p className="text-sm text-gray-400">Load a preset or write a prompt, then click Apply.</p>
        )}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`text-sm whitespace-pre-wrap ${m.role === 'user' ? 'text-gray-800' : 'text-gray-500 font-mono'}`}>
              <span className="font-semibold mr-2">{m.role === 'user' ? 'You' : 'Agent'}:</span>
              {m.content}
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400 italic">Thinking…</p>}
        </div>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            disabled={!activePrompt || loading}
            rows={3}
            className="flex-1 text-sm p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-40"
            placeholder="Enter to send, Shift+Enter for newline…"
          />
          <button
            onClick={sendMessage}
            disabled={!activePrompt || loading || !input.trim()}
            className="px-4 py-2 text-sm font-medium rounded bg-gray-900 text-white disabled:opacity-40 hover:bg-gray-700 self-end"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
