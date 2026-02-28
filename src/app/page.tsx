'use client'

import { useEffect, useState } from 'react'
import { Cormorant_Garamond } from 'next/font/google'

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

type AppState = 'input' | 'card'

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

  const handleReset = () => {
    setAppState('input')
    setAnalysis(null)
    setInputText('')
    setSelectedTags(new Set())
    setError(null)
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
  onReset,
}: {
  analysis: AnalysisResult
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
        </div>
      </div>
    </div>
  )
}
