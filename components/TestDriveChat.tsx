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

/* ── Claude icon — real Anthropic Claude mark (starburst, from claude.ai) ── */
function ClaudeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="-5 -5 155 158" width={size} height={size} aria-label="Claude">
      <path
        transform="translate(-76,-224)"
        d="m 105.01,322.07 29.14,-16.35 0.49,-1.42 -0.49,-0.79 h -1.42 l -4.87,-0.3 -16.65,-0.45 -14.44,-0.6 -13.99,-0.75 -3.52,-0.75 -3.3,-4.35 0.34,-2.17 2.96,-1.99 4.24,0.37 9.37,0.64 14.06,0.97 10.2,0.6 15.11,1.57 h 2.4 l 0.34,-0.97 -0.82,-0.6 -0.64,-0.6 -14.55,-9.86 -15.75,-10.42 -8.25,-6 -4.46,-3.04 -2.25,-2.85 -0.97,-6.22 4.05,-4.46 5.44,0.37 1.39,0.37 5.51,4.24 11.77,9.11 15.37,11.32 2.25,1.87 0.9,-0.64 0.11,-0.45 -1.01,-1.69 -8.36,-15.11 -8.92,-15.37 -3.97,-6.37 -1.05,-3.82 c -0.37,-1.57 -0.64,-2.89 -0.64,-4.5 l 4.61,-6.26 2.55,-0.82 6.15,0.82 2.59,2.25 3.82,8.74 6.19,13.76 9.6,18.71 2.81,5.55 1.5,5.14 0.56,1.57 h 0.97 v -0.9 l 0.79,-10.54 1.46,-12.94 1.42,-16.65 0.49,-4.69 2.32,-5.62 4.61,-3.04 3.6,1.72 2.96,4.24 -0.41,2.74 -1.76,11.44 -3.45,17.92 -2.25,12 h 1.31 l 1.5,-1.5 6.07,-8.06 10.2,-12.75 4.5,-5.06 5.25,-5.59 3.37,-2.66 h 6.37 l 4.69,6.97 -2.1,7.2 -6.56,8.32 -5.44,7.05 -7.8,10.5 -4.87,8.4 0.45,0.67 1.16,-0.11 17.62,-3.75 9.52,-1.72 11.36,-1.95 5.14,2.4 0.56,2.44 -2.02,4.99 -12.15,3 -14.25,2.85 -21.22,5.02 -0.26,0.19 0.3,0.37 9.56,0.9 4.09,0.22 h 10.01 l 18.64,1.39 4.87,3.22 2.92,3.94 -0.49,3 -7.5,3.82 -10.12,-2.4 -23.62,-5.62 -8.1,-2.02 h -1.12 v 0.67 l 6.75,6.6 12.37,11.17 15.49,14.4 0.79,3.56 -1.99,2.81 -2.1,-0.3 -13.61,-10.24 -5.25,-4.61 -11.89,-10.01 h -0.79 v 1.05 l 2.74,4.01 14.47,21.75 0.75,6.67 -1.05,2.17 -3.75,1.31 -4.12,-0.75 -8.47,-11.89 -8.74,-13.39 -7.05,-12 -0.86,0.49 -4.16,44.81 -1.95,2.29 -4.5,1.72 -3.75,-2.85 -1.99,-4.61 1.99,-9.11 2.4,-11.89 1.95,-9.45 1.76,-11.74 1.05,-3.9 -0.07,-0.26 -0.86,0.11 -8.85,12.15 -13.46,18.19 -10.65,11.4 -2.55,1.01 -4.42,-2.29 0.41,-4.09 2.47,-3.64 14.74,-18.75 8.89,-11.62 5.74,-6.71 -0.04,-0.97 h -0.34 l -39.15,25.42 -6.97,0.9 -3,-2.81 0.37,-4.61 1.42,-1.5 11.77,-8.1 z"
        fill="#DA7756"
      />
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
      if (!res.ok) throw new Error(data.error ?? `API error ${res.status}`)
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '32px 0', textAlign: 'center' }}>
                  <ClaudeIcon size={48} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Ask me anything about</div>
                    <div style={{ fontSize: 14, color: 'var(--orange)', fontStyle: 'italic', fontFamily: 'var(--font-instrument-serif), Instrument Serif, serif' }}>
                      {skill.title}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--faint)', margin: 0 }}>Use the quick questions below or type your own</p>
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

            {/* Preset chips — always visible above input */}
            <div style={{ padding: '8px 16px 0', flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {presets.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={busy}
                  className="cat-chip"
                  style={{ fontSize: 11.5, opacity: busy ? 0.45 : 1, transition: 'opacity 0.2s' }}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 16px 12px', borderTop: '1px solid var(--border)', flexShrink: 0, borderRadius: '0 0 20px 20px', marginTop: 8 }}>
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
