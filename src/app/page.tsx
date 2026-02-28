'use client'

import { useEffect, useRef, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'

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
  jungSaid: string
  invitation: string
}

type AppState = 'input' | 'card' | 'dialogue'

// ─── Session ──────────────────────────────────────────────────────────────────

const SHADOW_COOKIE = 'shadow-session'

function getShadowSession(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${SHADOW_COOKIE}=([^;]*)`))
  if (match) return decodeURIComponent(match[1])
  const id = crypto.randomUUID()
  document.cookie = `${SHADOW_COOKIE}=${id}; path=/; samesite=lax`
  return id
}

// ─── Emotion Tags ─────────────────────────────────────────────────────────────

const EMOTION_TAGS = ['Lonely', 'Irritable', 'Judgmental', 'Overwhelmed', 'Empty', 'Stuck']

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ShadowPage() {
  const [appState, setAppState] = useState<AppState>('input')
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [dialogueSeeded, setDialogueSeeded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSessionId(getShadowSession())
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/shadow/chat' }),
  })

  const isChatLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    if (!analysis || !sessionId) return
    setAppState('dialogue')
    if (!dialogueSeeded) {
      setDialogueSeeded(true)
      const seed = `I just received my shadow archetype reading.

Archetype: ${analysis.archetypeName} — shadow: ${analysis.shadowName}

${analysis.matchReason}

The question that surfaced: "${analysis.deeperQuestion}"

I'd like to explore this.`
      sendMessage({ text: seed })
    }
  }

  const handleReset = () => {
    setAppState('input')
    setAnalysis(null)
    setInputText('')
    setSelectedTags(new Set())
    setError(null)
    setDialogueSeeded(false)
    const id = crypto.randomUUID()
    document.cookie = `${SHADOW_COOKIE}=${id}; path=/; samesite=lax`
    setSessionId(id)
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
        overflow: 'hidden',
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
            onGoDeeper={handleGoDeeper}
            onReset={handleReset}
          />
        )}
        {appState === 'dialogue' && analysis && (
          <DialogueView
            analysis={analysis}
            messages={messages}
            isLoading={isChatLoading}
            onSend={(text) => sendMessage({ text })}
            onReset={handleReset}
            messagesEndRef={messagesEndRef}
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
            Jungian Archetype Analysis
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
  onGoDeeper,
  onReset,
}: {
  analysis: AnalysisResult
  onGoDeeper: () => void
  onReset: () => void
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
          onMouseEnter={e => { (e.currentTarget).style.color = '#7a6e60' }}
          onMouseLeave={e => { (e.currentTarget).style.color = '#4a4338' }}
        >
          ← Start over
        </button>

        <div style={{
          background: '#15130f',
          border: '1px solid rgba(196,152,90,0.15)',
          borderRadius: '12px',
          padding: '2.5rem',
          marginBottom: '1.5rem',
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
        </div>

        <button
          onClick={onGoDeeper}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'rgba(196,152,90,0.1)',
            border: '1px solid rgba(196,152,90,0.3)',
            borderRadius: '8px',
            color: '#c4985a',
            fontSize: '1.125rem',
            letterSpacing: '0.02em',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(196,152,90,0.16)'
            e.currentTarget.style.borderColor = 'rgba(196,152,90,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(196,152,90,0.1)'
            e.currentTarget.style.borderColor = 'rgba(196,152,90,0.3)'
          }}
        >
          Go deeper →
        </button>
      </div>
    </div>
  )
}

// ─── Dialogue View ────────────────────────────────────────────────────────────

