'use client'

import { useEffect, useRef, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalysisResult {
  archetypeId: string
  archetypeName: string
  shadowName: string
  matchReason: string
  deeperQuestion: string
  exercise: string[]
  confidence: string
  gift: string
  shadow: string
  lifeStage: string
  wisdom: string
  invitation: string
}

type AppState = 'input' | 'card' | 'dialogue'

// ─── Emotion Tags ─────────────────────────────────────────────────────────────

const EMOTION_TAGS = ['Lonely', 'Irritable', 'Judgmental', 'Overwhelmed', 'Empty', 'Stuck', 'Needy']

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ShadowPage() {
  const [appState, setAppState] = useState<AppState>('input')
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleEmotionTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return next
    })
  }

  const handleAnalyse = async () => {
    const tagSuffix = selectedTags.size > 0 ? ` ${[...selectedTags].map(t => t.toLowerCase()).join(', ')}` : ''
    const combinedInput = inputText.trim() + tagSuffix
    if (!combinedInput.trim()) return
    setIsAnalysing(true)
    setError(null)
    try {
      const res = await fetch('/api/shadow/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: combinedInput }),
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data: AnalysisResult = await res.json()
      setAnalysis(data)
      setAppState('card')
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setIsAnalysing(false)
    }
  }

  const handleGoDeeper = () => {
    const id = crypto.randomUUID()
    document.cookie = `shadow-session=${id}; path=/`
    setSessionId(id)
    setAppState('dialogue')
  }

  const handleReset = () => {
    setAppState('input')
    setAnalysis(null)
    setInputText('')
    setSelectedTags(new Set())
    setError(null)
    setSessionId(null)
  }

  return (
    <div
      className={cormorant.variable}
      style={{
        minHeight: '100vh',
        background: '#0c0b09',
        color: '#e8e0d4',
        fontFamily: 'var(--font-geist-sans)',
        position: 'relative',
        overflow: 'clip',
      }}
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(180,130,60,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {appState === 'input' && (
          <InputView
            inputText={inputText}
            setInputText={setInputText}
            selectedTags={selectedTags}
            isAnalysing={isAnalysing}
            error={error}
            onAnalyse={handleAnalyse}
            onEmotionTag={handleEmotionTag}
          />
        )}
        {appState === 'card' && analysis && (
          <CardView
            analysis={analysis}
            onReset={handleReset}
            onGoDeeper={handleGoDeeper}
          />
        )}
        {appState === 'dialogue' && analysis && sessionId && (
          <DialogueView
            analysis={analysis}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

// ─── Input View ───────────────────────────────────────────────────────────────

function InputView({
  inputText,
  setInputText,
  selectedTags,
  isAnalysing,
  error,
  onAnalyse,
  onEmotionTag,
}: {
  inputText: string
  setInputText: (v: string) => void
  selectedTags: Set<string>
  isAnalysing: boolean
  error: string | null
  onAnalyse: () => void
  onEmotionTag: (tag: string) => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '1px solid rgba(196,152,90,0.3)',
            marginBottom: '1.5rem',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3.5" stroke="#c4985a" strokeWidth="1.2"/>
              <path d="M9 1v3M9 14v3M1 9h3M14 9h3" stroke="#c4985a" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: '#e8e0d4',
            margin: 0,
            lineHeight: 1.1,
          }}>
            The Shadow
          </h1>
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.8125rem',
            color: '#7a6e60',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Archetype Analysis
          </p>
        </div>

        <p style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: '1.25rem',
          fontStyle: 'italic',
          color: '#b8aa98',
          marginBottom: '1.25rem',
          textAlign: 'center',
          fontWeight: 300,
        }}>
          What have you been feeling or noticing lately?
        </p>

        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onAnalyse() }}
          placeholder="I've been feeling…"
          disabled={isAnalysing}
          rows={5}
          style={{
            width: '100%',
            background: '#15130f',
            border: '1px solid rgba(196,152,90,0.15)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            color: '#e8e0d4',
            fontSize: '1rem',
            lineHeight: 1.7,
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
            fontFamily: 'var(--font-geist-sans)',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(196,152,90,0.4)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(196,152,90,0.15)' }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.875rem' }}>
          {EMOTION_TAGS.map(tag => {
            const active = selectedTags.has(tag)
            return (
              <button
                key={tag}
                onClick={() => onEmotionTag(tag)}
                disabled={isAnalysing}
                style={{
                  padding: '0.3rem 0.875rem',
                  background: active ? 'rgba(196,152,90,0.15)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(196,152,90,0.6)' : 'rgba(196,152,90,0.2)'}`,
                  borderRadius: '100px',
                  color: active ? '#c4985a' : '#9a8e7e',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-geist-sans)',
                }}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {error && (
          <p style={{ color: '#c46060', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>
        )}

        <button
          onClick={onAnalyse}
          disabled={isAnalysing || (!inputText.trim() && selectedTags.size === 0)}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.875rem',
            background: isAnalysing || (!inputText.trim() && selectedTags.size === 0) ? 'rgba(196,152,90,0.08)' : 'rgba(196,152,90,0.12)',
            border: '1px solid rgba(196,152,90,0.35)',
            borderRadius: '8px',
            color: isAnalysing || (!inputText.trim() && selectedTags.size === 0) ? '#7a6e60' : '#c4985a',
            fontSize: '0.9375rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: isAnalysing || (!inputText.trim() && selectedTags.size === 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-geist-sans)',
          }}
        >
          {isAnalysing ? 'Reading the shadow…' : 'Analyse'}
        </button>

        <p style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#4a4338',
          letterSpacing: '0.03em',
        }}>
          ⌘ + Enter to submit
        </p>
      </div>
    </div>
  )
}

// ─── Card View ────────────────────────────────────────────────────────────────

function CardView({
  analysis,
  onReset,
  onGoDeeper,
}: {
  analysis: AnalysisResult
  onReset: () => void
  onGoDeeper: () => void
}) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#4a4338',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            padding: '0 0 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'color 0.15s',
            fontFamily: 'var(--font-geist-sans)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#7a6e60' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a4338' }}
        >
          ← Start over
        </button>

        <div style={{
          background: '#15130f',
          border: '1px solid rgba(196,152,90,0.15)',
          borderRadius: '12px',
          padding: '2.5rem',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#c4985a',
              marginBottom: '0.5rem',
              fontFamily: 'var(--font-geist-sans)',
            }}>
              Your Archetype
            </p>
            <h2 style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.2rem, 5vw, 3rem)',
              fontWeight: 600,
              color: '#e8e0d4',
              margin: 0,
              lineHeight: 1.05,
            }}>
              {analysis.archetypeName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ color: '#4a4338', fontSize: '0.875rem' }}>↓</span>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.125rem',
                fontStyle: 'italic',
                color: '#7a6e60',
                margin: 0,
                fontWeight: 400,
              }}>
                Shadow: {analysis.shadowName}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(196,152,90,0.1)', marginBottom: '2rem' }} />

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.75,
            color: '#b8aa98',
            margin: '0 0 2rem',
            fontFamily: 'var(--font-geist-sans)',
          }}>
            {analysis.matchReason}
          </p>

          <div style={{
            background: 'rgba(196,152,90,0.05)',
            border: '1px solid rgba(196,152,90,0.12)',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
          }}>
            <p style={{
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#c4985a',
              marginBottom: '0.625rem',
              fontFamily: 'var(--font-geist-sans)',
            }}>
              The deeper question
            </p>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.25rem',
              fontStyle: 'italic',
              color: '#e8e0d4',
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 300,
            }}>
              &ldquo;{analysis.deeperQuestion}&rdquo;
            </p>
          </div>

          <div>
            <p style={{
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7a6e60',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-geist-sans)',
            }}>
              Try this
            </p>
            <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {analysis.exercise.map((item, i) => (
                <li key={i} style={{
                  fontSize: '0.9375rem',
                  lineHeight: 1.65,
                  color: '#9a8e7e',
                  marginBottom: i < analysis.exercise.length - 1 ? '0.625rem' : 0,
                  fontFamily: 'var(--font-geist-sans)',
                }}>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div style={{ borderTop: '1px solid rgba(196,152,90,0.1)', marginTop: '2rem', paddingTop: '2rem' }}>
            <button
              onClick={onGoDeeper}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'rgba(196,152,90,0.08)',
                border: '1px solid rgba(196,152,90,0.3)',
                borderRadius: '8px',
                color: '#c4985a',
                fontSize: '0.9375rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-geist-sans)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(196,152,90,0.14)'
                e.currentTarget.style.borderColor = 'rgba(196,152,90,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(196,152,90,0.08)'
                e.currentTarget.style.borderColor = 'rgba(196,152,90,0.3)'
              }}
            >
              Go Deeper
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Dialogue View ─────────────────────────────────────────────────────────────

function DialogueView({
  analysis,
  onReset,
}: {
  analysis: AnalysisResult
  onReset: () => void
}) {
  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const seeded = useRef(false)
  const [reflection, setReflection] = useState<{ insight: string } | null>(null)
  const [isSummarising, setIsSummarising] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/shadow/chat' }),
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  // Seed the conversation with archetype context on first mount
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    const seed = `I just received this archetype reading:\n\nArchetype: ${analysis.archetypeName} (Shadow: ${analysis.shadowName})\n\n${analysis.matchReason}\n\nThe deeper question offered was: "${analysis.deeperQuestion}"\n\nI'd like to explore this further.`
    sendMessage({ text: seed })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, reflection])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInputValue('')
  }

  const handleSummary = async () => {
    if (isSummarising || messages.length < 2) return
    setSummaryError(null)
    setIsSummarising(true)
    try {
      // Extract text content from AI SDK UIMessage format
      const formatted = messages.map(msg => {
        const textPart = msg.parts?.find((p) => p.type === 'text') as { type: 'text'; text: string } | undefined
        return { role: msg.role, content: textPart?.text ?? '' }
      }).filter(m => m.content.trim())

      const res = await fetch('/api/shadow/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: formatted, archetypeName: analysis.archetypeName }),
      })
      if (!res.ok) throw new Error('Summary failed')
      const data = await res.json()
      setReflection({ insight: data.insight })
    } catch {
      setSummaryError('Could not generate summary. Try again.')
    } finally {
      setIsSummarising(false)
    }
  }

  const escapeHtml = (str: string) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

  const handleDownload = (insight: string, archetypeName: string) => {
    const safeArchetype = escapeHtml(archetypeName)
    const safeInsight = escapeHtml(insight)
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>The Shadow – Session Reflection</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html { background: #0c0b09; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 0; }
    body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      background: #0c0b09;
      color: #e8e0d4;
      max-width: 560px;
      margin: 0 auto;
      padding: 4rem 2rem;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      html, body { background: #0c0b09 !important; color: #e8e0d4 !important; }
    }
    .mark {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      margin-bottom: 2.5rem;
    }
    .mark-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid rgba(196,152,90,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .mark-label {
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #7a6e60;
      font-family: Georgia, serif;
    }
    h1 {
      font-size: 2.75rem;
      font-weight: 300;
      letter-spacing: 0.01em;
      color: #e8e0d4;
      line-height: 1;
      margin-bottom: 0.375rem;
    }
    .date {
      font-size: 0.875rem;
      color: #7a6e60;
      font-style: italic;
      margin-bottom: 3rem;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: linear-gradient(to right, rgba(196,152,90,0.4), transparent);
      margin-bottom: 3rem;
    }
    .label {
      font-size: 0.65rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c4985a;
      margin-bottom: 0.5rem;
      font-family: Georgia, serif;
    }
    .archetype {
      font-size: 1.5rem;
      font-weight: 600;
      color: #e8e0d4;
      margin-bottom: 2.5rem;
      letter-spacing: 0.01em;
    }
    .insight {
      font-size: 1.375rem;
      font-style: italic;
      font-weight: 300;
      line-height: 1.8;
      color: #b8aa98;
      margin-bottom: 3.5rem;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(196,152,90,0.2);
    }
    .footer-text {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #4a4338;
      font-family: Georgia, serif;
    }
  </style>
</head>
<body>
  <div class="mark">
    <div class="mark-circle">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="2" stroke="#c4985a" stroke-width="1"/>
        <line x1="5" y1="0" x2="5" y2="2.2" stroke="#c4985a" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
        <line x1="5" y1="7.8" x2="5" y2="10" stroke="#c4985a" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
        <line x1="0" y1="5" x2="2.2" y2="5" stroke="#c4985a" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
        <line x1="7.8" y1="5" x2="10" y2="5" stroke="#c4985a" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>
      </svg>
    </div>
    <span class="mark-label">The Shadow</span>
  </div>
  <h1>Session<br>Reflection</h1>
  <p class="date">${date}</p>
  <div class="divider"></div>
  <p class="label">Archetype</p>
  <p class="archetype">${safeArchetype}</p>
  <p class="label">What emerged</p>
  <p class="insight">${safeInsight}</p>
  <div class="footer">
    <div class="mark-circle" style="width:18px;height:18px;">
      <svg width="7" height="7" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="2" stroke="#c4985a" stroke-width="1.2"/>
      </svg>
    </div>
    <span class="footer-text">Generated by The Shadow</span>
  </div>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`)
    win.document.close()
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '640px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', position: 'sticky', top: 0, zIndex: 10, background: '#0c0b09', paddingTop: '1rem', paddingBottom: '1rem', marginTop: '-1rem' }}>
          <button
            onClick={onReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#4a4338',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.15s',
              fontFamily: 'var(--font-geist-sans)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#7a6e60' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4a4338' }}
          >
            ← Start over
          </button>
          <button
            onClick={handleSummary}
            disabled={isSummarising || messages.length < 2}
            style={{
              background: 'none',
              border: '1px solid rgba(196,152,90,0.25)',
              borderRadius: '6px',
              color: isSummarising ? '#4a4338' : '#7a6e60',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.3rem 0.75rem',
              cursor: isSummarising || messages.length < 2 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-geist-sans)',
            }}
            onMouseEnter={e => { if (!isSummarising) e.currentTarget.style.borderColor = 'rgba(196,152,90,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(196,152,90,0.25)' }}
          >
            {isSummarising ? 'Reading…' : 'Summary'}
          </button>
          {summaryError && (
            <p style={{
              fontSize: '0.7rem',
              color: '#c46060',
              fontFamily: 'var(--font-geist-sans)',
            }}>
              {summaryError}
            </p>
          )}
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: '#7a6e60',
            margin: 0,
          }}>
            {analysis.archetypeName}
          </p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {messages.map((msg) => {
            const textPart = (msg.parts?.find((p) => p.type === 'text') as { type: 'text'; text: string } | undefined)
            const text = textPart?.text ?? ''
            const isUser = msg.role === 'user'
            // Hide the seeded first user message
            if (isUser && messages.indexOf(msg) === 0) return null
            return (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.875rem 1.125rem',
                  borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: isUser ? 'rgba(196,152,90,0.1)' : '#15130f',
                  border: `1px solid ${isUser ? 'rgba(196,152,90,0.2)' : 'rgba(196,152,90,0.08)'}`,
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: isUser ? '#c4985a' : '#b8aa98',
                  fontFamily: 'var(--font-geist-sans)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {text}
                </div>
              </div>
            )
          })}
          {isStreaming && messages[messages.length - 1]?.role === 'user' && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '0.875rem 1.125rem',
                borderRadius: '12px 12px 12px 4px',
                background: '#15130f',
                border: '1px solid rgba(196,152,90,0.08)',
                color: '#4a4338',
                fontSize: '0.875rem',
                fontStyle: 'italic',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                …
              </div>
            </div>
          )}
          {reflection && (
            <div style={{
              background: '#0f0e0b',
              border: '1px solid rgba(196,152,90,0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '0.5rem',
            }}>
              <p style={{
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#c4985a',
                marginBottom: '0.75rem',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                ✦ Session Reflection
              </p>
              <p style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#4a4338',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-geist-sans)',
              }}>
                {analysis.archetypeName}
              </p>
              <p style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '1.125rem',
                fontStyle: 'italic',
                color: '#b8aa98',
                lineHeight: 1.75,
                margin: '0 0 1.25rem',
                fontWeight: 300,
              }}>
                {reflection.insight}
              </p>
              <button
                onClick={() => handleDownload(reflection.insight, analysis.archetypeName)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(196,152,90,0.25)',
                  borderRadius: '6px',
                  color: '#7a6e60',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.3rem 0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-geist-sans)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(196,152,90,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(196,152,90,0.25)' }}
              >
                Download
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend() }}
            placeholder="Respond…"
            disabled={isStreaming}
            rows={2}
            style={{
              flex: 1,
              background: '#15130f',
              border: '1px solid rgba(196,152,90,0.15)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: '#e8e0d4',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              fontFamily: 'var(--font-geist-sans)',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(196,152,90,0.4)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(196,152,90,0.15)' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            style={{
              padding: '0.75rem 1.25rem',
              background: !inputValue.trim() || isStreaming ? 'rgba(196,152,90,0.05)' : 'rgba(196,152,90,0.12)',
              border: '1px solid rgba(196,152,90,0.3)',
              borderRadius: '8px',
              color: !inputValue.trim() || isStreaming ? '#4a4338' : '#c4985a',
              fontSize: '0.875rem',
              letterSpacing: '0.04em',
              cursor: !inputValue.trim() || isStreaming ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-geist-sans)',
              flexShrink: 0,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
