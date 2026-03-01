import { Agent } from '@mastra/core/agent'
import { z } from 'zod'
import { buildMatchingPrompt } from '../data/archetypes'

export const analysisSchema = z.object({
  archetypeId: z.string(),
  archetypeName: z.string(),
  shadowName: z.string(),
  matchReason: z.string(),
  deeperQuestion: z.string(),
  exercise: z.array(z.string()).length(2),
  confidence: z.enum(['high', 'medium', 'low']),
})

export type ArchetypeAnalysis = z.infer<typeof analysisSchema>

const SYSTEM_PROMPT = `You are a Jungian shadow analyst. Given a user's feelings, thoughts, or situation, identify which of the following archetypes best matches their current psychological pattern.

Return ONLY valid JSON matching the schema — no prose, no explanation outside the JSON.

## Archetypes Reference

${buildMatchingPrompt()}

## Instructions

- Pick the single best-matching archetype from the list above
- archetypeId must be the exact id string from the list (e.g. "the-ruler")
- matchReason: 2-3 sentences explaining why this archetype fits
- deeperQuestion: a probing question that invites self-reflection (from the archetype's core tension)
- exercise: exactly 2 short action items (strings, not objects)
- confidence: "high" if the match is clear, "medium" if plausible, "low" if uncertain

Do not moralize. Do not offer solutions. Just mirror clearly.`

export const shadowAnalyst = new Agent({
  id: 'shadow-analyst',
  name: 'Shadow Analyst',
  instructions: SYSTEM_PROMPT,
  model: 'deepseek/deepseek-chat',
})
