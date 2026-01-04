import { Database } from "bun:sqlite";
import { join } from "node:path";
import { migrateAsync } from "./migrate";

export const db = new Database(join(import.meta.dir, "../../../../db.sqlite"), {
  create: true,
});

db.run("PRAGMA foreign_keys = ON;");

export const upMigrations = async (): Promise<void> => {
  await migrateAsync(db);
};
