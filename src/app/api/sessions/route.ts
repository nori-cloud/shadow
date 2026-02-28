import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const RESOURCE_ID = 'weather-chat'

async function getMemory() {
  return mastra.getAgentById('weather-agent').getMemory()
}

export async function GET() {
  const memory = await getMemory()
  if (!memory) {
    return NextResponse.json({ error: 'Memory not configured' }, { status: 500 })
  }

  const result = await memory.listThreads({
    filter: { resourceId: RESOURCE_ID },
    perPage: false,
    orderBy: { field: 'updatedAt', direction: 'DESC' },
  })

  return NextResponse.json(result.threads)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '7', 10)

  const memory = await getMemory()
  if (!memory) {
    return NextResponse.json({ error: 'Memory not configured' }, { status: 500 })
  }

  const result = await memory.listThreads({
    filter: { resourceId: RESOURCE_ID },
    perPage: false,
  })

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const stale = result.threads.filter(t => new Date(t.updatedAt) < cutoff)

  await Promise.all(stale.map(t => memory.deleteThread(t.id)))

  return NextResponse.json({ deleted: stale.length })
}
