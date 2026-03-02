// src/app/api/shadow/summary/route.ts
import { NextResponse } from 'next/server'
import { mastra } from '@/mastra'

export async function POST(req: Request) {
  const { messages, archetypeName } = await req.json()

  if (!messages?.length) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }

  // Format messages as plain role/content pairs for the agent
  const formatted = messages
    .filter((m: { role: string; content: string }) => m.content?.trim())
    .map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

  const agent = mastra.getAgentById('shadow-reflection')
  const result = await agent.generate(
    [
      ...formatted,
      {
        role: 'user' as const,
        content: `The archetype that opened this session was: ${archetypeName}. Based on everything above, what was genuinely revealed?`,
      },
    ]
  )

  return NextResponse.json({ insight: result.text })
}
