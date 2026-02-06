import { UserModel, UserRowI } from "../../models/UserModel";

const DEFAULT_ADMIN = {
  email: "admin@shop.com",
  password: "admin123",
  name: "Admin",
};

export async function seedUsers(): Promise<void> {
  const existingUser = UserModel.findByEmail(DEFAULT_ADMIN.email);

  if (existingUser) {
    console.log(`  ⏭️  Admin user already exists: ${DEFAULT_ADMIN.email}`);
    return;
  }

  const passwordHash = await Bun.password.hash(DEFAULT_ADMIN.password);

  UserModel.createAdminUser({
    email: DEFAULT_ADMIN.email,
    passwordHash,
    name: DEFAULT_ADMIN.name,
    role: "admin",
  });

  console.log(`  ✅ Created admin user: ${DEFAULT_ADMIN.email} / ${DEFAULT_ADMIN.password}`);
}
