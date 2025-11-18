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

const parsed = z
  .object({
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  })
  .parse(process.env);

const serverUrl = getServerUrl();

if (typeof window === "undefined") {
  console.info(
    `[env] VITE_SERVER_URL resolved from ${serverUrl.source}: ${serverUrl.url}`
  );
}

// VITE_SERVER_URL is auto-computed from platform env vars (used in prefetch-images and auth/server)
export const env = {
  ...parsed,
  VITE_SERVER_URL: serverUrl.url,
};

// // import { z } from "zod";
// export const env = z
//   .object({
//     DATABASE_URL: z.string(),
//     VITE_SERVER_URL: z.string(),
//     BETTER_AUTH_SECRET: z.string(),
//     UPSTASH_REDIS_REST_URL: z.string(),
//     UPSTASH_REDIS_REST_TOKEN: z.string(),
//   })
//   .parse(process.env);
