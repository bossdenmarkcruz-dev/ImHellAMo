import { z } from "zod";

export const bypassRequestSchema = z.object({
  cookie: z.string().min(1, "Cookie is required").max(5000),
  timestamp: z.string().optional(),
});

export type BypassRequest = z.infer<typeof bypassRequestSchema>;

export const bypassResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type BypassResponse = z.infer<typeof bypassResponseSchema>;
