import { DatabaseConnection } from "../db/db";
import { GoogleUserInput, UserModel, UserRowI } from "../db/models/UserModel";

export interface User {
  id: number;
  email: string;
  googleId: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

const mapRowToUser = (row: UserRowI): User => ({
  id: row.id,
  email: row.email,
  googleId: row.google_id,
  name: row.name,
  avatarUrl: row.avatar_url,
  role: row.role,
  createdAt: row.created_at,
});

export const UserService = {
  upsertGoogleUser(data: GoogleUserInput) {
    const user = UserModel.createOrUpdateGoogleUser(data);

    if (!user) throw new Error("Failed to upsert user");
    return mapRowToUser(user);
  },

  getById(id: number): User | null {
    const user = UserModel.findById<UserRowI>(id);

    return user ? mapRowToUser(user) : null;
  },
};
