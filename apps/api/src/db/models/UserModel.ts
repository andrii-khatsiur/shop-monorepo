import { Model } from "./model";

export interface UserRowI {
  id: number;
  email: string;
  google_id: string | null;
  name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export type GoogleUserInput = {
  email: string;
  googleId: string;
  name: string;
  avatarUrl: string | null;
};

export class UserModel extends Model {
  public static tableName = "users";

  static createOrUpdateGoogleUser(data: GoogleUserInput): UserRowI | null {
    const query = `INSERT INTO ${this.tableName} (email, google_id, name, avatar_url)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET
            google_id = excluded.google_id,
            name = excluded.name,
            avatar_url = excluded.avatar_url
         RETURNING *`;

    return this.db
      .query(query)
      .get(data.email, data.googleId, data.name, data.avatarUrl) as UserRowI;
  }
}
