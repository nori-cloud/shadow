# Shadow Agent Playground Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone internal playground at `/internal/agents/shadow` for iterating on shadow agent system prompts.

**Architecture:** Two-panel Next.js page — left panel has a preset selector + editable system prompt textarea, right panel is a multi-turn chat. A co-located POST route creates an ad-hoc Mastra `Agent` with the provided system prompt and returns raw text.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, `@mastra/core` Agent

**Branch:** `feat/shadow-playground`
**Closes:** https://github.com/nori-cloud/shadow/issues/8

---

### Task 1: Export system prompts from agent files

**Files:**
- Modify: `src/mastra/agents/shadow-analyst.ts`
- Modify: `src/mastra/agents/shadow-dialogue.ts`

**Step 1: Export SYSTEM_PROMPT from shadow-analyst.ts**

Change line 17 from `const SYSTEM_PROMPT` to `export const SYSTEM_PROMPT`.

```ts
// src/mastra/agents/shadow-analyst.ts line 17
export const SYSTEM_PROMPT = `You are a shadow archetype analyst...`
```

**Step 2: Export SYSTEM_PROMPT from shadow-dialogue.ts**

Change line 4 from `const SYSTEM_PROMPT` to `export const SYSTEM_PROMPT`.

```ts
// src/mastra/agents/shadow-dialogue.ts line 4
export const SYSTEM_PROMPT = `You are a depth psychology guide...`
```

**Step 3: Verify build still passes**

```bash
pnpm build
```

Expected: build succeeds, no TypeScript errors.

**Step 4: Commit**

```bash
git add src/mastra/agents/shadow-analyst.ts src/mastra/agents/shadow-dialogue.ts
git commit -m "feat: export SYSTEM_PROMPT from shadow agent files"
```

---

### Task 2: Create the chat API route

**Files:**
- Create: `src/app/internal/agents/shadow/chat/route.ts`

Note: Next.js App Router does not allow `route.ts` and `page.tsx` in the same directory — the chat handler lives one level deeper at `/internal/agents/shadow/chat`.

**Step 1: Create the route file**

```ts
// src/app/internal/agents/shadow/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Agent } from '@mastra/core/agent'

export async function POST(req: NextRequest) {
  const { systemPrompt, messages } = await req.json()

  const agent = new Agent({
    id: 'shadow-playground',
    name: 'Shadow Playground',
    instructions: systemPrompt,
    model: 'deepseek/deepseek-chat',
  })

  const result = await agent.generate(messages)

  return NextResponse.json({ text: result.text })
}
```

**Step 2: Verify TypeScript**

```bash
pnpm build
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/app/internal/agents/shadow/chat/route.ts
git commit -m "feat: add shadow playground chat API route"
```

---

### Task 3: Build the playground page

**Files:**
- Create: `src/app/internal/agents/shadow/page.tsx`

**Step 1: Create the page**

```tsx
// src/app/internal/agents/shadow/page.tsx
'use client'

import { useState } from 'react'
import { SYSTEM_PROMPT as ANALYST_PROMPT } from '@/mastra/agents/shadow-analyst'
import { SYSTEM_PROMPT as DIALOGUE_PROMPT } from '@/mastra/agents/shadow-dialogue'

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

    const res = await fetch('/internal/agents/shadow/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: activePrompt, messages: next }),
    })
    const { text } = await res.json()
    setMessages([...next, { role: 'assistant', content: text }])
    setLoading(false)
  }

  return (
    <div className="flex h-screen">
      {/* Left panel — prompt editor */}
      <div className="w-1/2 flex flex-col gap-3 p-4 border-r border-gray-200">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-gray-500">System Prompt</h2>
        <div className="flex gap-2">
          <button
            onClick={() => loadPreset('analyst')}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Shadow Analyst
          </button>
          <button
            onClick={() => loadPreset('dialogue')}
            className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Shadow Dialogue
          </button>
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
```

**Step 2: Verify build**

```bash
pnpm build
```

Expected: no TypeScript errors.

**Step 3: Smoke test manually**

```bash
pnpm dev
```

Navigate to `http://localhost:3000/internal/agents/shadow`. Verify:
- Both preset buttons populate the textarea
- Apply clears the chat
- Sending a message returns a response in the right panel

**Step 4: Commit**

```bash
git add src/app/internal/agents/shadow/page.tsx
git commit -m "feat: add shadow agent playground page"
```

---

### Task 4: Open PR

```bash
gh pr create --title "feat: shadow agent playground at /internal/agents/shadow" --body "$(cat <<'EOF'
## Summary

- Adds `/internal/agents/shadow` playground for iterating on shadow agent system prompts
- Two-panel layout: editable system prompt on the left, multi-turn chat on the right
- Preset loader for Shadow Analyst and Shadow Dialogue prompts
- Ad-hoc agent created per request — no production agents modified

Closes #8
EOF
)"
```
