import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RESOURCE_ID = 'weather-chat'

async function getMemory() {
  return mastra.getAgentById('weather-agent').getMemory()
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memory = await getMemory()
  if (!memory) {
    return NextResponse.json({ error: 'Memory not configured' }, { status: 500 })
  }

  try {
    const result = await memory.recall({
      threadId: id,
      resourceId: RESOURCE_ID,
      perPage: false,
    })
    const messages = (result?.messages ?? []).map(m => ({
      role: m.role,
      text: (m.content?.parts ?? [])
        .filter((p: { type: string }) => p.type === 'text')
        .map((p: { text: string }) => p.text)
        .join(''),
    }))
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memory = await getMemory()
  if (!memory) {
    return NextResponse.json({ error: 'Memory not configured' }, { status: 500 })
  }

  await memory.deleteThread(id)
  return NextResponse.json({ ok: true })
}
