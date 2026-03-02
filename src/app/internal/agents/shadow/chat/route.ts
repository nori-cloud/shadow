import { NextRequest, NextResponse } from 'next/server'
import { Agent } from '@mastra/core/agent'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.messages) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 })
  }
  const { systemPrompt, messages } = body

  const agent = new Agent({
    id: 'shadow-playground',
    name: 'Shadow Playground',
    instructions: systemPrompt,
    model: 'deepseek/deepseek-chat',
  })

  const result = await agent.generate(messages)

  if (!result.text) {
    return NextResponse.json({ error: 'Agent returned no text' }, { status: 500 })
  }

  return NextResponse.json({ text: result.text })
}
