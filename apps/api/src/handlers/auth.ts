import { Context } from "hono";
import { sign } from "hono/jwt";

import { ENV } from "../config/env";
import { logger } from "../utils/logger";
import { UserService } from "../services/userService";

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

    const token = await sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      ENV.JWT_SECRET
    );

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
