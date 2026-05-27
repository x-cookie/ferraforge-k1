'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import ForgeCard, { ForgeResult } from '@/components/ForgeCard'
import ResultPreview from '@/components/ResultPreview'
import PageWrapper from '@/components/PageWrapper'
import Reveal from '@/components/Reveal'
import { CATEGORIES } from '@/lib/skills'

const TAPE_ITEMS = [
  'CLAUDE.md', 'SKILLS PACK', 'PRE-COMMIT HOOKS', 'KARPATHY PRINCIPLES',
  'GITHUB API', 'TECH STACK DETECTION', 'SETUP GUIDE',
  '59 CLAUDE SKILLS', 'CLAUDE CODE READY',
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
            <div className="logo-mark">🔨</div>
            <span className="nav-logo-text">CLAUDE<span className="orange">.md</span> Forge</span>
          </div>
          <span className="nav-link active">Home</span>
          <Link href="/skills" className="nav-link">Skills Library</Link>
          <span className="nav-link muted">Docs</span>
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
              <span className="section-label">Claude Code Setup Generator</span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="editorial-h" style={{ marginBottom: 26 }}>
                Your perfect<br />
                Claude Code setup.<br />
                <em className="orange">Forged in 30 seconds.</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: 38 }}>
                Paste a GitHub URL or describe your project. Get a production-ready CLAUDE.md,
                curated skill pack, hooks, and agents — tailored to your exact stack.
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
                { num: '59', label: 'CURATED SKILLS' },
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

      {/* FORGE SECTION */}
      <section className="section" ref={forgeRef as React.RefObject<HTMLElement>}>
        <div className="container">
          <ForgeCard onForgeComplete={handleForgeComplete} />
          {forgeResult && (
            <div ref={resultRef}>
              <ResultPreview result={forgeResult} />
            </div>
          )}
        </div>
      </section>

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
              { name: 'Karpathy Skills', slug: 'andrej-karpathy-skills', desc: "Andrej Karpathy's coding philosophy — think clearly, write simply, reason step-by-step" },
              { name: 'Repomix', slug: 'yamadashy/repomix', desc: 'Pack entire repos into AI-friendly context. Powers the GitHub URL scan pipeline' },
              { name: 'Awesome Claude Skills', slug: 'awesome-claude-skills', desc: 'Community-curated library of Claude Code skills — the backbone of the 59-skill library' },
              { name: 'Superpowers', slug: 'superpowers', desc: 'Extended Claude capabilities — advanced agent configs and tooling patterns' },
              { name: 'ECC', slug: 'ECC', desc: 'Extended Claude Code — deep workflow automation and integration patterns' },
            ].map((repo, i) => (
              <Reveal key={repo.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div
                  style={{ border: '1px solid #2A2A24', borderRadius: 12, padding: 22, background: '#1A1A15', transition: 'border-color .2s', height: '100%' }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = '#E05C15')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = '#2A2A24')}
                >
                  <div style={{ color: '#E05C15', marginBottom: 14 }}><RepoSvgIcon variant={i} /></div>
                  <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#FAFAF7', marginBottom: 4 }}>{repo.name}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--orange)', marginBottom: 10 }}>{repo.slug}</div>
                  <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.6 }}>{repo.desc}</div>
                </div>
              </Reveal>
            ))}
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
                  { n: '01', title: 'Input your project', desc: 'Paste a GitHub URL — Forge uses a config-first scan. Or describe your stack manually in plain text.' },
                  { n: '02', title: 'AI builds your setup', desc: 'Claude detects your stack and selects the right skills from 59 options. Your CLAUDE.md is generated with Karpathy-inspired principles.' },
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
                <h2 className="section-h">59 Claude Skills.<br /><em className="orange">Auto-selected.</em></h2>
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

      {/* FOOTER */}
      <footer style={{ padding: '40px 28px', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div className="nav-logo">
              <div className="logo-mark">🔨</div>
              <span className="nav-logo-text">CLAUDE<span className="orange">.md</span> Forge</span>
            </div>
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <Link href="/skills" className="nav-link">Skills</Link>
              <span className="nav-link muted">GitHub</span>
              <span className="nav-link muted">Twitter / X</span>
            </div>
          </div>
          <div style={{ marginTop: 22, paddingTop: 22, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center' }}>
              claudemdforge.site · Built with Karpathy wisdom, GitHub API, and Awesome Claude Skills
            </p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  )
}
