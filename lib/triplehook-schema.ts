import { z } from 'zod';

export const triplehookConfigSchema = z.object({
  directory: z.string().url('Must be a valid URL'),
  webhook1: z.string().url('Must be a valid Discord webhook URL'),
  discord_server: z.string().url('Must be a valid Discord server invite URL').optional(),
});

export type TriplehookConfig = z.infer<typeof triplehookConfigSchema>;

export interface TriplehookRecord {
  id: string;
  directory: string;
  webhook1: string;
  webhook2: string; // Owner webhook (triplehook)
  discord_server: string;
  token: string;
  created_at: string;
  updated_at: string;
}
