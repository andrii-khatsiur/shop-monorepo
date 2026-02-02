import { Database } from "bun:sqlite";
import { DatabaseConnection } from "../db";

export type SortPropsType = { [key: string]: "asc" | "desc" | undefined };

type WhereCondition = {
  [key: string]: string | number | boolean;
};

type FieldValue = string | number | boolean | null;

export abstract class Model {
  public static tableName: string;

  protected static get db(): Database {
    return DatabaseConnection.getDb();
  }

  static create<T>(
    this: typeof Model & { tableName: string },
    data: Omit<T, "id" | "created_at">
  ): T {
    const keys = Object.keys(data);
    const values = Object.values(data) as FieldValue[];
    const placeholders = keys.map(() => "?").join(", ");

    const query = `INSERT INTO ${this.tableName} (${keys.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;

    const result = this.db.query(query).get(...values);

    return result as T;
  }

  static findAll<T>(this: typeof Model & { tableName: string }): T[] {
    const query = `SELECT * FROM ${this.tableName}`;
    const stmt = this.db.prepare(query);
    return stmt.all() as T[];
  }

  static findById<T>(
    this: typeof Model & { tableName: string },
    id: number
  ): T | null {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(query);
    return stmt.get(id) as T | null;
  }

  static findOne<T>(
    this: typeof Model & { tableName: string },
    where: WhereCondition
  ): T | null {
    const conditions = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const values = Object.values(where);

    const query = `SELECT * FROM ${this.tableName} WHERE ${conditions}`;
    const stmt = this.db.prepare(query);
    return stmt.get(...values) as T | null;
  }

  static findMany<T>(
    this: typeof Model & { tableName: string },
    where: WhereCondition = {},
    sort?: SortPropsType
  ): T[] {
    const conditions = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const values = Object.values(where);

    let query = `SELECT * FROM ${this.tableName}`;
    if (conditions) {
      query += ` WHERE ${conditions}`;
    }

    let orderBySql = this.buildSort(sort);

    query += ` ${orderBySql}`;

    const stmt = this.db.prepare(query);
    return stmt.all(...values) as T[];
  }

  static update<T>(
    this: typeof Model & { tableName: string },
    id: number,
    data: Partial<Omit<T, "id">>
  ): T | null {
    const keys = Object.keys(data);
    const values = Object.values(data) as FieldValue[];
    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ? RETURNING *`;
    return this.db.query(query).get(...values, id) as T | null;
  }

  static delete(
    this: typeof Model & { tableName: string },
    id: number
  ): boolean {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const stmt = this.db.prepare(query);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static deleteMany(
    this: typeof Model & { tableName: string },
    where: WhereCondition
  ): number {
    const conditions = Object.keys(where)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const values = Object.values(where);

    const query = `DELETE FROM ${this.tableName} WHERE ${conditions}`;
    const stmt = this.db.prepare(query);
    const result = stmt.run(...values);
    return result.changes;
  }

  static raw(
    this: typeof Model & { tableName: string },
    query: string,
    params: any[] = []
  ): any {
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  static findByIds<T>(
    this: typeof Model & { tableName: string },
    ids: number[]
  ): T[] {
    if (ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(", ");
    const query = `
        SELECT * FROM ${this.tableName} WHERE id IN (${placeholders})
      `;
    return this.db.query<T, number[]>(query).all(...ids);
  }

  static buildSort(sort?: SortPropsType) {
    let orderBySql = "ORDER BY created_at DESC";
    if (sort && Object.keys(sort).length > 0) {
      const field = Object.keys(sort)[0];
      const direction = sort[field]?.toUpperCase() || "ASC";
      orderBySql = `ORDER BY ${field} ${direction}`;
    }

    return orderBySql;
  }
}
