import { DatabaseConnection } from "../db/db";
import { UserModel } from "../db/models/UserModel";

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin";

  if (!email || !password) {
    console.error("❌ Usage: bun run create-admin <email> <password> [name]");
    console.error(
      "   Example: bun run create-admin admin@example.com mypassword123 'John Doe'"
    );
    process.exit(1);
  }

  // Initialize database connection
  DatabaseConnection.init();

  const existingUser = UserModel.findByEmail(email);
  if (existingUser) {
    console.error(`❌ User with email "${email}" already exists`);
    process.exit(1);
  }

  const passwordHash = await Bun.password.hash(password);

  const user = UserModel.createAdminUser({
    email,
    passwordHash,
    name,
    role: "admin",
  });

  if (user) {
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
  } else {
    console.error("❌ Failed to create admin user");
    process.exit(1);
  }
}

createAdmin();
