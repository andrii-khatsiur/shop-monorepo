import { Context, Next } from "hono";
import { User } from "@shop-monorepo/types";
import { isAdmin } from "../utils/roles";

export type AuthEnv = {
  Variables: {
    user: User;
  };
};

// Checks if user exists in context (set by authMiddleware)
export const requireAuth = async (c: Context<AuthEnv>, next: Next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

// Checks if user is an admin
export const requireAdmin = async (c: Context<AuthEnv>, next: Next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!isAdmin(user)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await next();
};
