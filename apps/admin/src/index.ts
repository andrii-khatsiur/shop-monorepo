import { serve } from "bun";
import index from "./index.html";

const PORT = Number(Bun.env.PORT) || 3001;

const globalAny = globalThis as any;

const server = serve({
  port: PORT,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

if (process.env.NODE_ENV !== "production" && !globalAny.__BROWSER_OPENED__) {
  globalAny.__BROWSER_OPENED__ = true;

  const url = server.url.toString();

  const openCmd =
    process.platform === "win32"
      ? ["cmd", "/c", "start"]
      : process.platform === "darwin"
      ? ["open"]
      : ["xdg-open"];

  Bun.spawn([...openCmd, url]);
}

console.log(`🚀 Server running at ${server.url}`);
