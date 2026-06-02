'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageWrapper from './PageWrapper'
import Reveal from './Reveal'
import TestDriveChat from './TestDriveChat'
import Toast from './Toast'
import { Skill, SKILLS, toSlug } from '@/lib/skills'

const DIFF_COLOR: Record<string, string> = {
  beginner: '#16A34A',
  intermediate: '#D97706',
  advanced: '#DC2626',
}
const DIFF_BG: Record<string, string> = {
  beginner: '#F0FDF4',
  intermediate: '#FFFBEB',
  advanced: '#FFF1F2',
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setToastVisible(true)
    setTimeout(() => setCopied(false), 1800)
    setTimeout(() => setToastVisible(false), 2400)
  }

  return (
    <>
      <button className="btn-dark" onClick={copy} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {copied ? (
          <>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,9 6,13 14,3"/>
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="9" height="9" rx="1.5"/>
              <path d="M11 11v2a1.5 1.5 0 01-1.5 1.5H2A1.5 1.5 0 01.5 13V5A1.5 1.5 0 012 3.5h2"/>
            </svg>
            {label}
          </>
        )}
      </button>
      <Toast visible={toastVisible} message="Skill snippet copied to clipboard" />
    </>
  )
}

function SnippetLine({ line }: { line: string }) {
  if (line.startsWith('## ')) return <span style={{ color: '#E05C15', fontWeight: 700 }}>{line}{'\n'}</span>
  if (line.startsWith('- ') || line.startsWith('* ')) return <span style={{ color: '#22C55E' }}>{line}{'\n'}</span>
  if (line.startsWith('#')) return <span style={{ color: '#7AB8F5' }}>{line}{'\n'}</span>
  if (/^\d+\./.test(line)) return <span style={{ color: '#A78BFA' }}>{line}{'\n'}</span>
  if (line.startsWith('//') || line.startsWith('{')) return <span style={{ color: '#555' }}>{line}{'\n'}</span>
  return <span>{line}{'\n'}</span>
}

type Props = {
  skill: Skill
  related: Skill[]
  prev: Skill | null
  next: Skill | null
}

