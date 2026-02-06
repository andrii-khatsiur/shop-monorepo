export interface User {
  id: number;
  email: string;
  googleId: string | null;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
}

export type SafeUser = Omit<User, "googleId">;
