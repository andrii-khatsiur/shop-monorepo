import { join } from "node:path";

interface Env {
  PORT: number;
  NODE_ENV: string;
  LOG_PATH: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  R2_BUCKET_NAME?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_PUBLIC_URL?: string;
}

const env: Env = {
  PORT: Number(Bun.env.PORT || 3000),
  NODE_ENV: Bun.env.NODE_ENV || "development",
  LOG_PATH: Bun.env.LOG_PATH || join(process.cwd(), "logs/shop-api.log"),
  GOOGLE_CLIENT_ID: Bun.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: Bun.env.GOOGLE_CLIENT_SECRET || "",
  JWT_SECRET: Bun.env.JWT_SECRET || "change-me-at-production", // Default for development
  FRONTEND_URL: Bun.env.FRONTEND_URL || "http://localhost:3200",
  R2_BUCKET_NAME: Bun.env.AWS_BUCKET_NAME,
  R2_ACCESS_KEY_ID: Bun.env.AWS_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: Bun.env.AWS_SECRET_ACCESS_KEY,
  R2_PUBLIC_URL: Bun.env.R2_PUBLIC_URL,
};

// Validate required environment variables
const requiredEnvVars: Array<keyof Env> = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "JWT_SECRET",
  "FRONTEND_URL",
];

for (const key of requiredEnvVars) {
  if (!env[key]) {
    // Only throw an error if not in development mode, or if the variable is critical
    if (env.NODE_ENV === "production" || key === "JWT_SECRET") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`Missing optional environment variable: ${key}`);
  }
}

export const ENV = Object.freeze(env);
