'use client'

import { useState, useRef, useEffect } from 'react'
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

const TERMINAL_LINES = [
  { c: '#555', t: '$ claudeforge scan https://github.com/user/saas-app' },
  { c: '#E05C15', t: '🔨 CLAUDE.md Forge — config-first scan' },
  { c: '#333', t: '' },
  { c: '#555', t: '→ Phase 1: Fetching manifest files...' },
  { c: '#22C55E', t: '  ✓ package.json · tsconfig.json · .eslintrc' },
  { c: '#22C55E', t: '  ✓ tailwind.config.ts · prisma/schema.prisma' },
  { c: '#555', t: '→ Phase 2: Sampling source files...' },
  { c: '#22C55E', t: '  ✓ Stack detected: Next.js 14 · TypeScript · Prisma' },
  { c: '#22C55E', t: '  ✓ Pattern: App Router · server components · Zod' },
  { c: '#555', t: '→ Matching 59 Claude skills to your stack...' },
  { c: '#22C55E', t: '  ✓ 6 skills selected (score > 0.85)' },
  { c: '#555', t: '→ Generating CLAUDE.md with Karpathy principles...' },
  { c: '#22C55E', t: '  ✓ Generated in 4.1s' },
  { c: '#333', t: '' },
  { c: '#FAFAF7', t: 'Output: claude-forge-output/' },
  { c: '#E05C15', t: '  ├── CLAUDE.md' },
  { c: '#7AB8F5', t: '  ├── skills/  (6 files)' },
  { c: '#7AB8F5', t: '  ├── hooks/pre-commit.sh' },
  { c: '#7AB8F5', t: '  └── SETUP_GUIDE.md' },
  { c: '#333', t: '' },
  { c: '#22C55E', t: '✓ Done · All repo sizes supported' },
]

type Props = {
  onForgeComplete: (result: ForgeResult) => void
}

export default function ForgeCard({ onForgeComplete }: Props) {
  const [mode, setMode] = useState<'url' | 'describe'>('url')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalBuilt = useRef(false)

  useEffect(() => {
    if (!terminalRef.current || terminalBuilt.current) return
    terminalBuilt.current = true
    TERMINAL_LINES.forEach((line, i) => {
      const d = document.createElement('div')
      d.style.cssText = `color:${line.c};opacity:0;animation:stepIn .3s ease ${i * 0.12}s both;`
      d.textContent = line.t || ' '
      terminalRef.current!.appendChild(d)
    })
  }, [])

  async function handleForge() {
    const val = input.trim()
    if (!val || loading) return
    setLoading(true)
    setSteps([])
    setProgress(0)
    setError('')

    // Start API call immediately
    const apiPromise = fetch('/api/forge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, input: val }),
    })

    // Animate steps while API runs
    for (let i = 0; i < FORGE_STEPS.length; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 900))
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
      {/* LEFT: Input */}
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
            <button
              className={`tab-btn${mode === 'url' ? ' active' : ''}`}
              onClick={() => setMode('url')}
            >
              GitHub URL
            </button>
            <button
              className={`tab-btn${mode === 'describe' ? ' active' : ''}`}
              onClick={() => setMode('describe')}
            >
              Describe Stack
            </button>
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
                  <div
                    key={i}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, animation: 'stepIn .25s ease both' }}
                  >
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

          {error && (
            <p style={{ fontSize: 12.5, color: '#DC2626', marginTop: 12 }}>{error}</p>
          )}

          <button
            className="btn-primary"
            disabled={loading}
            onClick={handleForge}
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
          >
            {loading
              ? <><div className="spinner" /> Forging...</>
              : 'Forge It 🔨'
            }
          </button>
          <p style={{ fontSize: 11.5, color: 'var(--faint)', textAlign: 'center', marginTop: 10 }}>
            Free · 5 forges per day · No login required
          </p>
        </div>
      </div>

      {/* RIGHT: Terminal */}
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
          <div className="terminal-body" ref={terminalRef} />
        </div>
      </div>
    </div>
  )
}
