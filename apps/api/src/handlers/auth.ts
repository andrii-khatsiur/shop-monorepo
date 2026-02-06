import { Context } from "hono";
import { sign } from "hono/jwt";

import { ENV } from "../config/env";
import { logger } from "../utils/logger";
import { UserService } from "../services/userService";
import type { User } from "@shop-monorepo/types";

async function generateToken(user: User): Promise<string> {
  return sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    ENV.JWT_SECRET
  );
}

export function handleMe(c: Context) {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json(user);
}

export async function handleLogin(c: Context) {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  try {
    const user = await UserService.validatePassword(email, password);

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    if (user.role !== "admin") {
      return c.json({ error: "Access denied. Admin privileges required" }, 403);
    }

    const token = await generateToken(user);

    logger.info(
      { userId: user.id, email: user.email },
      "Admin logged in via password"
    );

    return c.json({ token, user });
  } catch (error) {
    logger.error({ error }, "Error during login");
    return c.json({ error: "Internal Server Error" }, 500);
  }
}

export async function handleGoogleCallback(c: Context) {
  const googleUser = c.get("user-google");

  if (!googleUser?.id || !googleUser?.email) {
    return c.json({ error: "Missing data from Google" }, 400);
  }

  if (!googleUser.email) {
    logger.error(
      { googleUser },
      "Google Auth error: email is missing in profile"
    );
    return c.json({ error: "Email is required from Google profile" }, 400);
  }

  try {
    const user = UserService.upsertGoogleUser({
      email: googleUser.email,
      googleId: googleUser.id,
      name: googleUser.name || "Google User",
      avatarUrl: googleUser.picture || null,
    });

    const token = await generateToken(user);

    logger.info(
      { userId: user.id, email: user.email },
      "User logged in via Google"
    );

    return c.redirect(`${ENV.FRONTEND_URL}/auth-callback?token=${token}`);
  } catch (error) {
    logger.error({ error }, "Error during user upsert");
    return c.json({ error: "Internal Server Error" }, 500);
  }
}