export default function SkillDetailPage({ skill, related, prev, next }: Props) {
  const totalInCat = SKILLS.filter(s => s.cat === skill.cat).length
  const posInCat = SKILLS.filter(s => s.cat === skill.cat).findIndex(s => s.id === skill.id) + 1
  const lines = skill.snippet.split('\n')

  return (
    <PageWrapper>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <Image src="/ferra-mascot.jpeg" alt="Ferra" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <span className="nav-logo-text">Ferra<span className="orange">.forge</span></span>
          </Link>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/skills" className="nav-link">Skills Library</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <div className="nav-spacer" />
          <a href="https://x.com/ferraforge" target="_blank" rel="noopener noreferrer" className="nav-icon-link" aria-label="X / Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://github.com/x-cookie/ferraforge-k1" target="_blank" rel="noopener noreferrer" className="nav-icon-link" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          </a>
          <Link href="/" className="nav-cta">Start Forging →</Link>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '10px 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)' }}>Home</Link>
            <span style={{ color: 'var(--faint)' }}>/</span>
            <Link href="/skills" style={{ color: 'var(--muted)' }}>Skills Library</Link>
            <span style={{ color: 'var(--faint)' }}>/</span>
            <span style={{ color: 'var(--muted)' }}>{skill.cat}</span>
            <span style={{ color: 'var(--faint)' }}>/</span>
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{skill.title}</span>
          </div>
        </div>
      </div>

      {/* HERO — full width, dark */}
      <section style={{ background: 'var(--dark)', borderBottom: '1px solid #222', padding: '56px 28px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#2A2A24 1px, transparent 1px), linear-gradient(90deg, #2A2A24 1px, transparent 1px)',
          backgroundSize: '44px 44px', opacity: 0.4,
          maskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 0% 50%, black, transparent)',
          pointerEvents: 'none',
        }} aria-hidden="true" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }} className="hero-up-0">
            <span className="badge badge-cat">{skill.cat}</span>
            <span className="badge" style={{ background: DIFF_BG[skill.diff], color: DIFF_COLOR[skill.diff] }}>
              {skill.diff}
            </span>
            <span className="mono" style={{ fontSize: 11, color: '#777', letterSpacing: 1 }}>
              #{String(skill.id).padStart(2, '0')} · {posInCat} of {totalInCat} in category
            </span>
          </div>

          <h1 className="hero-up-1" style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 54px)', color: '#FAFAF7',
            lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 16,
          }}>
            {skill.title}
          </h1>

          <p className="hero-up-2" style={{ fontSize: 15.5, color: '#AEACA5', maxWidth: 580, lineHeight: 1.75, marginBottom: 22 }}>
            {skill.desc}
          </p>

          <div className="hero-up-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
            {skill.tags.map(t => (
              <span key={t} style={{
                padding: '3px 9px', borderRadius: 5, background: '#1C1C18',
                border: '1px solid #3A3A32', color: '#999', fontSize: 11.5,
                fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
              }}>{t}</span>
            ))}
          </div>

          <div className="hero-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary">Forge with this skill →</Link>
            <CopyButton text={skill.snippet} label="Copy snippet" />
          </div>
        </div>
      </section>

      {/* 2-COLUMN CONTENT */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 36, padding: '48px 28px 80px', alignItems: 'start' }}>

        {/* MAIN COLUMN */}
        <div style={{ minWidth: 0 }}>

          {/* Snippet */}
          <Reveal>
            <div style={{ marginBottom: 52 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <span className="section-label">Skill Content</span>
                  <h2 className="section-h">The CLAUDE.md<br /><em>snippet</em></h2>
                </div>
                <CopyButton text={skill.snippet} label="Copy snippet" />
              </div>

              <div className="code-block" style={{ fontSize: 13, padding: 0, overflow: 'hidden', lineHeight: 1.85 }}>
                <div style={{ padding: '10px 18px', background: '#1A1A15', borderBottom: '1px solid #2A2A24', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A3A30' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A3A30' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A3A30' }} />
                  <span className="mono" style={{ marginLeft: 10, fontSize: 11, color: '#444' }}>
                    skills/{toSlug(skill.title)}.md
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', padding: '18px 0' }}>
                  <div style={{ padding: '0 14px', borderRight: '1px solid #1E1E18', userSelect: 'none' }}>
                    {lines.map((_, i) => (
                      <div key={i} className="mono" style={{ fontSize: 12, color: '#2A2A2A', lineHeight: 1.85, textAlign: 'right' }}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '0 22px', overflow: 'auto' }}>
                    {lines.map((line, i) => <SnippetLine key={i} line={line} />)}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Activation cards */}
          <Reveal>
            <span className="section-label">Activation</span>
            <h2 className="section-h" style={{ marginBottom: 24 }}>When Forge<br /><em>selects this skill</em></h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 52 }}>
            <Reveal delay={1}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <div style={{ width: 38, height: 38, background: '#F0FDF4', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#16A34A" strokeWidth="1.5"/>
                    <path d="M7 10l2 2 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  Auto-selected when
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skill.tags.includes('universal') ? (
                    <span className="tag" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', color: '#16A34A' }}>
                      universal — always included
                    </span>
                  ) : skill.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <div style={{ width: 38, height: 38, background: 'var(--orange-light)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <path d="M5 5h10v10H5z" stroke="#E05C15" strokeWidth="1.5" rx="1.5"/>
                    <path d="M8 8h4M8 11h3" stroke="#E05C15" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  Manual installation
                </div>
                <ol style={{ paddingLeft: 16, fontSize: 13, color: 'var(--muted)', lineHeight: 2, listStyleType: 'decimal', margin: 0 }}>
                  <li>Copy the snippet above</li>
                  <li>Add to your <code style={{ background: 'var(--bg3)', padding: '1px 5px', borderRadius: 4, fontSize: 11, color: 'var(--orange)' }}>CLAUDE.md</code></li>
                  <li>Claude Code reads it next session</li>
                </ol>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <div style={{ width: 38, height: 38, background: '#EFF6FF', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    <path d="M10 2l2.4 6H18l-5 3.6 2 6L10 14l-5 3.6 2-6L2 8h5.6z" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  Scoring weight
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    ['Tag match (per tag)', '+1.0', 'var(--text)'],
                    ['Universal bonus', skill.tags.includes('universal') ? '+0.3' : '—', skill.tags.includes('universal') ? '#16A34A' : '#555'],
                    ['Max score', (skill.tags.filter(t => t !== 'universal').length + (skill.tags.includes('universal') ? 0.3 : 0)).toFixed(1), 'var(--orange)'],
                  ].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', background: 'var(--bg2)', borderRadius: 7, border: '1px solid var(--border)' }}>
                      <span>{l}</span>
                      <span className="mono" style={{ color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Prev / Next */}
          {(prev || next) && (
            <Reveal>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {prev ? (
                  <Link href={`/skills/${toSlug(prev.title)}`} style={{ textDecoration: 'none' }}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg2)', transition: 'border-color .2s, background .2s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--white)' }}
                      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: 1, marginBottom: 5 }}>← PREVIOUS</div>
                      <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 13.5 }}>{prev.title}</div>
                    </div>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/skills/${toSlug(next.title)}`} style={{ textDecoration: 'none' }}>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg2)', textAlign: 'right', transition: 'border-color .2s, background .2s' }}
                      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--white)' }}
                      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: 1, marginBottom: 5 }}>NEXT →</div>
                      <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 13.5 }}>{next.title}</div>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </Reveal>
          )}
        </div>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 76, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Stats card */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--white)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
              <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: 1.5, textTransform: 'uppercase' }}>// skill stats</span>
            </div>
            <div style={{ padding: '4px 0' }}>
              {[
                { label: 'Category', value: skill.cat },
                { label: 'Difficulty', value: skill.diff, color: DIFF_COLOR[skill.diff] },
                { label: 'Stack tags', value: `${skill.tags.filter(t => t !== 'universal').length}` },
                { label: 'Universal', value: skill.tags.includes('universal') ? 'Yes' : 'No', color: skill.tags.includes('universal') ? '#16A34A' : 'var(--muted)' },
                { label: 'Snippet lines', value: `${lines.filter(l => l.trim()).length}` },
                { label: 'Position', value: `${posInCat} of ${totalInCat}` },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{row.label}</span>
                  <span className="mono" style={{ fontSize: 12, color: row.color || 'var(--text)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TestDrive */}
          <TestDriveChat skill={skill} />

          {/* Related skills */}
          {related.length > 0 && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 14, background: 'var(--white)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: 1.5, textTransform: 'uppercase' }}>// related skills</span>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {related.map(s => (
                  <Link key={s.id} href={`/skills/${toSlug(s.title)}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 10, transition: 'border-color .2s, background .2s', background: 'var(--bg2)' }}
                      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--orange)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--white)' }}
                      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg2)' }}>
                      <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 12.5, marginBottom: 3 }}>{s.title}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc.slice(0, 70)}…</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* FOOTER CTA */}
      <section style={{ padding: '56px 28px 64px', background: 'var(--dark)', borderTop: '1px solid #222' }}>
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <span className="section-label" style={{ color: 'var(--orange)' }}>// Ready to forge?</span>
              <h2 className="section-h" style={{ color: '#FAFAF7', marginBottom: 14 }}>
                Add <em style={{ color: 'var(--orange)' }}>{skill.title}</em><br />to your project
              </h2>
              <p style={{ color: '#999', fontSize: 14, lineHeight: 1.7, marginBottom: 26 }}>
                Forge auto-selects this skill along with 5–7 others tailored to your stack.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="btn-primary">Start Forging →</Link>
                <Link href="/skills" className="btn-outline" style={{ borderColor: '#2A2A24', color: '#888' }}>Browse all 59 skills</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ padding: '40px 28px', borderTop: '1px solid #1E1E18', background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 }}>
            {/* Brand */}
            <div>
              <div className="nav-logo" style={{ marginBottom: 10 }}>
                <Image src="/ferra-mascot.jpeg" alt="Ferra" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <span className="nav-logo-text" style={{ color: '#FAFAF7' }}>Ferra<span className="orange">.forge</span></span>
              </div>
              <p style={{ fontSize: 12.5, color: '#777', maxWidth: 240, lineHeight: 1.6, margin: 0 }}>
                {"Claude Code setup agent. 59 curated skills, forged for your stack."}
              </p>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: '#666', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Product</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Home</Link>
                  <Link href="/skills" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Skills Library</Link>
                  <Link href="/docs" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Docs</Link>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: '#666', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Built on</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="https://github.com/karpathy" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Karpathy</a>
                  <a href="https://github.com/yamadashy/repomix" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Repomix</a>
                  <a href="https://github.com/hesreallyhim/awesome-claude-code" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>Awesome Claude</a>
                </div>
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 20, borderTop: '1px solid #1E1E18' }}>
            <p style={{ fontSize: 11, color: '#555', textAlign: 'center', margin: 0 }}>
              Ferra &middot; claudemdforge.site &middot; Built with Karpathy wisdom, GitHub API &amp; Awesome Claude Skills
            </p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  )
}
