import { Context, Next } from "hono";

import { logger } from "../utils/logger";

export const requestLogger = async (c: Context, next: Next) => {
  const start = performance.now();
  await next();
  const duration = (performance.now() - start).toFixed(2);

  const logPayload = {
    method: c.req.method,
    url: c.req.url,
    status: c.res.status,
    duration: `${duration}ms`,
  };

  if (c.res.status >= 400) {
    logger.warn(logPayload, "HTTP Request Finished with Error");
  } else {
    logger.info(logPayload, "HTTP Request Finished");
  }
};
