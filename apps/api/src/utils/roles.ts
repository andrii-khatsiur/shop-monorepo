import { User } from "@shop-monorepo/types";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const isAdmin = (user: User): boolean => {
  return user.role === ROLES.ADMIN;
};