function DialogueView({
  analysis,
  messages,
  isLoading,
  onSend,
  onReset,
  messagesEndRef,
}: {
  analysis: AnalysisResult
  messages: ReturnType<typeof useChat>['messages']
  isLoading: boolean
  onSend: (text: string) => void
  onReset: () => void
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}) {
  const [chatInput, setChatInput] = useState('')

  const handleSubmit = () => {
    if (!chatInput.trim() || isLoading) return
    onSend(chatInput)
    setChatInput('')
  }

  // Skip the seeded first user message
  const displayMessages = messages.slice(1)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid rgba(196,152,90,0.1)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(12,11,9,0.8)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        <div>
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#c4985a',
            margin: 0,
            fontFamily: 'var(--font-geist-sans)',
          }}>
            Exploring
          </p>
          <h2 style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.375rem',
            fontWeight: 500,
            color: '#e8e0d4',
            margin: 0,
          }}>
            {analysis.archetypeName}
            <span style={{ color: '#4a4338', fontStyle: 'italic', fontWeight: 300 }}>
              {' '}/ {analysis.shadowName}
            </span>
          </h2>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: '1px solid rgba(196,152,90,0.15)',
            borderRadius: '6px',
            color: '#4a4338',
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '0.4rem 0.875rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'var(--font-geist-sans)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#7a6e60'
            e.currentTarget.style.borderColor = 'rgba(196,152,90,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#4a4338'
            e.currentTarget.style.borderColor = 'rgba(196,152,90,0.15)'
          }}
        >
          End
        </button>
      </header>

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {displayMessages.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: '1.125rem',
              fontStyle: 'italic',
              color: '#4a4338',
              textAlign: 'center',
            }}>
              {isLoading ? 'The shadow speaks…' : 'Beginning the descent…'}
            </p>
          </div>
        )}

        {displayMessages.map(message => {
          const isUser = message.role === 'user'
          const textPart = message.parts?.find((p) => p.type === 'text') as { type: 'text'; text: string } | undefined
          const text = textPart?.text ?? ''
          if (!text) return null
          return (
            <div key={message.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%',
                padding: isUser ? '0.75rem 1.125rem' : '1rem 0',
                background: isUser ? 'rgba(196,152,90,0.08)' : 'transparent',
                border: isUser ? '1px solid rgba(196,152,90,0.15)' : 'none',
                borderRadius: isUser ? '12px 12px 4px 12px' : '0',
                borderLeft: !isUser ? '2px solid rgba(196,152,90,0.2)' : undefined,
                paddingLeft: !isUser ? '1.25rem' : undefined,
              }}>
                <p style={{
                  margin: 0,
                  lineHeight: 1.75,
                  color: isUser ? '#b8aa98' : '#d4c9b8',
                  fontFamily: isUser ? 'var(--font-geist-sans)' : 'var(--font-cormorant)',
                  fontSize: isUser ? '0.9375rem' : '1.125rem',
                  fontWeight: isUser ? 400 : 300,
                }}>
                  {text}
                </p>
              </div>
            </div>
          )
        })}

        {isLoading && displayMessages.length > 0 && (
          <div style={{ paddingLeft: '1.25rem', borderLeft: '2px solid rgba(196,152,90,0.2)' }}>
            <span style={{ color: '#4a4338', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}>
              thinking…
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      <footer style={{
        borderTop: '1px solid rgba(196,152,90,0.1)',
        padding: '1rem 1.5rem',
        background: 'rgba(12,11,9,0.8)',
        backdropFilter: 'blur(8px)',
        flexShrink: 0,
      }}>
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-end',
        }}>
          <textarea
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="Say something…"
            disabled={isLoading}
            rows={1}
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
              fontFamily: 'var(--font-geist-sans)',
              minHeight: '44px',
              maxHeight: '120px',
              overflowY: 'auto',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(196,152,90,0.35)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(196,152,90,0.15)' }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !chatInput.trim()}
            style={{
              padding: '0 1.25rem',
              background: 'rgba(196,152,90,0.12)',
              border: '1px solid rgba(196,152,90,0.3)',
              borderRadius: '8px',
              color: isLoading || !chatInput.trim() ? '#4a4338' : '#c4985a',
              fontSize: '0.875rem',
              cursor: isLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              letterSpacing: '0.04em',
              fontFamily: 'var(--font-geist-sans)',
              flexShrink: 0,
              height: '44px',
            }}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  )
}
