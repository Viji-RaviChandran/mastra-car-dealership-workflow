import { createStep } from "@mastra/core/workflows";
import { outputSchema2Input3, outputSchema3Input4 } from "../schema/inoutSchema.js";
import { executeQuery } from "../../../db.js";

export const dbExecutionStep = createStep({
  id: "db-execution",
  inputSchema: outputSchema2Input3,
  outputSchema: outputSchema3Input4,

  execute: async ({ inputData }) => {
    if (inputData.status === "negative" || !inputData.sqlQuery) {
      return {
        query: inputData.query,
        data: [],
        error: null,
        status: inputData.status,
        reason: inputData.reason
      };
    }
    console.log(`============================ sql in the step 3 ===============================\n`, inputData.sqlQuery, `\n`, inputData.params)

    try {
      const result = await executeQuery(
        inputData.sqlQuery,
        inputData.params
      );
      console.log(`=====================`,result,`===============================`);
      return {
        query: inputData.query,
        data: Array.isArray(result) ? result : [],
        error: null,
        status: inputData.status,
        reason: inputData.reason,
      };
     //always geting caught ( the query was genuenly wrong till now ) 
    } catch (err) {
      console.log(err) 
    }
  },
});