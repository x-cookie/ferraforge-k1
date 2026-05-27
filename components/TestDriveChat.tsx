'use client'

import { useState, useRef, useEffect } from 'react'
import { Skill } from '@/lib/skills'

type Msg = { role: 'user' | 'assistant'; content: string }

function buildSystem(skill: Skill): string {
  return `You are Claude, an AI assistant from Anthropic. The user is evaluating a Claude Code skill called "${skill.title}" before installing it into their project.

Skill details:
- Title: ${skill.title}
- Category: ${skill.cat}
- Difficulty: ${skill.diff}
- Stack tags: ${skill.tags.join(', ')}
- Description: ${skill.desc}
- Snippet: ${skill.snippet}

Answer concisely (under 180 words). Focus on practical use cases, how this skill improves Claude Code sessions, and when to use it. Use code examples only when genuinely helpful.`
}

const PRESETS: Record<string, string[]> = {
  default: [
    'What does this skill actually do?',
    'When would Forge auto-select it?',
    'Show me a usage example',
    'Is this beginner-friendly?',
  ],
}

function getPresets(skill: Skill): string[] {
  return [
    `What does ${skill.title} do exactly?`,
    'When would this get auto-selected?',
    'Show me a usage example',
    skill.diff === 'advanced' ? 'Is this hard to use?' : 'Can beginners use this?',
  ]
}

function ClaudeLogo({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-label="Claude">
      <rect width="24" height="24" rx="6" fill="#E05C15"/>
      <path d="M7 8h10M7 12h6M7 16h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function TestDriveChat({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setMsgs([])
      setInput('')
      setBusy(false)
    }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || busy) return
    setInput('')

    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next)
    setBusy(true)

    try {
      const res = await fetch('/api/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: buildSystem(skill) },
            ...next,
          ],
        }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'assistant', content: data.content ?? 'No response.' }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setBusy(false)
    }
  }

  const presets = getPresets(skill)

  return (
    <>
      {/* Sidebar trigger card */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', background: 'var(--white)' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <ClaudeLogo size={20} />
          <div>
            <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 13 }}>Ask Claude</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>about this skill</div>
          </div>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 14 }}>
            Ask Claude anything about <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{skill.title}</strong> before adding it to your project.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {presets.slice(0, 3).map(q => (
              <button
                key={q}
                onClick={() => { setOpen(true); setTimeout(() => send(q), 120) }}
                style={{
                  textAlign: 'left', padding: '7px 10px', background: 'var(--bg2)',
                  border: '1px solid var(--border)', borderRadius: 8, fontSize: 12,
                  color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--orange)' }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
              >
                {q}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
            onClick={() => setOpen(true)}
          >
            Start conversation →
          </button>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
          style={{ alignItems: 'flex-end', padding: 0 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg)',
              borderRadius: '18px 18px 0 0',
              width: '100%',
              maxWidth: 600,
              margin: '0 auto',
              height: '82vh',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)',
              borderBottom: 'none',
              boxShadow: '0 -24px 80px rgba(0,0,0,0.18)',
              animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--white)',
              borderRadius: '18px 18px 0 0',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ClaudeLogo size={28} />
                <div>
                  <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 14 }}>Claude</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                    answering about <span style={{ color: 'var(--orange)' }}>{skill.title}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'transparent', border: '1px solid var(--border)',
                  width: 30, height: 30, borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, color: 'var(--muted)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {msgs.length === 0 && !busy ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '32px 0', textAlign: 'center' }}>
                  <ClaudeLogo size={44} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                      Ask me anything about
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--orange)', fontStyle: 'italic', fontFamily: 'var(--font-instrument-serif), Instrument Serif, serif' }}>
                      {skill.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 8 }}>
                    {presets.map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="cat-chip"
                        style={{ fontSize: 12 }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      {m.role === 'assistant' && (
                        <div style={{ flexShrink: 0, marginTop: 2 }}><ClaudeLogo size={22} /></div>
                      )}
                      <div style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: m.role === 'user' ? 'var(--text)' : 'var(--white)',
                        color: m.role === 'user' ? '#fff' : 'var(--text)',
                        border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                        fontSize: 13.5,
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {busy && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}><ClaudeLogo size={22} /></div>
                      <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: 'var(--white)', border: '1px solid var(--border)', display: 'flex', gap: 4, alignItems: 'center' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--white)', flexShrink: 0 }}>
              <form
                onSubmit={e => { e.preventDefault(); send() }}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Ask about ${skill.title}...`}
                  disabled={busy}
                  className="input-field"
                  style={{ flex: 1, padding: '11px 14px' }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={busy || !input.trim()}
                  style={{ padding: '11px 18px', fontSize: 16 }}
                >
                  ↑
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
