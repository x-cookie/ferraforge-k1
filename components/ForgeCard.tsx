'use client'

import { useState, useEffect } from 'react'
import { Skill } from '@/lib/skills'

export type ForgeResult = {
  claudeMd: string
  skills: Skill[]
  tags: string[]
  zipBlob: Blob
}

const FORGE_STEPS = [
  'Fetching manifest files from repo...',
  'Detecting tech stack from manifests...',
  'Matching 59 Claude skills to your stack...',
  'Generating CLAUDE.md with Karpathy principles...',
  'Packaging output files...',
]

type TermLine = { c: string; t: string; d: number }

const TERMINAL_LINES: TermLine[] = [
  { c: '#484844', t: 'claudemd-forge · github-api · claude-api', d: 400 },
  { c: '#FAFAF7', t: '$ claudeforge scan https://github.com/user/saas-app', d: 500 },
  { c: '#E05C15', t: '🔨 CLAUDE.md Forge — config-first scan', d: 180 },
  { c: '#333',    t: '', d: 120 },
  { c: '#888',    t: '→ Phase 1: Fetching manifest files...', d: 650 },
  { c: '#22C55E', t: '  ✓ package.json · tsconfig.json · .eslintrc', d: 220 },
  { c: '#22C55E', t: '  ✓ tailwind.config.ts · prisma/schema.prisma', d: 200 },
  { c: '#888',    t: '→ Phase 2: Sampling source files...', d: 550 },
  { c: '#22C55E', t: '  ✓ Stack detected: Next.js 14 · TypeScript · Prisma', d: 280 },
  { c: '#22C55E', t: '  ✓ Pattern: App Router · server components · Zod', d: 240 },
  { c: '#888',    t: '→ Matching 59 Claude skills to your stack...', d: 750 },
  { c: '#22C55E', t: '  ✓ 6 skills selected (score > 0.85)', d: 230 },
  { c: '#888',    t: '→ Generating CLAUDE.md with Karpathy principles...', d: 1100 },
  { c: '#22C55E', t: '  ✓ Generated in 4.1s', d: 180 },
  { c: '#333',    t: '', d: 130 },
  { c: '#FAFAF7', t: 'Output: claude-forge-output/', d: 200 },
  { c: '#E05C15', t: '  ├── CLAUDE.md', d: 130 },
  { c: '#7AB8F5', t: '  ├── skills/  (6 files)', d: 110 },
  { c: '#7AB8F5', t: '  ├── hooks/pre-commit.sh', d: 110 },
  { c: '#7AB8F5', t: '  └── SETUP_GUIDE.md', d: 110 },
  { c: '#333',    t: '', d: 180 },
  { c: '#22C55E', t: '✓ Done · All repo sizes supported', d: 280 },
]

const LINE_H = 22
const TERM_H = 264
const VISIBLE = Math.floor(TERM_H / LINE_H) // 12 lines

type Props = { onForgeComplete: (result: ForgeResult) => void }

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

export default function ForgeCard({ onForgeComplete }: Props) {
  const [mode, setMode] = useState<'url' | 'describe'>('url')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [termLines, setTermLines] = useState<Array<{ c: string; t: string }>>([])

  useEffect(() => {
    let cancelled = false

    async function run() {
      while (!cancelled) {
        setTermLines([])
        await sleep(300)
        for (const line of TERMINAL_LINES) {
          await sleep(line.d)
          if (cancelled) return
          setTermLines(prev => [...prev, { c: line.c, t: line.t }])
        }
        await sleep(2800)
        if (cancelled) return
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  async function handleForge() {
    const val = input.trim()
    if (!val || loading) return
    setLoading(true)
    setSteps([])
    setProgress(0)
    setError('')

    const apiPromise = fetch('/api/forge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, input: val }),
    })

    for (let i = 0; i < FORGE_STEPS.length; i++) {
      if (i > 0) await sleep(900)
      setSteps(prev => [...prev, FORGE_STEPS[i]])
      setProgress(((i + 1) / FORGE_STEPS.length) * 100)
    }

    try {
      const res = await apiPromise
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          res.status === 429
            ? 'Daily limit reached (5 forges/day). Try again tomorrow.'
            : (data.error || 'Something went wrong. Please try again.')
        )
        setLoading(false)
        return
      }
      const data: { claudeMd: string; skills: Skill[]; tags: string[]; zipBase64: string } = await res.json()
      const zipBytes = Uint8Array.from(atob(data.zipBase64), c => c.charCodeAt(0))
      const zipBlob = new Blob([zipBytes], { type: 'application/zip' })
      onForgeComplete({ claudeMd: data.claudeMd, skills: data.skills, tags: data.tags, zipBlob })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const scrollOffset = Math.max(0, (termLines.length - VISIBLE) * LINE_H)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

      {/* LEFT: input */}
      <div>
        <span className="section-label">The Forge</span>
        <h2 className="section-h" style={{ marginBottom: 10 }}>
          Input your<br /><em>project.</em>
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14.5, marginBottom: 28, lineHeight: 1.65 }}>
          Two modes — paste a GitHub URL for automatic scanning, or describe your stack manually.
        </p>

        <div className="card" style={{ padding: 24 }}>
          <div className="tab-strip" style={{ marginBottom: 18 }}>
            <button className={`tab-btn${mode === 'url' ? ' active' : ''}`} onClick={() => setMode('url')}>GitHub URL</button>
            <button className={`tab-btn${mode === 'describe' ? ' active' : ''}`} onClick={() => setMode('describe')}>Describe Stack</button>
          </div>

          {mode === 'url' ? (
            <div>
              <input
                className="input-field"
                placeholder="https://github.com/username/repository"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleForge()}
              />
              <p className="mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8 }}>
                ✦ Works for any repo size — smart config-first scan
              </p>
            </div>
          ) : (
            <textarea
              className="input-field"
              placeholder="e.g. Next.js 14 SaaS with Prisma, TypeScript strict mode, Tailwind, deployed on Vercel."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
          )}

          {loading && steps.length > 0 && (
            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, animation: 'stepIn .25s ease both' }}>
                    <span style={{ color: 'var(--green)' }}>✓</span>
                    <span className="mono" style={{ color: 'var(--muted)' }}>{step}</span>
                  </div>
                ))}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {error && <p style={{ fontSize: 12.5, color: '#DC2626', marginTop: 12 }}>{error}</p>}

          <button
            className="btn-primary"
            disabled={loading}
            onClick={handleForge}
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          >
            {loading ? <><div className="spinner" /> Forging...</> : 'Forge It 🔨'}
          </button>
          <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', marginTop: 10 }}>
            Free · 5 forges per day · No login required
          </p>
        </div>
      </div>

      {/* RIGHT: smooth-scroll terminal */}
      <div>
        <div className="terminal">
          <div className="terminal-bar">
            <div className="dot" style={{ background: '#FF5F57' }} />
            <div className="dot" style={{ background: '#FFBD2E' }} />
            <div className="dot" style={{ background: '#28CA41' }} />
            <span className="mono" style={{ fontSize: 11, color: '#484844', marginLeft: 8 }}>
              claudemd-forge · github-api · claude-api
            </span>
          </div>
          <div className="terminal-body">
            <div
              className="terminal-scroll"
              style={{ transform: `translateY(-${scrollOffset}px)` }}
            >
              {termLines.map((line, i) => (
                <div key={i} className="terminal-line" style={{ color: line.c }}>
                  {line.t || ' '}
                </div>
              ))}
              <span className="terminal-cursor">▋</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
