import { Hono } from "hono";
import { googleAuth } from "@hono/oauth-providers/google";
import { handleGoogleCallback } from "../handlers/auth";

const authRoutes = new Hono();

authRoutes.use(
  "/google",
  googleAuth({
    client_id: Bun.env.GOOGLE_CLIENT_ID!,
    client_secret: Bun.env.GOOGLE_CLIENT_SECRET!,
    scope: ["email", "profile"],
  })
);

authRoutes.get("/google", handleGoogleCallback);

export { authRoutes };
