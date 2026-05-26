import { Skill } from './skills'

export function selectSkills(tags: string[], skills: Skill[]): Skill[] {
  const scored = skills.map(skill => {
    let score = 0
    for (const tag of skill.tags) {
      if (tag === 'universal') {
        score += 0.3
      } else if (tags.includes(tag)) {
        score += 1
      }
    }
    return { skill, score }
  })

  scored.sort((a, b) => b.score - a.score)

  const selected = scored
    .filter(s => s.score > 0)
    .slice(0, 8)
    .map(s => s.skill)

  // Always include at least one universal skill if nothing scored well
  if (selected.length < 3) {
    const universals = skills.filter(s => s.tags.includes('universal') && !selected.includes(s))
    selected.push(...universals.slice(0, 3 - selected.length))
  }

  return selected.slice(0, 8)
}
