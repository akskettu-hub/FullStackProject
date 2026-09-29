// Mostly LLM generated: Claude Sonnet 5 medium
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3003),
  DATABASE_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid enironment variables:", z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
