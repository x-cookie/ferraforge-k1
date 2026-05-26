const MANIFEST_PATTERNS = [
  'package.json', 'tsconfig.json', 'next.config.', 'vite.config.',
  'tailwind.config.', 'prisma/schema.prisma', 'requirements.txt',
  'pyproject.toml', 'go.mod', 'Cargo.toml', '.eslintrc', 'README.md',
]

function isManifest(path: string): boolean {
  const lower = path.toLowerCase()
  return MANIFEST_PATTERNS.some(p => lower === p || lower.endsWith('/' + p) || lower.startsWith(p))
}

async function fetchBatch(urls: string[], headers: Record<string, string>): Promise<string[]> {
  return Promise.all(
    urls.map(url =>
      fetch(url, { headers })
        .then(r => r.ok ? r.text() : '')
        .catch(() => '')
    )
  )
}

export async function packRepo(githubUrl: string): Promise<string> {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) throw new Error('Invalid GitHub URL')
  const [, owner, repo] = match
  const cleanRepo = repo.replace(/\.git$/, '')

  const headers: Record<string, string> = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}

  // Get default branch
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, { headers })
  if (!repoRes.ok) throw new Error(`GitHub API error: ${repoRes.status}`)
  const repoData = await repoRes.json()
  const branch = repoData.default_branch as string

  // Get file tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/${branch}?recursive=1`,
    { headers }
  )
  if (!treeRes.ok) throw new Error(`Tree fetch error: ${treeRes.status}`)
  const treeData = await treeRes.json()

  const files: string[] = (treeData.tree as Array<{ path: string; type: string }>)
    .filter(f => f.type === 'blob' && isManifest(f.path))
    .map(f => f.path)
    .slice(0, 20)

  // Fetch in batches of 10
  const rawBase = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${branch}/`
  const batches: string[][] = []
  for (let i = 0; i < files.length; i += 10) {
    batches.push(files.slice(i, i + 10))
  }

  let packed = `// Repository: ${owner}/${cleanRepo}\n// Branch: ${branch}\n\n`
  for (const batch of batches) {
    const contents = await fetchBatch(batch.map(f => rawBase + f), headers)
    batch.forEach((path, i) => {
      if (contents[i]) {
        packed += `// ${path}\n${contents[i]}\n\n`
      }
    })
  }

  return packed.slice(0, 32000)
}
