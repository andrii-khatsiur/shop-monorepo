import type { User } from "@shop-monorepo/types";
import { DatabaseConnection } from "../db/db";
import { GoogleUserInput, UserModel, UserRowI } from "../db/models/UserModel";

const mapRowToUser = (row: UserRowI): User => ({
  id: row.id,
  email: row.email,
  googleId: row.google_id,
  name: row.name,
  avatarUrl: row.avatar_url,
  role: row.role as "admin" | "user",
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
