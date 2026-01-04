import { Hono } from "hono";
import { upMigrations } from "./db";
import apiRoutes from "./routes/index";

const main = async () => {
  try {
    await upMigrations();

    const app = new Hono();

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
