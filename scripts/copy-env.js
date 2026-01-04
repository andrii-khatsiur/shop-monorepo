import { existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const apps = ["api", "web", "admin"];

apps.forEach((app) => {
  const example = join("apps", app, ".env.example");
  const env = join("apps", app, ".env");

  if (!existsSync(example)) {
    console.log(`[${app}] .env.example not found`);
    return;
  }

  if (existsSync(env)) {
    console.log(`[${app}] .env already exists`);
    return;
  }

  copyFileSync(example, env);
  console.log(`[${app}] .env created from .env.example`);
});
