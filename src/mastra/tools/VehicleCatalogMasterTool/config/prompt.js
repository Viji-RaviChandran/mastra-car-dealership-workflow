import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from 'zod';
import { promtMetrics } from '../schema/promptMetrics.js';
import { metricsSchema } from "../schema/inputOutputSchema.js";
import { groq, model } from "../../../model.js"



export async function getmObject(specs){
  console.log("=========================== Went to the prompt to generate the metrics 3 ==================================== ");
  const fullPrompt  = ` userQuer: ${specs}
  ${promtMetrics}`;
  try {
    const mObject = await generateText({
      model: groq(model),
      // schema: metricsSchema,
      prompt: fullPrompt,
      maxOutputTokens: 1000
    });
    const rawText = mObject.text || "";

    // 2. Strip Markdown code fences: ```json ... ``` or ``` ... ```
    const cleanedJson = rawText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, "$1").trim();

    // 3. Parse into a real JavaScript object
    const mMObject = JSON.parse(cleanedJson);

    console.log("=========================== This is the metrics object generated from the prompt ==================================== \n", mMObject);
    return mMObject;

  } catch(err){
    console.log("=================== This is the error ===================\n", err)
  }
}