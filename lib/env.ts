import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional().default("postgres://postgres:postgres@localhost:5432/portfolio"),
  NEXTAUTH_SECRET: z.string().min(8).optional().default("development_secret_min_32_characters_here"),
  NEXTAUTH_URL: z.string().url().optional().default("http://localhost:3000"),
  GITHUB_ID: z.string().optional().default("TODO_GITHUB_ID"),
  GITHUB_SECRET: z.string().optional().default("TODO_GITHUB_SECRET"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NOTIFICATION_EMAIL: z.string().email().optional().default("hi@jagannath.dev"),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  ANALYTICS_SALT_SECRET: z.string().optional().default("insecure-dev-salt-change-in-production"),
  RETENTION_DAYS: z.coerce.number().default(90),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = envSchema.parse(process.env);
