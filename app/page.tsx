'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ForgeCard, { ForgeResult } from '@/components/ForgeCard'
import ResultPreview from '@/components/ResultPreview'
import PageWrapper from '@/components/PageWrapper'
import Reveal from '@/components/Reveal'
import { CATEGORIES } from '@/lib/skills'

const TAPE_ITEMS = [
  'CLAUDE.md', 'FERRA AGENT', 'PRE-COMMIT HOOKS', 'KARPATHY PRINCIPLES',
  'GITHUB API', 'TECH STACK DETECTION', 'SETUP GUIDE',
  "FERRA'S 59 SKILLS", 'CLAUDE CODE READY', 'SKILLS PACK',
]

function RepoSvgIcon({ variant }: { variant: number }) {
  const paths: Record<number, React.ReactNode> = {
    0: ( // Karpathy — radiant mind
      <>
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </>
    ),
    1: ( // Repomix — stacked layers
      <>
        <rect x="3" y="3" width="18" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="3" y="10" width="18" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <rect x="3" y="17" width="18" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      </>
    ),
    2: ( // Awesome Claude Skills — star
      <path d="M12 2l2.4 7.4H22l-6.3 4.6 2.4 7.4L12 17.2l-6.1 4.2 2.4-7.4L2 9.4h7.6z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    ),
    3: ( // Superpowers — lightning bolt
      <path d="M13 2L4 14h8l-1 8 9-12h-8z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    ),
    4: ( // ECC — code brackets
      <>
        <polyline points="16,18 22,12 16,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <polyline points="8,6 2,12 8,18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {paths[variant]}
    </svg>
  )
}

export default function HomePage() {
  const [forgeResult, setForgeResult] = useState<ForgeResult | null>(null)
  const forgeRef = useRef<HTMLElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function scrollToForge() {
    forgeRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleForgeComplete(result: ForgeResult) {
    setForgeResult(result)
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  return (
    <PageWrapper>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="nav-logo">
            <Image src="/ferra-mascot.jpeg" alt="Ferra" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <span className="nav-logo-text">Ferra<span className="orange">.forge</span></span>
          </div>
          <span className="nav-link active">Home</span>
          <Link href="/skills" className="nav-link">Skills Library</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <div className="nav-spacer" />
          <button className="nav-cta" onClick={scrollToForge}>Start Forging →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 28px 64px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <Reveal>
              <span className="section-label">AI Code Context Agent</span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="editorial-h" style={{ marginBottom: 26 }}>
                Meet Ferra.<br />
                Your Claude Code setup,<br />
                <em className="orange">forged in 30 seconds.</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: 38 }}>
                Ferra is an AI agent with 59 curated skills. Paste a GitHub URL or describe your
                stack — she scans your repo, maps your tech, and generates a production-ready
                CLAUDE.md tailored exactly to how you build.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={scrollToForge}>Try the Forge →</button>
                <Link href="/skills" className="btn-outline">Browse 59 Skills</Link>
              </div>
            </Reveal>
          </div>

          {/* STATS */}
          <Reveal style={{ marginTop: 72 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              padding: '32px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
            }}>
              {[
                { num: '59', label: "FERRA'S SKILLS" },
                { num: '5', label: 'SOURCE REPOS' },
                { num: '30s', label: 'AVERAGE FORGE TIME', orange: true },
                { num: '7', label: 'FILES GENERATED' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="stat-item"
                  style={{ borderRight: i < 3 ? '1px solid var(--border)' : undefined, padding: '0 24px' }}
                >
                  <div className={`stat-num${s.orange ? ' orange' : ''}`}>{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TAPE */}
      <div className="tape-wrap">
        <div className="tape-inner">
          {[...TAPE_ITEMS, ...TAPE_ITEMS].map((item, i) => (
            <span key={i} className="tape-item">{item} <span>✦</span></span>
          ))}
        </div>
      </div>

      {/* POWERED BY REPOS */}
      <section style={{ padding: '72px 0', background: 'var(--dark)', borderTop: '1px solid #222' }}>
        <div className="container">
          <Reveal>
            <span className="section-label" style={{ color: '#E05C15' }}>// Source Repositories</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
              <h2 className="section-h" style={{ color: '#FAFAF7' }}>
                Built on the<br /><em style={{ color: 'var(--orange)' }}>shoulders of giants.</em>
              </h2>
              <p style={{ color: '#666', fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>
                Every CLAUDE.md is generated using wisdom curated from these open-source repositories.
              </p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 12 }}>
            {[
              { name: 'Karpathy Skills', slug: 'karpathy', url: 'https://github.com/karpathy', desc: "Andrej Karpathy's coding philosophy — think clearly, write simply, reason step-by-step" },
              { name: 'Repomix', slug: 'yamadashy/repomix', url: 'https://github.com/yamadashy/repomix', desc: 'Pack entire repos into AI-friendly context. Powers the GitHub URL scan pipeline' },
              { name: 'Awesome Claude Skills', slug: 'awesome-claude-code', url: 'https://github.com/hesreallyhim/awesome-claude-code', desc: 'Community-curated library of Claude Code skills — the backbone of the 59-skill library' },
              { name: 'Superpowers', slug: 'claude-code', url: 'https://github.com/anthropics/anthropic-quickstarts', desc: 'Extended Claude capabilities — advanced agent configs and tooling patterns' },
              { name: 'ECC', slug: 'extended-cc', url: 'https://github.com/anthropics/claude-code', desc: 'Extended Claude Code — deep workflow automation and integration patterns' },
            ].map((repo, i) => (
              <Reveal key={repo.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none', border: '1px solid #2A2A24', borderRadius: 12, padding: 22, background: '#1A1A15', transition: 'border-color .2s, transform .2s', height: '100%' }}
                  onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E05C15'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#2A2A24'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)' }}
                >
                  <div style={{ color: '#E05C15', marginBottom: 14 }}><RepoSvgIcon variant={i} /></div>
                  <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#FAFAF7', marginBottom: 4 }}>{repo.name}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--orange)', marginBottom: 10 }}>{repo.slug}</div>
                  <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.6 }}>{repo.desc}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY WE BUILT THIS */}
      <section style={{ padding: '88px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

            {/* LEFT — headline */}
            <div>
              <Reveal>
                <span className="section-label">// Why we built this</span>
                <h2 className="section-h" style={{ marginBottom: 22 }}>
                  Claude is only as good<br />as what you<br /><em className="orange">tell it about you.</em>
                </h2>
              </Reveal>
              <Reveal delay={1}>
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 28, maxWidth: 420 }}>
                  We kept opening new projects and doing the same thing — writing CLAUDE.md from scratch, copy-pasting snippets,
                  wondering if we missed a skill. Every time. Forge exists so you never have to do that again.
                </p>
              </Reveal>
              <Reveal delay={2}>
                <p style={{ fontSize: 13.5, color: 'var(--faint)', lineHeight: 1.75, maxWidth: 400, borderLeft: '2px solid var(--orange)', paddingLeft: 16 }}>
                  A developer who spends 30 minutes configuring Claude properly will outcode someone who skips it entirely —
                  every single session, indefinitely.
                </p>
              </Reveal>
            </div>

            {/* RIGHT — honest truths */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingTop: 8 }}>
              {[
                {
                  n: '01',
                  title: 'Setup friction kills adoption',
                  body: 'Most developers never configure CLAUDE.md. Not because they don\'t care — because figuring out what to put in it takes longer than the first feature they want to ship.',
                },
                {
                  n: '02',
                  title: 'Generic prompts get generic code',
                  body: 'Claude doesn\'t know you use Prisma, not raw SQL. Or that you\'re on App Router, not Pages. Without that context, it guesses — and guesses wrong half the time.',
                },
                {
                  n: '03',
                  title: 'Every stack deserves a custom context',
                  body: 'A Go service and a Next.js SaaS shouldn\'t share the same CLAUDE.md. Forge detects your actual stack and selects the skills that matter for it.',
                },
              ].map((item, i) => (
                <Reveal key={item.n} delay={(i + 1) as 1 | 2 | 3}>
                  <div style={{
                    padding: '28px 0',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', gap: 20,
                  }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 700, flexShrink: 0, paddingTop: 3, letterSpacing: 1 }}>
                      {item.n}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 8, color: 'var(--text)' }}>
                        {item.title}
                      </div>
                      <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>
            <div>
              <Reveal>
                <span className="section-label">How it works</span>
                <h2 className="section-h" style={{ marginBottom: 38 }}>From repo to<br /><em>ready in 3 steps.</em></h2>
              </Reveal>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {[
                  { n: '01', title: 'Tell Ferra about your project', desc: 'Paste a GitHub URL — Ferra runs a config-first scan. Or describe your stack in plain text.' },
                  { n: '02', title: 'Ferra selects your skills', desc: 'She detects your stack and picks the right skills from her library of 59. Your CLAUDE.md is generated with Karpathy-inspired principles.' },
                  { n: '03', title: 'Drop it in your repo', desc: 'Download a ZIP with CLAUDE.md, skill files, hooks, and a setup guide. Claude Code auto-reads it every session.' },
                ].map((step, i) => (
                  <Reveal key={step.n} delay={(i + 1) as 1 | 2 | 3}>
                    <div style={{ display: 'flex', gap: 18 }}>
                      <div className="step-num">{step.n}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{step.title}</div>
                        <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65 }}>{step.desc}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={2}>
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                <span className="section-label" style={{ marginBottom: 8 }}>Output structure</span>
                <div className="code-block" style={{ fontSize: 12 }}>
                  {`claude-forge-output/\n`}
                  <span style={{ color: 'var(--orange)' }}>├── CLAUDE.md</span>
                  <span style={{ color: '#444' }}>             ← main AI context{'\n'}</span>
                  <span style={{ color: 'var(--blue)' }}>├── skills/{'\n'}│   ├── typescript-strict.md{'\n'}│   └── [more skills...]{'\n'}</span>
                  <span style={{ color: '#22C55E' }}>├── hooks/{'\n'}│   └── pre-commit.sh{'\n'}</span>
                  <span style={{ color: '#888' }}>└── SETUP_GUIDE.md</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SKILLS TEASER */}
      <section style={{ padding: '72px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <Reveal>
              <div>
                <span className="section-label">Skill Library</span>
                <h2 className="section-h">{"Ferra's 59 Skills."}<br /><em className="orange">Auto-selected.</em></h2>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--muted)', fontSize: 14.5, maxWidth: 320, lineHeight: 1.6, marginBottom: 18 }}>
                  Browse every skill. Forge selects them automatically — or copy any skill manually.
                </p>
                <Link href="/skills" className="btn-primary">Browse Skills Library →</Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={3}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <span key={cat} className="cat-chip">{cat}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORGE SECTION */}
      <section className="section" ref={forgeRef as React.RefObject<HTMLElement>} style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <ForgeCard onForgeComplete={handleForgeComplete} />
          {forgeResult && (
            <div ref={resultRef}>
              <ResultPreview result={forgeResult} />
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 28px', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div className="nav-logo">
              <Image src="/ferra-mascot.jpeg" alt="Ferra" width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <span className="nav-logo-text">Ferra<span className="orange">.forge</span></span>
            </div>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <Link href="/skills" className="nav-link">Skills</Link>
              <span className="nav-link muted">GitHub</span>
              <span className="nav-link muted">Twitter / X</span>
            </div>
          </div>
          <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center' }}>
              Ferra &middot; claudemdforge.site &middot; Built with Karpathy wisdom, GitHub API, and Awesome Claude Skills
            </p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  )
}
