'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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

Answer concisely (under 180 words). Focus on practical use cases. Format your answer with markdown — use **bold** for emphasis, \`inline code\` for code references, and fenced code blocks for examples.`
}

function getPresets(skill: Skill): string[] {
  return [
    `What does ${skill.title} do exactly?`,
    'When would this get auto-selected?',
    'Show me a usage example',
    skill.diff === 'advanced' ? 'Is this hard to use?' : 'Can beginners use this?',
  ]
}

/* ── Claude icon — the actual Claude mark (C with terminal dots) ─────────── */
function ClaudeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-label="Claude">
      <rect width="32" height="32" rx="8" fill="#DA7756" />
      {/* Stylised C arc with endpoints */}
      <path
        d="M22 9.5C19.5 7.8 16.5 7 13.5 7.5C9.2 8.3 6 12 6 16.5C6 21.3 9.5 25.2 14.2 25.9C17.1 26.3 19.9 25.4 22 23.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="22" cy="9.5" r="1.8" fill="white" />
      <circle cx="22" cy="23.5" r="1.8" fill="white" />
    </svg>
  )
}

/* ── Markdown renderer ───────────────────────────────────────────────────── */
function MsgContent({ text }: { text: string }) {
  const segments = text.split(/(```[\w]*\n[\s\S]*?```|```[\s\S]*?```)/g)

  return (
    <div style={{ fontSize: 13.5, lineHeight: 1.75 }}>
      {segments.map((seg, si) => {
        if (seg.startsWith('```')) {
          const firstNl = seg.indexOf('\n')
          const code = firstNl === -1
            ? seg.slice(3).replace(/```$/, '').trim()
            : seg.slice(firstNl + 1).replace(/```$/, '').trimEnd()
          return (
            <pre key={si} style={{
              background: 'rgba(0,0,0,0.07)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: 8,
              padding: '10px 13px',
              margin: '8px 0',
              fontSize: 12,
              fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
              overflowX: 'auto',
              whiteSpace: 'pre',
              lineHeight: 1.65,
              color: 'var(--text)',
            }}>
              {code}
            </pre>
          )
        }

        return (
          <span key={si}>
            {seg.split('\n').map((line, li) => {
              const isBullet = /^[-*] /.test(line)
              const content = isBullet ? line.slice(2) : line

              const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, pi) => {
                if (p.startsWith('**') && p.endsWith('**'))
                  return <strong key={pi}>{p.slice(2, -2)}</strong>
                if (p.startsWith('`') && p.endsWith('`'))
                  return (
                    <code key={pi} style={{
                      background: 'rgba(0,0,0,0.09)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontSize: '0.88em',
                      fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
                    }}>{p.slice(1, -1)}</code>
                  )
                return p
              })

              return (
                <React.Fragment key={li}>
                  {li > 0 && <br />}
                  {isBullet
                    ? <span style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--orange)', flexShrink: 0, lineHeight: 1.75 }}>•</span>
                        <span>{parts}</span>
                      </span>
                    : parts}
                </React.Fragment>
              )
            })}
          </span>
        )
      })}
    </div>
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
      document.body.style.overflow = 'hidden'
    } else {
      setMsgs([])
      setInput('')
      setBusy(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, busy])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

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
          messages: [{ role: 'system', content: buildSystem(skill) }, ...next],
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
          <ClaudeIcon size={20} />
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
                onClick={() => { setOpen(true); setTimeout(() => send(q), 150) }}
                style={{
                  textAlign: 'left', padding: '7px 10px', background: 'var(--bg2)',
                  border: '1px solid var(--border)', borderRadius: 8, fontSize: 12,
                  color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseOver={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--orange)'; b.style.color = 'var(--orange)' }}
                onMouseOut={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--border)'; b.style.color = 'var(--muted)' }}
              >
                {q}
              </button>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={() => setOpen(true)}>
            Start conversation →
          </button>
        </div>
      </div>

      {/* MODAL — portaled to document.body */}
      {open && createPortal(
        <div className="dialog-backdrop" onClick={() => setOpen(false)}>
          <div
            className="dialog-panel"
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 560, height: 'min(82vh, 660px)', display: 'flex', flexDirection: 'column' }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0, borderRadius: '20px 20px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ClaudeIcon size={28} />
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
              >×</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {msgs.length === 0 && !busy ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '32px 0', textAlign: 'center' }}>
                  <ClaudeIcon size={48} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Ask me anything about</div>
                    <div style={{ fontSize: 14, color: 'var(--orange)', fontStyle: 'italic', fontFamily: 'var(--font-instrument-serif), Instrument Serif, serif' }}>
                      {skill.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 8 }}>
                    {presets.map(q => (
                      <button key={q} onClick={() => send(q)} className="cat-chip" style={{ fontSize: 12 }}>{q}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {msgs.map((m, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                    }}>
                      {m.role === 'assistant' && <div style={{ flexShrink: 0, marginTop: 2 }}><ClaudeIcon size={22} /></div>}
                      <div style={{
                        maxWidth: '82%',
                        padding: '10px 14px',
                        borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: m.role === 'user' ? 'var(--text)' : 'var(--bg2)',
                        color: m.role === 'user' ? '#fff' : 'var(--text)',
                        border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                      }}>
                        {m.role === 'assistant' ? <MsgContent text={m.content} /> : (
                          <span style={{ fontSize: 13.5, lineHeight: 1.7 }}>{m.content}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {busy && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}><ClaudeIcon size={22} /></div>
                      <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 4px', background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
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
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0, borderRadius: '0 0 20px 20px' }}>
              <form onSubmit={e => { e.preventDefault(); send() }} style={{ display: 'flex', gap: 8 }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Ask about ${skill.title}...`}
                  disabled={busy}
                  className="input-field"
                  style={{ flex: 1, padding: '11px 14px' }}
                />
                <button type="submit" className="btn-primary" disabled={busy || !input.trim()} style={{ padding: '11px 18px', fontSize: 16 }}>
                  ↑
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
