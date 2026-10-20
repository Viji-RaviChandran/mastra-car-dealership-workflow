import { Agent } from '@mastra/core/agent'
import { groq } from '@ai-sdk/groq'
import { agentPrompt } from '../prompt/prompt.js';
import { model } from '../../../model.js'

export const responderAgent = new Agent({
  name: 'ResponderAgent',
  instructions: agentPrompt,
  model: 'groq/openai/gpt-oss-120b'
});