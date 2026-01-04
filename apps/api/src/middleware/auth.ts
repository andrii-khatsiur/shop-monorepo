import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { logger } from "../utils/logger";

import { User, UserRepository } from "../repos/userRepo";

export type Env = {
  Variables: {
    user: User;
    jwtPayload: any;
  };
};

const JWT_SECRET = Bun.env.JWT_SECRET || "change-me";

export const authMiddleware = async (c: Context<Env>, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return await next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = await verify(token, JWT_SECRET);

    const user = UserRepository.findById(Number(payload.id));

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
