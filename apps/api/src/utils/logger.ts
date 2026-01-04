import { Context, Next } from "hono";

import pino from "pino";
import path from "path";

const isProduction = Bun.env.NODE_ENV === "production";

const logFilePath =
  Bun.env.LOG_PATH || path.join(process.cwd(), "logs/shop-api.log");

const targets = [];

if (!isProduction) {
  targets.push({
    target: "pino-pretty",
    options: { colorize: true },
    level: "debug",
  });
}

targets.push({
  target: "pino/file",
  options: {
    destination: logFilePath,
    mkdir: true,
  },
  level: isProduction ? "info" : "debug",
});

export const logger = pino({
  level: isProduction ? "info" : "debug",
  transport: {
    targets: targets,
  },
});
