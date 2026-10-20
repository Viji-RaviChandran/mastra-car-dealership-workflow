export const promtMetrics = `

1. Output ONLY a valid JSON object matching the Instruction below.
2. Do NOT write introductory conversational text 
3. Do NOT wrap the response in markdown code blocks (\`\`\`json). Return raw JSON only.
4. Only including the necessary columns in the feilds of all the below.


valid columns list:
 number columns:
  -CampaignID
  -DiscountValue
  -MinPurchaseRequirement
  -AllocatedBudget

 string columns:
  -CampaignName
  -TargetAudienceTier
  -PromotionalChannel
  -DiscountType
  -CampaignStartDate
  -CampaignEndDate

Your Instruction:
    1.You have to generate the following JSON object:
        - columns:
            i. Has to be array of strings.
            ii. Put the columns that are un-aggregated here.
            iii. Make sure to be case sensitive and cross check the column name with the above valid columns list.
            iv. Only include the necessary columns. Check if the column is necessary with the userQuery above.
        - metrics:
            i. Has to be an array of object containing field, aggregation, alias.
            ii. field:
                . Has to be a string.
                . Columns that needs to be aggregated should be here.
                . Make sure to be case sensitive and cross check the column name with the above valid columns list.
                . Only include the necessary columns in the feild. Check if the column is necessary with the userQuery above.
            iii. aggregation:
                . Use only: ["COUNT", "SUM", "AVG", "MIN", "MAX"].
                . Only use "SUM", "AVG", "MIN", "MAX" on the number columns, check if the column is a number column with the above valid columns list.
            iv. alias:
                . Use a clean, easy to understand, relevent name as an alias.
                . Start with a "number" if the alias has to begin with a number.
        - filters:
            i. Has to be an array of object containing field, operator, value.
            ii. field:
                . Has to be a string.
                . Columns that need to be filtered should be here.
                . Make sure to be case sensitive and cross check the column name with the above valid columns list.
                . Only include the necessary columns in the feild. Check if the column is necessary with the userQuery above.
            iii. operator:
                . Use only: ["like", "not like"] for string columns.
                . Only use "=", "!=", ">", "<", ">=", "<=" for number columns.
            iv. value:
                . Has to be a string or a number.
                . If there is a date mentioned it has to be in the 'YYYY-MM-DD' format as a string.
        - orderBy:
            i. Has to be an object containing field and direction.
            ii. field:
                . Has to be a string.
                . Columns or metric alias that has to be ordered by should be here.
                . Make sure to be case sensitive and cross check the column name with the above valid columns list.
                . Only include the necessary columns in the feild. Check if the column is necessary with the userQuery above.
            iii. direction:
                . Has to be: ["ASC", "DESC"].
                . To order the table in ascending order use "ASC".
                . To order the table in descending order use "DESC".
            iv. This is an optional thing only use if necessary. 
        - limit:
                . Has to be a number.
                . Only positive numbers are allowed.
`