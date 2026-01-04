import { serve } from "bun";
import index from "./index.html";

const PORT = Number(Bun.env.PORT) || 3001;

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

console.log(`🚀 Server running at ${server.url}`);
