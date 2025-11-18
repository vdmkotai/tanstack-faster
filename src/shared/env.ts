import { z } from "zod";

// Auto-detect server URL from platform env vars, fallback to localhost in dev
function getServerUrl(): string {
  // Explicit override
  // if (process.env.VITE_SERVER_URL) {
  //   return process.env.VITE_SERVER_URL.replace(/\/+$/, "");
  // }

  // // Vercel production URL (if available)
  // if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  //   const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  //   return url.startsWith("http") ? url : `https://${url}`;
  // }

  // // Vercel branch/preview URL
  // if (process.env.VERCEL_BRANCH_URL) {
  //   const url = process.env.VERCEL_BRANCH_URL;
  //   return url.startsWith("http") ? url : `https://${url}`;
  // }

  // // Vercel fallback (always available)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL.startsWith("http")
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_BRANCH_URL) {
    return process.env.VERCEL_BRANCH_URL.startsWith("http")
      ? process.env.VERCEL_BRANCH_URL
      : `https://${process.env.VERCEL_BRANCH_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Railway
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  // // Render
  // if (process.env.RENDER_EXTERNAL_URL) {
  //   return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, "");
  // }

  // Local dev fallback
  return "http://localhost:8080";
}

const parsed = z
  .object({
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  })
  .parse(process.env);

// VITE_SERVER_URL is auto-computed from platform env vars (used in prefetch-images and auth/server)
export const env = {
  ...parsed,
  VITE_SERVER_URL: getServerUrl(),
};
