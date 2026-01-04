import { Context } from "hono";
import { logger } from "../utils/logger";

interface AppError extends Error {
  status?: number;
  cause?: any;
}

export const errorLogger = async (err: AppError | Error, c: Context) => {
  const status = (err as AppError).status || 400;

  logger.error(
    {
      msg: err.message,
      stack: err.stack,
      path: c.req.path,
      method: c.req.method,
    },
    "‼️ ERROR_DETAILS"
  );

  return c.json(
    {
      error: err.message || "Internal Server Error",
    },
    status as any
  );
};
