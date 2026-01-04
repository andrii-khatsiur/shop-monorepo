import { Database } from "bun:sqlite";
import { join } from "node:path";
import { migrateAsync } from "./db/migrate";

export const db = new Database(join(import.meta.dir, "../../../db.sqlite"), {
  create: true,
});

export const upMigrations = async (): Promise<void> => {
  await migrateAsync(db);
};
