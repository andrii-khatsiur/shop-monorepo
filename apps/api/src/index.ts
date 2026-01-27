import { Hono } from "hono";
import { cors } from "hono/cors";
import { apiRoutes } from "./routes/api.routes";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";
import { errorLogger } from "./middleware/errorLogger";
import { initDatabase } from "./db/db";

const main = async () => {
  try {
    await initDatabase();

    const app = new Hono();

    app.onError(errorLogger);

    const frontendUrl = Bun.env.FRONTEND_URL || "http://localhost:3100";

    app.use(
      "*",
      cors({
        origin: frontendUrl,
        credentials: true,
      })
    );

    app.use("*", requestLogger);

    app.use("/api/*", authMiddleware);

    app.route("/api", apiRoutes);
    app.get("/ping", (c) => c.text("pong"));

    const PORT = Number(Bun.env.API_PORT || 3000);

    Bun.serve({
      fetch: app.fetch,
      port: PORT,
    });

    console.log(`🚀 Server listening on port ${PORT}`);
  } catch (err) {
    console.error("❌ Server failed to start", err);
    process.exit(1);
  }
};

main();
