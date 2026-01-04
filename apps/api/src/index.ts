import { Hono } from "hono";
import { upMigrations } from "./db/db";
import { apiRoutes } from "./routes/api.routes";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";
import { errorLogger } from "./middleware/errorLogger";

const main = async () => {
  try {
    await upMigrations();

    const app = new Hono();

    app.onError(errorLogger);

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
