import { NextRequest, NextResponse } from 'next/server'
import { packRepo } from '@/lib/github'
import { detectStack } from '@/lib/detectStack'
import { selectSkills } from '@/lib/selectSkills'
import { callClaude } from '@/lib/claude'
import { buildZip } from '@/lib/buildZip'
import { checkRateLimit } from '@/lib/rateLimit'
import { SKILLS } from '@/lib/skills'

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. 5 forges per day.' }, { status: 429 })
  }

  let body: { mode: string; input: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { mode, input } = body
  if (!input?.trim() || !['url', 'describe'].includes(mode)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
  }

  try {
    let stackContext: string
    if (mode === 'url') {
      stackContext = await packRepo(input.trim())
    } else {
      stackContext = input.trim()
    }

    const tags = detectStack(stackContext)
    const selected = selectSkills(tags, SKILLS)
    const claudeMd = await callClaude(stackContext, selected)
    const zipBuffer = buildZip(claudeMd, selected)
    const zipBase64 = zipBuffer.toString('base64')

    return NextResponse.json({
      claudeMd,
      skills: selected,
      tags,
      zipBase64,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error'
    console.error('Forge error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
