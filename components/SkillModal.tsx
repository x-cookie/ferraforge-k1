'use client'

import Link from 'next/link'
import { Skill, toSlug } from '@/lib/skills'

type Props = {
  skill: Skill | null
  onClose: () => void
}

export default function SkillModal({ skill, onClose }: Props) {
  if (!skill) return null

  function copySnippet() {
    navigator.clipboard.writeText(skill!.snippet)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <span className="badge badge-cat" style={{ marginBottom: 8, display: 'inline-block' }}>{skill.cat}</span>
            <h2 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 24, lineHeight: 1.15 }}>
              {skill.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
              color: 'var(--muted)',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.65, marginBottom: 18 }}>
          {skill.desc}
        </p>

        <div style={{ marginBottom: 14 }}>
          <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, color: 'var(--faint)', textTransform: 'uppercase', marginBottom: 8 }}>
            // compatible with
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skill.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 1.5, color: 'var(--faint)', textTransform: 'uppercase', marginBottom: 8 }}>
            // skill preview
          </div>
          <div className="code-block" style={{ fontSize: 12 }}>
            {skill.snippet}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ fontSize: 13.5, padding: '11px 22px' }} onClick={onClose}>
            Use in Forge 🔨
          </button>
          <button className="btn-outline" style={{ fontSize: 13.5 }} onClick={copySnippet}>
            Copy Skill
          </button>
          <Link
            href={`/skills/${toSlug(skill.title)}`}
            className="btn-outline"
            style={{ fontSize: 13.5 }}
            onClick={onClose}
          >
            Full details →
          </Link>
        </div>
      </div>
    </div>
  )
}
