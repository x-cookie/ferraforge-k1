'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PageWrapper from '@/components/PageWrapper'

const NAV = [
  {
    group: 'Getting Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'quickstart', label: 'Quick Start' },
      { id: 'env-vars', label: 'Environment Variables' },
    ],
  },
  {
    group: 'How It Works',
    items: [
      { id: 'forge-pipeline', label: 'Forge Pipeline' },
      { id: 'github-scanning', label: 'GitHub URL Scanning' },
      { id: 'stack-detection', label: 'Stack Detection' },
      { id: 'skill-scoring', label: 'Skill Scoring Algorithm' },
    ],
  },
  {
    group: 'Output Format',
    items: [
      { id: 'claude-md', label: 'CLAUDE.md' },
      { id: 'skill-files', label: 'Skill Files' },
      { id: 'hooks', label: 'Pre-commit Hook' },
      { id: 'setup-guide', label: 'SETUP_GUIDE.md' },
    ],
  },
  {
    group: 'API Reference',
    items: [
      { id: 'api-forge', label: 'POST /api/forge' },
      { id: 'rate-limits', label: 'Rate Limits' },
    ],
  },
  {
    group: 'Self-Hosting',
    items: [
      { id: 'self-host', label: 'Self-Hosting Guide' },
      { id: 'model-config', label: 'Model Configuration' },
    ],
  },
]

const ALL_IDS = NAV.flatMap(g => g.items.map(i => i.id))

function Code({ children }: { children: string }) {
  return (
    <code style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      padding: '1px 6px',
      borderRadius: 4,
      fontSize: '0.88em',
      fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
      color: 'var(--orange)',
    }}>
      {children}
    </code>
  )
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="code-block" style={{ fontSize: 12.5, lineHeight: 1.85, marginTop: 14, marginBottom: 20 }}>
      {children}
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 72, scrollMarginTop: 80 }}>
      <h2 style={{
        fontFamily: 'var(--font-syne), Syne, sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(22px, 3vw, 32px)',
        letterSpacing: '-0.8px',
        marginBottom: 20,
        paddingBottom: 14,
        borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </h2>
      <div style={{ lineHeight: 1.85, color: 'var(--muted)', fontSize: 14.5 }}>
        {children}
      </div>
    </section>
  )
}

