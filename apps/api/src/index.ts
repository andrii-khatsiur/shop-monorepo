import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const PORT = Number(Bun.env.API_PORT) || 3000;

console.log(`API running on http://localhost:${PORT}`);

Bun.serve({
  fetch: app.fetch,
  port: PORT,
});
