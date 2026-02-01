import { unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { DatabaseConnection } from "./db";

async function main() {
  const dbPath = DatabaseConnection.getDbPath();

  console.log("\n🗑️  Resetting database...\n");

  if (existsSync(dbPath)) {
    try {
      DatabaseConnection.close();
    } catch {
      // Database might not be initialized
    }

    await unlink(dbPath);
    console.log(`  ↳ Deleted: ${dbPath}`);
  } else {
    console.log(`  ↳ Database file not found: ${dbPath}`);
  }

  console.log("\n✅ Database reset completed!\n");
}

main().catch((error) => {
  console.error("❌ Reset failed:", error);
  process.exit(1);
});
