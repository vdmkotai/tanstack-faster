import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

type ServerUrlResult = {
  source: string;
  url: string;
};

// Auto-detect server URL from platform env vars, fallback to localhost in dev
function getServerUrl(): ServerUrlResult {
  const normalize = (url: string): string =>
    url.startsWith("http") ? url : `https://${url}`;

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return {
      source: "VERCEL_PROJECT_PRODUCTION_URL",
      url: normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL),
    };
  }

  if (process.env.VERCEL_BRANCH_URL) {
    return {
      source: "VERCEL_BRANCH_URL",
      url: normalize(process.env.VERCEL_BRANCH_URL),
    };
  }

  // if (process.env.VERCEL_URL) {
  //   return { source: "VERCEL_URL", url: normalize(process.env.VERCEL_URL) };
  // }

  // THIS WORKS FINE ON RAILWAY
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return {
      source: "RAILWAY_PUBLIC_DOMAIN",
      url: `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
    };
  }

  return { source: "localhost", url: "http://localhost:8080" };
}

const serverUrlResult = getServerUrl();
const defaultServerUrl = serverUrlResult.url;

if (typeof window === "undefined" && !process.env.VITE_SERVER_URL) {
  console.info(
    `[env] VITE_SERVER_URL resolved from ${serverUrlResult.source}: ${serverUrlResult.url}`
  );
}

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_SERVER_URL: z.url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    VITE_SERVER_URL: process.env.VITE_SERVER_URL || defaultServerUrl,
  },
  emptyStringAsUndefined: true,
});
