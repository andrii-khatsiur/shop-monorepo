import { Database } from "bun:sqlite";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export async function migrateAsync(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsDir = join(import.meta.dir, "migrations");

  const appliedRows = db
    .query<{ id: string }, []>("SELECT id FROM migrations")
    .all();
  const applied = new Set(appliedRows.map((row) => row.id));

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = await readFile(join(migrationsDir, file), "utf8");
    console.log(`🟡 Applying migration: ${file}`);

    const runMigration = db.transaction((script: string, filename: string) => {
      db.run(script);
      db.run("INSERT INTO migrations (id) VALUES (?)", [filename]);
    });

    try {
      runMigration(sql, file);
      console.log(`🟢 Applied: ${file}`);
    } catch (err) {
      console.error(`🔴 Failed migration: ${file}`);
      console.error(err);
      throw err;
    }
  }
}
