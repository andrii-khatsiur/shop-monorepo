import { slugify } from "../utils/common";

import { CategoryModel, CategoryRowI } from "../db/models/CategoryModel ";

export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

interface CategoryDto {
  name: string;
  isActive: boolean;
}

const mapRowToCategory = (row: CategoryRowI): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
});

const mapCategoryToRow = (dto: CategoryDto): Omit<CategoryRowI, "id"> => ({
  name: dto.name,
  slug: slugify(dto.name),
  is_active: dto.isActive ? 1 : 0,
});

export function createCategory(dto: CategoryDto): Category {
  const row = mapCategoryToRow(dto);

  try {
    const created = CategoryModel.create(row);
    return mapRowToCategory(created);
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      throw new Error(`Category with slug "${row.slug}" already exists`);
    }
    throw error;
  }
}

export function getCategories(): Category[] {
  return CategoryModel.findAll<CategoryRowI>().map(mapRowToCategory);
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = CategoryModel.findOne<CategoryRowI>({ slug });
  return row ? mapRowToCategory(row) : null;
}

export function updateCategory(id: number, data: CategoryDto): Category | null {
  const existing = CategoryModel.findById(id);
  if (!existing) return null;

  const updatedRow = mapCategoryToRow(data);

  const updated = CategoryModel.update<CategoryRowI>(id, updatedRow);
  return updated ? mapRowToCategory(updated) : null;
}

export function deleteCategory(id: number): boolean {
  return CategoryModel.delete(id);
}
