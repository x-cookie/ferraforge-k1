'use client'

import { useState } from 'react'
import Link from 'next/link'
import SkillsGrid from '@/components/SkillsGrid'
import SkillModal from '@/components/SkillModal'
import PageWrapper from '@/components/PageWrapper'
import Reveal from '@/components/Reveal'
import { Skill } from '@/lib/skills'

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

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
          <Reveal delay={2}>
            <SkillsGrid onOpenModal={setSelectedSkill} />
          </Reveal>
        </div>
      </section>

      <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </PageWrapper>
  )
}
