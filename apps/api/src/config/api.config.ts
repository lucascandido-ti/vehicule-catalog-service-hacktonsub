import { z } from "zod";

export const CacheConfig = z.object({
  max: z.coerce.number().default(10),
  ttl: z.coerce.number().default(5000),
});
export type CacheConfig = z.infer<typeof CacheConfig>;

export const ThrottlerConfig = z.object({
  limit: z.coerce.number().default(1000),
  ttl: z.coerce.number().default(60),
});
export type ThrottlerConfig = z.infer<typeof ThrottlerConfig>;

export const ApiConfig = z.object({
  cache: CacheConfig,
  throttler: ThrottlerConfig,
});
export type ApiConfig = z.infer<typeof ApiConfig>;
