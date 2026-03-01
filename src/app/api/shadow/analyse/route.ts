import { NextResponse } from 'next/server'
import { mastra } from '@/mastra'
import { archetypes } from '@/mastra/data/archetypes'
import { analysisSchema } from '@/mastra/agents/shadow-analyst'

export async function POST(req: Request) {
  const { input } = await req.json()

  if (!input?.trim()) {
    return NextResponse.json({ error: 'input required' }, { status: 400 })
  }

  const agent = mastra.getAgentById('shadow-analyst')
  const result = await agent.generate(
    [{ role: 'user', content: input }],
    { structuredOutput: { schema: analysisSchema } }
  )

  const analysis = result.object as ReturnType<typeof analysisSchema.parse>
  const archetype = archetypes.find(a => a.id === analysis.archetypeId)

  return NextResponse.json({
    ...analysis,
    gift: archetype?.gift ?? '',
    shadow: archetype?.shadow ?? '',
    lifeStage: archetype?.lifeStage ?? '',
    jungSaid: archetype?.jungSaid ?? '',
    invitation: archetype?.invitation ?? '',
  })
}
