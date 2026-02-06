import pino from "pino";

import { ENV } from "../config/env";

const isProduction = ENV.NODE_ENV === "production";

const targets = [];

if (!isProduction) {
  targets.push({
    target: "pino-pretty",
    options: { colorize: true },
    level: "debug",
  });
} else {
  targets.push({
    target: "pino/file",
    options: {
      destination: ENV.LOG_PATH,
      mkdir: true,
    },
    level: isProduction ? "info" : "debug",
  });
}

export const logger = pino({
  level: isProduction ? "info" : "debug",
  transport: {
    targets: targets,
  },
});
