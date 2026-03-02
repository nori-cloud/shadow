// src/mastra/agents/shadow-reflection.ts
import { Agent } from '@mastra/core/agent'

const SYSTEM_PROMPT = `You are a reflective witness to a shadow work conversation.

Given a dialogue between a user and a depth psychology guide, distill in 2-3 sentences what was genuinely revealed — the underlying pattern, wound, or insight that surfaced beneath the surface of what was discussed.

Write in second person ("You..."). Be specific to what actually emerged. Do not moralize, summarize the plot, or list topics covered. Return only the insight — no preamble, no heading.`

export const shadowReflection = new Agent({
  id: 'shadow-reflection',
  name: 'Shadow Reflection',
  instructions: SYSTEM_PROMPT,
  model: 'deepseek/deepseek-chat',
})
