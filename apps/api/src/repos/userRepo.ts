import { db } from "../db/db";

export interface User {
  id: number;
  email: string;
  googleId: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

interface UserRow {
  id: number;
  email: string;
  google_id: string | null;
  name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  googleId: row.google_id,
  name: row.name,
  avatarUrl: row.avatar_url,
  role: row.role,
  createdAt: row.created_at,
});

export const UserRepository = {
  findByEmail(email: string): User | null {
    const row = db
      .query<UserRow, [string]>("SELECT * FROM users WHERE email = ?")
      .get(email);
    return row ? mapRowToUser(row) : null;
  },

  upsertGoogleUser(data: {
    email: string;
    googleId: string;
    name: string;
    avatarUrl: string | null;
  }) {
    const row = db
      .query<UserRow, [string, string, string, string | null]>(
        `INSERT INTO users (email, google_id, name, avatar_url)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
            google_id = excluded.google_id,
            name = excluded.name,
            avatar_url = excluded.avatar_url
         RETURNING *`
      )
      .get(data.email, data.googleId, data.name, data.avatarUrl);

    if (!row) throw new Error("Failed to upsert user");
    return mapRowToUser(row);
  },

  findById(id: number): User | null {
    const row = db
      .query<UserRow, [number]>("SELECT * FROM users WHERE id = ?")
      .get(id);

    return row ? mapRowToUser(row) : null;
  },
};
