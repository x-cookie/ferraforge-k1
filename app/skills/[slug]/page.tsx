import { SKILLS, toSlug } from '@/lib/skills'
import { notFound } from 'next/navigation'
import SkillDetailPage from '@/components/SkillDetailPage'

export function generateStaticParams() {
  return SKILLS.map(s => ({ slug: toSlug(s.title) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = SKILLS.find(s => toSlug(s.title) === slug)
  if (!skill) return {}
  return {
    title: `${skill.title} — Ferra`,
    description: skill.desc,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = SKILLS.find(s => toSlug(s.title) === slug)
  if (!skill) notFound()

  const categorySkills = SKILLS.filter(s => s.cat === skill.cat)
  const idx = categorySkills.findIndex(s => s.id === skill.id)
  const related = categorySkills.filter(s => s.id !== skill.id).slice(0, 3)
  const prev = idx > 0 ? categorySkills[idx - 1] : null
  const next = idx < categorySkills.length - 1 ? categorySkills[idx + 1] : null

  return <SkillDetailPage skill={skill} related={related} prev={prev} next={next} />
}
