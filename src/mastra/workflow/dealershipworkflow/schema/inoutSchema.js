import { z } from "zod";

export const outputSchema1Input2 = z.object({
  query: z.string(),
  status: z.enum(["positive", "negative"]),
  reason: z.string(),
});

export const outputSchema2Input3 = z.object({
  query: z.string(),
  sqlQuery: z.string().nullable(),
  params: z.record(z.string(), z.unknown()),
  status: z.enum(["positive", "negative"]),
  reason: z.string().nullable()
});

export const outputSchema3Input4 = z.object({
  query: z.string(),
  data: z.array(z.record(z.string(), z.unknown())),
  error: z.string().nullable(),
  status: z.enum(["positive", "negative"]),
  reason: z.string().nullable(),
});