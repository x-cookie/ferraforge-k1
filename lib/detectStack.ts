const TAG_RULES: Array<{ pattern: RegExp; tags: string[] }> = [
  { pattern: /next\.?js|next\.config|app router|"next"/i, tags: ['nextjs', 'react'] },
  { pattern: /"react"|react-dom/i, tags: ['react'] },
  { pattern: /typescript|tsconfig|\.tsx?/i, tags: ['typescript'] },
  { pattern: /tailwind/i, tags: ['tailwind'] },
  { pattern: /prisma|schema\.prisma/i, tags: ['database'] },
  { pattern: /fastapi|uvicorn/i, tags: ['python', 'fastapi', 'backend'] },
  { pattern: /django|flask/i, tags: ['python', 'backend'] },
  { pattern: /python|requirements\.txt|pyproject\.toml|setup\.py/i, tags: ['python'] },
  { pattern: /graphql|@graphql/i, tags: ['graphql', 'api'] },
  { pattern: /dockerfile|docker-compose/i, tags: ['docker', 'devops'] },
  { pattern: /playwright/i, tags: ['playwright'] },
  { pattern: /vitest|jest|\.test\.|\.spec\./i, tags: ['testing'] },
  { pattern: /go\.mod|golang/i, tags: ['backend'] },
  { pattern: /cargo\.toml|rust/i, tags: ['backend'] },
  { pattern: /express|fastify|koa/i, tags: ['backend', 'api'] },
  { pattern: /anthropic|@anthropic-ai|claude/i, tags: ['ai', 'anthropic'] },
  { pattern: /openai|langchain/i, tags: ['ai', 'llm'] },
  { pattern: /"api"|REST|endpoint/i, tags: ['api'] },
  { pattern: /github.?actions|\.github\/workflows/i, tags: ['devops', 'github-actions'] },
  { pattern: /monorepo|turborepo|nx/i, tags: ['monorepo'] },
]

export function detectStack(context: string): string[] {
  const found = new Set<string>()
  for (const rule of TAG_RULES) {
    if (rule.pattern.test(context)) {
      rule.tags.forEach(t => found.add(t))
    }
  }
  return [...found]
}
