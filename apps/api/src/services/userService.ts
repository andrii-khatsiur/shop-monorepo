import type { SafeUser } from "@shop-monorepo/types";
import { GoogleUserInput, UserModel, UserRowI } from "../db/models/UserModel";

const mapRowToSafeUser = (row: UserRowI): SafeUser => ({
  id: row.id,
  email: row.email,
  name: row.name,
  avatarUrl: row.avatar_url,
  role: row.role as "admin" | "user",
  createdAt: row.created_at,
});

export const UserService = {
  upsertGoogleUser(data: GoogleUserInput) {
    const user = UserModel.createOrUpdateGoogleUser(data);

    if (!user) throw new Error("Failed to upsert user");
    return mapRowToSafeUser(user);
  },

  getById(id: number): SafeUser | null {
    const user = UserModel.findById<UserRowI>(id);

    return user ? mapRowToSafeUser(user) : null;
  },

  getByEmail(email: string): SafeUser | null {
    const user = UserModel.findByEmail(email);
    return user ? mapRowToSafeUser(user) : null;
  },

  async validatePassword(email: string, password: string): Promise<SafeUser | null> {
    const user = UserModel.findByEmail(email);
    if (!user || !user.password_hash) return null;

    const isValid = await Bun.password.verify(password, user.password_hash);
    return isValid ? mapRowToSafeUser(user) : null;
  },

  async createAdminUser(data: { email: string; password: string; name: string }): Promise<SafeUser> {
    const existingUser = UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await Bun.password.hash(data.password);
    const user = UserModel.createAdminUser({
      email: data.email,
      passwordHash,
      name: data.name,
      role: "admin",
    });

    if (!user) throw new Error("Failed to create admin user");
    return mapRowToSafeUser(user);
  },
};
