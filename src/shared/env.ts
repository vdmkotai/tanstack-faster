import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.string(),
    VITE_SERVER_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  })
  .parse(process.env);
