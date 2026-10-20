import { createStep } from "@mastra/core/workflows";
import { outputSchema1Input2 } from "../schema/inoutSchema.js";
import { guardrailAgent } from "../../../agents/guardrailAgent/agent/guardrail.js";
import { z } from "zod";

const guardrailOutputSchema = z.object({
  status: z.enum(["positive", "negative"]),
  reason: z.string(),
});

export const semanticAnalysisStep = createStep({
  id: "semantic-analysis",
  inputSchema: z.object({
    query: z.string(),
  }),
  outputSchema: outputSchema1Input2,
  execute: async ({ inputData }) => {
    // Log the incoming query for workflow visibility
    console.log("User query:", inputData.query);

    // Call the guardrail agent
    const res = await guardrailAgent.generate(inputData.query, {
      output: guardrailOutputSchema,
    });


    // Resolve the parsed object across Mastra and model variations
    let parsed = res?.object;

    // Fallback: If res.object is undefined, attempt manual JSON parse from text
    if (!parsed && res?.text) {
      try {
        const cleanJson = res.text
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();
        parsed = JSON.parse(cleanJson);
      } catch (err) {
        const statusMatch = res.text.match(/(?:^|\n)\s*[-*]?\s*status\s*:\s*["']?(positive|negative)\b/i);
        const reasonMatch = res.text.match(/(?:^|\n)\s*[-*]?\s*reason\s*:\s*([\s\S]*?)(?=\n\s*[-*]?\s*\w+\s*:|$)/i);

        if (statusMatch) {
          parsed = {
            status: statusMatch[1].toLowerCase(),
            reason: reasonMatch?.[1].trim().replace(/^["']|["']$/g, ""),
          };
        } else {
          console.error("Could not parse guardrail response; rejecting query. Raw model text:");
        }
      }
    }

    // Determine final status and reason with safe fallbacks
    const status = parsed?.status === "positive" ? "positive" : "negative";
    const reason = //always goes to the or part 
      parsed?.reason ||
      (status === "negative"
        ? "Query rejected by security guardrail or schema extraction failed."
        : "Query validated successfully.");

    return {
      query: inputData.query,
      status,
      reason,
    };
    
  },
});