import {
  getCategories,
  createCategory,
  getCategoryBySlug,
} from "../../../services/categoryService";
import { rootCategoriesData, subCategoriesData } from "../data/categories";
import type { Category } from "@shop-monorepo/types";

export function seedCategories(): Category[] {
  const existingCategories = getCategories();

  if (existingCategories.length > 0) {
    console.log(
      `  ↳ Categories already seeded (${existingCategories.length} found)`
    );
    return existingCategories;
  }

  const totalCategories = rootCategoriesData.length + subCategoriesData.length;
  console.log(`  ↳ Seeding ${totalCategories} categories...`);

  const createdCategories: Category[] = [];

  // Phase 1: Create root categories (parentId = null)
  for (const categoryData of rootCategoriesData) {
    const category = createCategory(categoryData);
    createdCategories.push(category);
  }
  console.log(`  ↳ Created ${rootCategoriesData.length} root categories`);

  // Phase 2: Create subcategories with parentId
  for (const subCategoryData of subCategoriesData) {
    const parentCategory = getCategoryBySlug(subCategoryData.parentSlug);
    if (!parentCategory) {
      console.warn(
        `  ↳ Warning: Parent category "${subCategoryData.parentSlug}" not found for "${subCategoryData.name}"`
      );
      continue;
    }

    const category = createCategory({
      name: subCategoryData.name,
      isActive: subCategoryData.isActive,
      parentId: parentCategory.id,
    });
    createdCategories.push(category);
  }
  console.log(`  ↳ Created ${subCategoriesData.length} subcategories`);

  console.log(`  ↳ Total categories created: ${createdCategories.length}`);

  return createdCategories;
}
