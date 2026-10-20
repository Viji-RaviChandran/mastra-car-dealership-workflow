import { createTool } from '@mastra/core/tools';
import { buildSql } from '../service/service.js';
import { inputSchema, outputSchema } from '../schema/inputOutputSchema.js';
import { getmObject } from '../config/prompt.js';

export const RP_Tool = createTool({
  id: "RP-Tool",
  description: "Extracts data from the Regional Promotions table",
  inputSchema: inputSchema,
  outputSchema: outputSchema,

  execute: async (props) => {
      const spec = props?.context ?? props?.data ?? props;
    
  
      console.log("============================== Tool was picked 2 =======================================\n", spec);
  
      const mObject = await getmObject(spec.query);
      
      if (!mObject || typeof mObject !== 'object') {
        console.error("mObject is undefined or not an mObject!");
        return { error: "No query parameters received." };
      };
      console.log("the metrics object is in the controller: \n",mObject);
  
      const { sql, params } = buildSql(mObject);
      console.log(`--- GENERATED SQL in the tool ---`, sql);
      console.log(`--- PARAMS in the tool ---`, params);
  
      return { sql, params}
    }
  });