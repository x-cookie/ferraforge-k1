'use client'

import Link from 'next/link'
import SkillsGrid from '@/components/SkillsGrid'
import PageWrapper from '@/components/PageWrapper'
import Reveal from '@/components/Reveal'

export default function SkillsPage() {
  return (
    <PageWrapper>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <div className="logo-mark">🔨</div>
            <span className="nav-logo-text">CLAUDE<span className="orange">.md</span> Forge</span>
          </Link>
          <Link href="/" className="nav-link">Home</Link>
          <span className="nav-link active">Skills Library</span>
          <span className="nav-link muted">Docs</span>
          <div className="nav-spacer" />
          <Link href="/" className="nav-cta">Start Forging →</Link>
        </div>
      </nav>

      <section style={{ padding: '60px 28px 36px' }}>
        <div className="container">
          <Reveal>
            <span className="section-label">Skill Library</span>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="editorial-h" style={{ marginBottom: 32 }}>
              59 Claude Code<br /><em>Skills.</em>
            </h1>
          </Reveal>
          <SkillsGrid />
        </div>
      </section>
    </PageWrapper>
  )
}
