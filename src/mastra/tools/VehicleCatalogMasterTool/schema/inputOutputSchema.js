import { z } from "zod";

export const inputSchema = z.object({
  query: z.string(),
});

export const outputSchema = z.object({
  sql: z.string().nullable(),
  params: z.record(z.string(), z.unknown()),
});

export const metricsSchema = z.object({
  columns: z.array(z.string()).describe("Un-aggregated columns to select"),
  metrics: z.array(
    z.object({
      field: z.string().describe("Column to aggregate"),
      aggregation: z.enum(["COUNT", "SUM", "AVG", "MIN", "MAX"]),
      alias: z.string(),
    })
  ),
  filters: z.array(
    z.object({
      field: z.string(),
      operator: z.enum(["=", "!=", ">", "<", ">=", "<=", "LIKE", "NOT"]),
      value: z.union([z.string(), z.number()]),
    })
  ),
  orderBy: z.object({
    field: z.string(),
    direction: z.enum(["ASC", "DESC"]),
  }).nullable(),
  limit: z.number().nullable(),
});