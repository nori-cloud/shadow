import { handleChatStream } from '@mastra/ai-sdk'
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
import { createUIMessageStreamResponse } from 'ai'
import { cookies } from 'next/headers'
import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

const RESOURCE_ID = 'shadow-dialogue'

export async function POST(req: Request) {
  const sessionId = (await cookies()).get('shadow-session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const params = await req.json()
  const stream = await handleChatStream({
    mastra,
    agentId: 'shadow-dialogue',
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread: sessionId,
        resource: RESOURCE_ID,
      },
    },
  })
  return createUIMessageStreamResponse({ stream })
}

export async function GET() {
  const sessionId = (await cookies()).get('shadow-session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const memory = await mastra.getAgentById('shadow-dialogue').getMemory()
  let response = null

  try {
    response = await memory?.recall({
      threadId: sessionId,
      resourceId: RESOURCE_ID,
    })
  } catch {
    console.log('No previous shadow messages found.')
  }

  const uiMessages = toAISdkV5Messages(response?.messages || [])
  return NextResponse.json(uiMessages)
}
