import { semanticAnalysisStep } from "../steps/step1_semanticAnalysisStep.js";
import { sqlBuilderStep } from "../steps/step2_sqlBuilderStep.js"; 
import { dbExecutionStep } from "../steps/step3_dbExecutionStep.js";
import { responseFormatterStep } from "../steps/step4_responseFormatterStep.js";
import { createWorkflow } from "@mastra/core/workflows";
import { z } from 'zod';

//deal with the imports 



export const dealershipWorkflow = createWorkflow({
  id: 'dealership-query-workflow',
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
})
  .then(semanticAnalysisStep)
  .then(sqlBuilderStep)
  .then(dbExecutionStep)
  .then(responseFormatterStep)
  .commit();