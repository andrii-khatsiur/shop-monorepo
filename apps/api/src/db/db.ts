import { Database } from "bun:sqlite";
import { join } from "node:path";
import { migrateAsync } from "./migrate";

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private static dbPath: string = join(
    import.meta.dir,
    "../../../../db.sqlite"
  );
  private db: Database;

  private constructor() {
    this.db = new Database(DatabaseConnection.dbPath, { create: true });
  }

  static init(): void {
    if (!this.instance) {
      this.instance = new DatabaseConnection();
      this.instance.db.run("PRAGMA foreign_keys = ON;");
    }
  }

  static getDb(): Database {
    if (!this.instance) {
      throw new Error(
        "Database not initialized. Call DatabaseConnection.init() first"
      );
    }
    return this.instance.db;
  }

  static getDbPath(): string {
    return this.dbPath;
  }

  static close(): void {
    if (this.instance) {
      this.instance.db.close();
      this.instance = null;
    }
  }
}

DatabaseConnection.init();

export const initDatabase = async () => {
  await migrateAsync(DatabaseConnection.getDb());
};
