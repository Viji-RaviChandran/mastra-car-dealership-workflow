import { createStep } from "@mastra/core/workflows";
import { outputSchema3Input4 } from "../schema/inoutSchema.js";
import { responderAgent } from "../../../agents/responderAgent/agent/responder.js";
import { z } from 'zod';

export const responseFormatterStep = createStep({
  id: 'response-formatter',
  inputSchema: outputSchema3Input4,
  outputSchema: z.object({
    finalAnswer: z.string(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.status=='negative') {
      return {
        finalAnswer: `Request cannot be processed: \n${inputData.reason}'}`,
      };
    }

    if (inputData.error) {
      return {
        finalAnswer: `An issue occurred while querying records: \n${inputData.error}`,
      };
    }

    const prompt = `
User Query: ${ inputData.query }
Data: ${JSON.stringify(inputData.data, null, 2)}

Provide a clean response presenting these details to the user.`;

    const res = await responderAgent.generate(prompt);
    return {
      finalAnswer: res.text,
    };
  },
});