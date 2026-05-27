'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Skill, toSlug } from '@/lib/skills'

type Props = {
  skill: Skill | null
  onClose: () => void
}

export default function SkillModal({ skill, onClose }: Props) {
  useEffect(() => {
    if (!skill) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [skill, onClose])

  if (!skill) return null

  function copySnippet() {
    navigator.clipboard.writeText(skill!.snippet)
  }

  return createPortal(
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog-panel"
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <span className="badge badge-cat" style={{ marginBottom: 8, display: 'inline-block' }}>{skill.cat}</span>
            <h2 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>
              {skill.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
              fontSize: 18, color: 'var(--muted)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
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
          <Link
            href={`/skills/${toSlug(skill.title)}`}
            className="btn-primary"
            style={{ fontSize: 13.5, padding: '11px 22px' }}
            onClick={onClose}
          >
            Full details →
          </Link>
          <button className="btn-outline" style={{ fontSize: 13.5 }} onClick={copySnippet}>
            Copy Skill
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
