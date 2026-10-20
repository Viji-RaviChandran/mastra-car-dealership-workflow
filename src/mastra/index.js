import { Mastra } from '@mastra/core';
import { guardrailAgent } from './agents/guardrailAgent/agent/guardrail.js';
import { responderAgent } from './agents/responderAgent/agent/responder.js';
import { sqlGenAgent } from './agents/sqlGenAgent/agent/sqlGen.js';
import { dealershipWorkflow } from './workflow/dealershipworkflow/workflow/workflow.js';

export const mastra = new Mastra({
  agents: {
    guardrailAgent,
    sqlGenAgent,
    responderAgent,
  },
  workflows: {
    dealershipWorkflow,
  },
});