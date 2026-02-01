import { initDatabase } from "./db";
import { runSeeds } from "./seeds";

async function main() {
  try {
    await initDatabase();
    await runSeeds();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
