import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
import { handleGoogleCallback } from "../handlers/auth";
import { ENV } from "../config/env";

const authRoutes = new Hono();

authRoutes.use(
  "/google",
  googleAuth({
    client_id: ENV.GOOGLE_CLIENT_ID,
    client_secret: ENV.GOOGLE_CLIENT_SECRET,
    scope: ["email", "profile"],
  })
);

authRoutes.get("/google", handleGoogleCallback);

export { authRoutes };
