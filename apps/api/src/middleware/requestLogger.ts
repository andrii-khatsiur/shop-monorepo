import { Context, Next } from "hono";

import { logger } from "../utils/logger";

export const requestLogger = async (c: Context, next: Next) => {
  const { method, url } = c.req;
  const start = performance.now();

  await next();

  const duration = (performance.now() - start).toFixed(2);
  const status = c.res.status;

  const logPayload = {
    method,
    url,
    status,
    duration: `${duration}ms`,
    ip: c.req.header("x-forwarded-for") || "localhost",
  };

  if (status >= 400) {
    logger.error(logPayload, "Request failed");
  } else {
    logger.info(logPayload, "Request success");
  }
};
