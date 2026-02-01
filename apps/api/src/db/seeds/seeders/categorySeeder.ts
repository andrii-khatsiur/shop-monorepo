import { getCategories, createCategory } from "../../../repos/categoryRepo";
import { categoriesData } from "../data/categories";
import type { Category } from "@shop-monorepo/types";

export function seedCategories(): Category[] {
  const existingCategories = getCategories();

  if (existingCategories.length > 0) {
    console.log(
      `  ↳ Categories already seeded (${existingCategories.length} found)`
    );
    return existingCategories;
  }

  console.log(`  ↳ Seeding ${categoriesData.length} categories...`);

  const createdCategories: Category[] = [];

  for (const categoryData of categoriesData) {
    const category = createCategory(categoryData);
    createdCategories.push(category);
  }

  console.log(`  ↳ Created ${createdCategories.length} categories`);

  return createdCategories;
}
