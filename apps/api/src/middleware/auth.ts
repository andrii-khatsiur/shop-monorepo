import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { ENV } from "../config/env";
import { SafeUser } from "@shop-monorepo/types";

import { logger } from "../utils/logger";
import { UserService } from "../services/userService";

export type Env = {
  Variables: {
    user: SafeUser;
  };
};

export const authMiddleware = async (c: Context<Env>, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return await next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, ENV.JWT_SECRET);

    const user = UserService.getById(Number(payload.id));

    if (!user) {
      logger.warn(
        { userId: payload.id },
        "Token valid, but user not found in DB"
      );

      return c.json({ error: "User no longer exists" }, 401);
    }

    c.set("user", user);

    await next();
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Invalid token attempt");
    return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
  }
};
