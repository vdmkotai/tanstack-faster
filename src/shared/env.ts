import { z } from "zod";

function computeServerUrl(): string | undefined {
  const explicit = process.env.VITE_SERVER_URL;
  if (explicit && /^https?:\/\//.test(explicit)) {
    return explicit.replace(/\/+$/, "");
  }
  const vercelHost = process.env.VERCEL_URL;
  if (vercelHost) {
    return `https://${vercelHost}`.replace(/\/+$/, "");
  }
  const railwayDomain =
    process.env.RAILWAY_PUBLIC_DOMAIN ||
    process.env.RAILWAY_STATIC_URL ||
    process.env.RAILWAY_URL;
  if (railwayDomain) {
    const hasProtocol = /^https?:\/\//.test(railwayDomain);
    const url = hasProtocol ? railwayDomain : `https://${railwayDomain}`;
    return url.replace(/\/+$/, "");
  }
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl) {
    return renderUrl.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:8080";
  }
  return undefined;
}

const Parsed = z
  .object({
    DATABASE_URL: z.string(),
    VITE_SERVER_URL: z
      .string()
      .optional()
      .transform(() => computeServerUrl())
      .refine(
        (val): val is string => typeof val === "string" && val.length > 0,
        {
          message:
            "VITE_SERVER_URL is required or must be derivable from platform env (VERCEL_URL / RENDER_EXTERNAL_URL / RAILWAY_*).",
        }
      ),
    BETTER_AUTH_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
  })
  .parse(process.env);

export const env = {
  ...Parsed,
  VITE_SERVER_URL: Parsed.VITE_SERVER_URL,
};
