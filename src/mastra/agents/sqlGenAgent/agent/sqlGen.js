import { Agent } from '@mastra/core/agent'
import { groq } from '@ai-sdk/groq'
import { agentPrompt } from '../prompt/prompt.js';
import { model } from '../../../'
import { DL_Tool } from '../../../tools/DealershipLocationsTool/controller/DL_Tool.js';
import { RP_Tool } from '../../../tools/RegionalPromotionsTool/contoller/RP_Tool.js';
import { VCM_Tool } from '../../../tools/VehicleCatalogMasterTool/contoller/VCM_Tool.js';

export const sqlGenAgent = new Agent({
  name: 'sqlGenerator',
  instructions: agentPrompt,
  model: 'groq/openai/gpt-oss-120b',
  tools:{
    DL_Tool,
    RP_Tool,
    VCM_Tool
  }
});