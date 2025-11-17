import { Redis } from "@upstash/redis";
import { env } from "@/shared/env";

// Create Upstash Redis client singleton (HTTP/REST)
let redisClient: Redis | null = null;

function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redisClient;
}

/**
 * Generate a cache key from function name and input data
 */
function generateCacheKey(functionName: string, input?: unknown): string {
  const inputStr = input ? JSON.stringify(input) : "";
  return `cache:${functionName}:${inputStr}`;
}

/**
 * Cache wrapper for server functions
 * @param fn - The function to cache (should be a no-arg function that returns a Promise)
 * @param functionName - Unique name for the function (used in cache key)
 * @param ttlSeconds - Time to live in seconds (default: 7200 = 2 hours)
 * @param input - The input data to use for cache key generation
 * @returns A Promise with the cached or fresh result
 */
export async function withCache<T>(
  fn: () => Promise<T>,
  functionName: string,
  input?: unknown,
  ttlSeconds = 7200 // 2 hours default
): Promise<T> {
  const redis = getRedisClient();
  const cacheKey = generateCacheKey(functionName, input);

  try {
    // Try to get from cache
    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // Cache miss - execute function
    const result = await fn();

    // Store in cache
    await redis.set(cacheKey, JSON.stringify(result), { ex: ttlSeconds });

    return result;
  } catch {
    // If Redis fails, fall back to executing the function
    return fn();
  }
}

/**
 * Invalidate cache entries matching a pattern
 * @param pattern - Redis key pattern (e.g., "cache:getProductDetails:*")
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const redis = getRedisClient();
  try {
    // Using KEYS for simplicity; consider SCAN for very large keyspaces
    const keys = await redis.keys(pattern);
    if (Array.isArray(keys) && keys.length > 0) {
      // @upstash/redis expects spread
      await redis.del(...(keys as string[]));
    }
  } catch {
    // Swallow invalidation errors to avoid breaking callers
  }
}

/**
 * Clear all cache entries for a specific function
 * @param functionName - The function name to clear cache for
 */
export async function clearFunctionCache(functionName: string): Promise<void> {
  await invalidateCache(`cache:${functionName}:*`);
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
  await invalidateCache("cache:*");
}
