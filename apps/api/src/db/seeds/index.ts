import { seedBrands } from "./seeders/brandSeeder";
import { seedCategories } from "./seeders/categorySeeder";
import { seedProducts } from "./seeders/productSeeder";
import { seedUsers } from "./seeders/userSeeder";

export async function runSeeds(): Promise<void> {
  console.log("\n🌱 Starting database seeding...\n");

  console.log("👤 Seeding users...");
  await seedUsers();

  console.log("📦 Seeding brands...");
  const brands = seedBrands();

  console.log("📦 Seeding categories...");
  const categories = seedCategories();

  console.log("📦 Seeding products...");
  seedProducts(brands, categories);

  console.log("\n✅ Database seeding completed!\n");
}