function Prop({ name, type, req, children }: { name: string; type: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
        <code style={{ fontFamily: 'var(--font-dm-mono), DM Mono, monospace', fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{name}</code>
        <span style={{ fontSize: 12, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1px 7px', borderRadius: 4, color: 'var(--muted)', fontFamily: 'var(--font-dm-mono), DM Mono, monospace' }}>{type}</span>
        {req && <span style={{ fontSize: 11, background: '#FFF1F2', color: '#DC2626', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>required</span>}
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  )
}

export default function DocsPage() {
  const [active, setActive] = useState('overview')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const els = ALL_IDS.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    observerRef.current = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    els.forEach(el => observerRef.current!.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

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
          <span className="nav-link active">Docs</span>
          <div className="nav-spacer" />
          <Link href="/" className="nav-cta">Start Forging →</Link>
        </div>
      </nav>

      {/* HERO STRIP */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid #222', padding: '48px 28px 44px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#2A2A24 1px, transparent 1px), linear-gradient(90deg, #2A2A24 1px, transparent 1px)',
          backgroundSize: '40px 40px', opacity: 0.35,
          maskImage: 'linear-gradient(90deg, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, black 0%, transparent 100%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container" style={{ position: 'relative' }}>
          <span className="section-label" style={{ color: 'var(--orange)' }}>Technical Documentation</span>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: '#FAFAF7',
            letterSpacing: '-1.5px',
            marginBottom: 12,
          }}>
            CLAUDE.md Forge<br /><em style={{ fontFamily: 'var(--font-instrument-serif), Instrument Serif, serif', fontWeight: 400, color: '#888' }}>Developer Reference</em>
          </h1>
          <p style={{ color: '#666', fontSize: 14.5, maxWidth: 520, lineHeight: 1.7 }}>
            Everything you need to understand, self-host, or extend CLAUDE.md Forge — from the stack detection algorithm to the API contract.
          </p>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48, padding: '48px 28px 80px', alignItems: 'start' }}>

        {/* SIDEBAR */}
        <aside style={{ position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          {NAV.map(group => (
            <div key={group.group} style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10.5,
                fontFamily: 'var(--font-dm-mono), DM Mono, monospace',
                letterSpacing: 1.5,
                color: 'var(--faint)',
                textTransform: 'uppercase',
                marginBottom: 8,
                padding: '0 8px',
              }}>
                {group.group}
              </div>
              {group.items.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                  style={{
                    display: 'block',
                    padding: '6px 10px',
                    fontSize: 13.5,
                    borderRadius: 7,
                    marginBottom: 2,
                    color: active === item.id ? 'var(--orange)' : 'var(--muted)',
                    background: active === item.id ? 'var(--orange-light)' : 'transparent',
                    fontWeight: active === item.id ? 600 : 400,
                    borderLeft: active === item.id ? '2px solid var(--orange)' : '2px solid transparent',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </aside>

        {/* CONTENT */}
        <main style={{ minWidth: 0 }}>

          <Section id="overview" title="Overview">
            <p style={{ marginBottom: 16 }}>
              CLAUDE.md Forge is a Next.js 16 utility that turns any GitHub repository URL — or a plain-text stack description — into a complete Claude Code configuration ZIP in under 30 seconds.
            </p>
            <p style={{ marginBottom: 16 }}>
              The output contains four files your project drops directly into its root directory. Claude Code automatically reads <Code>CLAUDE.md</Code> at the start of every session, giving the AI persistent knowledge of your project's conventions, principles, and skills.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 20 }}>
              {[
                { label: 'CLAUDE.md', desc: 'AI context file — project rules, principles, and selected skills' },
                { label: 'skills/*.md', desc: '6–8 individual skill files auto-selected for your stack' },
                { label: 'hooks/pre-commit.sh', desc: 'Bash hook for linting and type-checking before every commit' },
                { label: 'SETUP_GUIDE.md', desc: 'Step-by-step instructions for placing files in your project' },
              ].map(f => (
                <div key={f.label} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, background: 'var(--bg2)' }}>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--orange)', fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="quickstart" title="Quick Start">
            <p style={{ marginBottom: 16 }}>Clone, configure, and run locally in four commands:</p>
            <Block>
              {`git clone https://github.com/spooky-may/project-forge.git\ncd project-forge\nnpm install\nnpm run dev    # → http://localhost:3000`}
            </Block>
            <p style={{ marginBottom: 8 }}>
              Before running, create <Code>.env.local</Code> with your API keys. See <a href="#env-vars" style={{ color: 'var(--orange)' }}>Environment Variables</a>.
            </p>
          </Section>

          <Section id="env-vars" title="Environment Variables">
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <Prop name="OPENROUTER_API_KEY" type="string" req>
                OpenRouter API key used for CLAUDE.md generation. Obtain from{' '}
                <span style={{ color: 'var(--orange)' }}>openrouter.ai/keys</span>.
                All generation runs through the <Code>Claude</Code> model.
              </Prop>
              <Prop name="GITHUB_TOKEN" type="string">
                GitHub Personal Access Token. Without it, the GitHub API is limited to 60 unauthenticated requests per hour per IP.
                With a token, the limit increases to 5,000 requests per hour. Only <Code>public_repo</Code> scope is needed — read-only access.
              </Prop>
            </div>
            <Block>{`# .env.local\nOPENROUTER_API_KEY=sk-or-v1-...\nGITHUB_TOKEN=ghp_...`}</Block>
          </Section>

          <Section id="forge-pipeline" title="Forge Pipeline">
            <p style={{ marginBottom: 16 }}>
              Every forge request to <Code>POST /api/forge</Code> runs through a synchronous five-step pipeline:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { n: '01', title: 'Rate limit check', desc: 'In-memory map keyed by IP. 5 forges per IP per day, resetting at midnight UTC. Returns 429 if exceeded.' },
                { n: '02', title: 'Context extraction', desc: 'URL mode: packRepo() fetches manifest files from GitHub. Describe mode: uses the raw text input as context.' },
                { n: '03', title: 'Stack detection', desc: 'detectStack() runs keyword matching over the context string and returns a string[] of detected tags (e.g. ["nextjs","typescript","tailwind"]).' },
                { n: '04', title: 'Skill selection', desc: 'selectSkills() scores all 59 skills against the detected tags. Top 6–8 by score are selected. At least one universal skill is always included.' },
                { n: '05', title: 'AI generation + ZIP', desc: 'callClaude() sends the context and selected skill names to the model. The response becomes CLAUDE.md. buildZip() bundles everything with fflate.' },
              ].map((step, i) => (
                <div key={step.n} style={{ display: 'flex', gap: 18, padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="step-num" style={{ flexShrink: 0 }}>{step.n}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>
                      {step.title}
                    </div>
                    <p style={{ fontSize: 13.5, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="github-scanning" title="GitHub URL Scanning">
            <p style={{ marginBottom: 16 }}>
              <Code>packRepo()</Code> in <Code>lib/github.ts</Code> extracts context from a GitHub repository without cloning it. It makes three types of requests:
            </p>
            <ol style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><code style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: '0.88em', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--orange)' }}>{'GET /repos/{owner}/{repo}'}</code> — gets the default branch name</li>
              <li><code style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: '0.88em', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--orange)' }}>{'GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1'}</code> — gets the full file tree</li>
              <li><code style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: '0.88em', fontFamily: 'var(--font-dm-mono), DM Mono, monospace', color: 'var(--orange)' }}>GET raw.githubusercontent.com/...</code> — parallel-fetches manifest file content (no auth needed)</li>
            </ol>
            <p style={{ marginBottom: 16 }}>
              Files matched as manifests (case-insensitive):
            </p>
            <Block>{`package.json  tsconfig.json  next.config.*  vite.config.*\ntailwind.config.*  prisma/schema.prisma  requirements.txt\npyproject.toml  go.mod  Cargo.toml  .eslintrc*  README.md`}</Block>
            <p>
              Content is concatenated as <Code>// path\ncontent\n\n</Code> and truncated to 32,000 characters before being passed to stack detection and AI generation.
            </p>
          </Section>

          <Section id="stack-detection" title="Stack Detection">
            <p style={{ marginBottom: 16 }}>
              <Code>detectStack()</Code> in <Code>lib/detectStack.ts</Code> scans the packed context string for keywords and returns a <Code>string[]</Code> of technology tags.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
              {[
                ['next / nextjs', '→ nextjs'],
                ['react', '→ react'],
                ['typescript / tsconfig', '→ typescript'],
                ['tailwind', '→ tailwind'],
                ['prisma', '→ database'],
                ['fastapi / django / flask', '→ python, backend'],
                ['graphql', '→ graphql'],
                ['docker / dockerfile', '→ docker'],
                ['playwright', '→ playwright'],
                ['vitest / jest', '→ testing'],
                ['go.mod', '→ golang'],
                ['cargo.toml / rustlang', '→ rust'],
              ].map(([kw, tag]) => (
                <div key={kw} style={{ padding: '8px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}>
                  <div className="mono" style={{ color: 'var(--orange)', marginBottom: 2 }}>{kw}</div>
                  <div style={{ color: 'var(--muted)' }}>{tag}</div>
                </div>
              ))}
            </div>
            <p>The describe mode input is scanned with the same function — users can write natural-language descriptions like <Code>"Next.js app with Prisma and TypeScript"</Code> and detection works correctly.</p>
          </Section>

          <Section id="skill-scoring" title="Skill Scoring Algorithm">
            <p style={{ marginBottom: 16 }}>
              <Code>selectSkills()</Code> in <Code>lib/selectSkills.ts</Code> scores each of the 59 skills against the detected tag array using this formula:
            </p>
            <Block>{`score = (skill.tags ∩ detectedTags).length\n      + 0.3  if skill.tags includes 'universal'`}</Block>
            <p style={{ marginBottom: 16 }}>
              Skills are then sorted by score descending. The top 6–8 are returned, with at minimum one <Code>universal</Code> skill always included (even if its score is 0.3 and others score higher).
            </p>
            <p>Skills with <Code>score === 0</Code> that are not tagged <Code>universal</Code> are excluded entirely. This keeps the output focused — a Python project won't get React-specific skills.</p>
          </Section>

          <Section id="claude-md" title="CLAUDE.md">
            <p style={{ marginBottom: 16 }}>
              The generated <Code>CLAUDE.md</Code> follows this structure:
            </p>
            <Block>
              {`# Project: [repo name]\n\n## Core Principles\n[Karpathy-inspired engineering philosophy]\n\n## Stack\n[Detected technologies]\n\n## Selected Skills\n[Inline snippet content from each selected skill]\n\n---\nGenerated by CLAUDE.md Forge — claudemdforge.site`}
            </Block>
            <p style={{ marginBottom: 16 }}>
              Claude Code reads <Code>CLAUDE.md</Code> at the start of every session. The file should be committed to your repository root — it's part of your project's source truth, not a generated artifact to be regenerated each time.
            </p>
            <p>
              You can edit <Code>CLAUDE.md</Code> freely after generating it. Common additions include project-specific conventions, team preferences, and task context.
            </p>
          </Section>

          <Section id="skill-files" title="Skill Files">
            <p style={{ marginBottom: 16 }}>
              Each selected skill is saved as a standalone markdown file in <Code>skills/</Code>:
            </p>
            <Block>{`skills/\n├── clean-code-principles.md\n├── typescript-strict-mode.md\n├── nextjs-app-router.md\n└── [3–5 more skills...]`}</Block>
            <p style={{ marginBottom: 16 }}>
              Skill files are referenced from <Code>CLAUDE.md</Code> with <Code>@skills/filename.md</Code>. Claude Code resolves these relative imports automatically, keeping the main context file compact while making each skill individually editable.
            </p>
            <p>File names are derived from skill titles using kebab-case slug conversion.</p>
          </Section>

          <Section id="hooks" title="Pre-commit Hook">
            <p style={{ marginBottom: 16 }}>
              The generated <Code>hooks/pre-commit.sh</Code> is a standard Bash hook that runs on every commit:
            </p>
            <Block>
              {`#!/bin/bash\nset -e\n\n# TypeScript check\nnpx tsc --noEmit\n\n# Lint\nnpx eslint . --ext .ts,.tsx --max-warnings 0\n\n# Tests (if present)\n[ -f "package.json" ] && grep -q '"test"' package.json && npm test -- --passWithNoTests\n\necho "✓ Pre-commit checks passed"`}
            </Block>
            <p>
              To install: <Code>cp hooks/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit</Code>. The SETUP_GUIDE.md includes these exact steps.
            </p>
          </Section>

          <Section id="setup-guide" title="SETUP_GUIDE.md">
            <p style={{ marginBottom: 16 }}>
              The <Code>SETUP_GUIDE.md</Code> is generated alongside the other files and contains step-by-step instructions for the developer:
            </p>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Unzip <Code>claude-forge-output.zip</Code> in your project root</li>
              <li>Commit <Code>CLAUDE.md</Code> and the <Code>skills/</Code> directory</li>
              <li>Install the pre-commit hook</li>
              <li>Open Claude Code — it reads <Code>CLAUDE.md</Code> automatically</li>
              <li>Edit <Code>CLAUDE.md</Code> to add your project-specific conventions</li>
            </ol>
          </Section>

          <Section id="api-forge" title="POST /api/forge">
            <p style={{ marginBottom: 16 }}>The single API endpoint that drives the Forge button.</p>

            <h3 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>Request</h3>
            <Block>{`POST /api/forge\nContent-Type: application/json\n\n{\n  "mode": "url" | "describe",\n  "input": string\n}`}</Block>

            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
              <Prop name="mode" type='"url" | "describe"' req>
                <Code>url</Code> — input is a GitHub repository URL. Forge fetches and packs manifest files.<br />
                <Code>describe</Code> — input is a plain-text stack description. Used directly as context.
              </Prop>
              <Prop name="input" type="string" req>
                For <Code>url</Code> mode: a GitHub URL in the form <Code>https://github.com/owner/repo</Code>.<br />
                For <Code>describe</Code> mode: a natural-language description of your project stack.
              </Prop>
            </div>

            <h3 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>Response (200)</h3>
            <Block>{`{\n  "claudeMd": string,      // generated CLAUDE.md content\n  "skills": Skill[],       // 6–8 selected skill objects\n  "tags": string[],        // detected stack tags\n  "zipBase64": string      // base64-encoded ZIP file\n}`}</Block>

            <h3 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text)' }}>Error responses</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                ['400', 'Missing or invalid fields (mode or input)'],
                ['429', 'Rate limit exceeded — 5 forges per IP per day'],
                ['500', 'Upstream error (GitHub API, OpenRouter, or internal)'],
              ].map(([code, desc]) => (
                <div key={code} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '8px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}>
                  <span className="mono" style={{ color: code === '500' ? '#DC2626' : code === '429' ? '#D97706' : 'var(--orange)', fontWeight: 700, width: 32, flexShrink: 0 }}>{code}</span>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="rate-limits" title="Rate Limits">
            <p style={{ marginBottom: 16 }}>
              The Forge API is rate-limited at the edge using an in-memory <Code>Map</Code> keyed by IP address.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Requests per IP', value: '5 / day' },
                { label: 'Reset cadence', value: 'Midnight UTC' },
                { label: 'Reset mechanism', value: 'Timestamp comparison' },
                { label: 'Storage', value: 'In-memory Map' },
              ].map(s => (
                <div key={s.label} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, background: 'var(--bg2)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--orange)', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p>
              The in-memory store resets on server restart (e.g. every Vercel deployment). For stricter production rate-limiting, replace <Code>lib/rateLimit.ts</Code> with a Redis- or KV-backed implementation.
            </p>
          </Section>

          <Section id="self-host" title="Self-Hosting Guide">
            <p style={{ marginBottom: 16 }}>CLAUDE.md Forge can be deployed to any Node.js hosting environment:</p>
            <Block>{`# Vercel (recommended)\nnpm i -g vercel\nvercel --prod\n\n# Or: Node.js server\nnpm run build\nnpm start     # listens on PORT env var, default 3000`}</Block>
            <p style={{ marginBottom: 16 }}>Set the following environment variables in your hosting dashboard:</p>
            <Block>{`OPENROUTER_API_KEY=sk-or-v1-...\nGITHUB_TOKEN=ghp_...          # optional`}</Block>
            <p>No database is required. The rate limiter uses an in-memory Map that resets on process restart.</p>
          </Section>

          <Section id="model-config" title="Model Configuration">
            <p style={{ marginBottom: 16 }}>
              The model is configured in <Code>lib/claude.ts</Code>. To swap models, change the <Code>model</Code> field in the OpenRouter request body:
            </p>
            <Block>{`// lib/claude.ts\nbody: JSON.stringify({\n  model: 'mistralai/ministral-3b-2512',   // change this\n  messages: [...],\n  max_tokens: 2000,\n})`}</Block>
            <p style={{ marginBottom: 16 }}>
              Any OpenRouter-supported model can be used. Faster / cheaper alternatives:
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { id: 'mistralai/ministral-3b-2512', note: 'Default — fast, high quality, cheap' },
                { id: 'mistralai/mistral-small-3.1', note: 'Lightweight, very low cost' },
                { id: 'google/gemini-flash-1.5', note: 'Fast, good instruction following' },
                { id: 'anthropic/claude-3-5-haiku', note: 'Best instruction following, higher cost' },
              ].map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, flexWrap: 'wrap', gap: 8 }}>
                  <code style={{ fontFamily: 'var(--font-dm-mono), DM Mono, monospace', fontSize: 13, color: 'var(--orange)' }}>{m.id}</code>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>{m.note}</span>
                </div>
              ))}
            </div>
          </Section>

        </main>
      </div>
    </PageWrapper>
  )
}
