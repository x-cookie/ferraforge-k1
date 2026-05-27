'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SKILLS, CATEGORIES, toSlug } from '@/lib/skills'

export default function SkillsGrid() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')

  const filtered = SKILLS.filter(s => {
    const matchCat = activeCat === 'All' || s.cat === activeCat
    const q = search.toLowerCase()
    const matchQ = !q || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q) || s.tags.some(t => t.includes(q))
    return matchCat && matchQ
  })

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="mono muted" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
            {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? SKILLS.length : SKILLS.filter(s => s.cat === cat).length
            return (
              <button
                key={cat}
                className={`cat-chip${activeCat === cat ? ' active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 0' }}>
          <div style={{ fontSize: 36 }}>🔍</div>
          <p style={{ color: 'var(--muted)', marginTop: 12 }}>No skills found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 12 }}>
          {filtered.map(skill => (
            <Link key={skill.id} href={`/skills/${toSlug(skill.title)}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div className="skill-card" style={{ height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <span className="badge badge-cat">{skill.cat}</span>
                  <span className={`badge badge-${skill.diff}`}>{skill.diff}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: 14.5, marginBottom: 7, lineHeight: 1.3, color: 'var(--text)' }}>
                  {skill.title}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 12 }}>
                  {skill.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {skill.tags.slice(0, 3).map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
