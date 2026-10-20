import { createStep } from "@mastra/core/workflows";
import { outputSchema1Input2, outputSchema2Input3 } from "../schema/inoutSchema.js";
import { sqlGenAgent } from "../../../agents/sqlGenAgent/agent/sqlGen.js";

export const sqlBuilderStep = createStep({
  id: "sql-builder",
  inputSchema: outputSchema1Input2,
  outputSchema: outputSchema2Input3,
  execute: async ({ inputData }) => {
    // console.log(`============================ Input data ==========================\n`,inputData.query);
    // console.log(inputData.reason,`\n`, inputData.status);

    // 1. Short-circuit if rejected in Step 1
    if (inputData.status === "negative") {
      return {
        query: inputData.query,
        sqlQuery: null,
        params: {},
        status: inputData.status,
        reason: inputData.reason,
      };
    }

    // 2. Run the agent and allow it to invoke the tool (maxSteps enables tool execution)
    const res = await sqlGenAgent.generate(inputData.query, {
      maxSteps: 1,
    });
    
    
    // 3. Extract the output from the tool execution
    let rawOutput = null;

    if (res.toolResults && res.toolResults.length > 0) {
      rawOutput = res.toolResults[0];
    } else if (res.steps && res.steps.length > 0) {
      const stepWithTool = res.steps.find((s) => s.toolResults && s.toolResults.length > 0);
      rawOutput = stepWithTool?.toolResults?.[0];
    }

    // Dig through Mastra's payload nesting:
    let toolResult = rawOutput?.payload?.result ?? rawOutput?.result ?? rawOutput;

    // Parse if stringified
    if (typeof toolResult === "string") {
      try {
        toolResult = JSON.parse(toolResult);
      } catch (e) {
        console.warn("Could not parse tool result string:", e);
      }   
    }


    const sqlQuery = toolResult?.sql ?? null;
    const params = toolResult?.params ?? {};
    console.log(`============================ sql in the step 2 ===============================\n`, sqlQuery, `\n`, params)

    return {
      query: inputData.query,
      sqlQuery,
      params,
      status: inputData.status,
      reason: inputData.reason, 
    };
    
    
  },
});