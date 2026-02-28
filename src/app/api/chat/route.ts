import { handleChatStream } from '@mastra/ai-sdk'
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
import { createUIMessageStreamResponse } from 'ai'
import { cookies } from 'next/headers'
import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

const RESOURCE_ID = 'weather-chat'

export async function POST(req: Request) {
  const sessionId = (await cookies()).get('chat-session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const params = await req.json()
  const stream = await handleChatStream({
    mastra,
    agentId: 'weather-agent',
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
  const sessionId = (await cookies()).get('chat-session')?.value

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }

  const memory = await mastra.getAgentById('weather-agent').getMemory()
  let response = null

  try {
    response = await memory?.recall({
      threadId: sessionId,
      resourceId: RESOURCE_ID,
    })
  } catch {
    console.log('No previous messages found.')
  }

  const uiMessages = toAISdkV5Messages(response?.messages || [])

  return NextResponse.json(uiMessages)
}
