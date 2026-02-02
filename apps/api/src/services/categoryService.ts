import { slugify } from "../utils/common";

import { CategoryModel, CategoryRowI } from "../db/models/CategoryModel ";
import type { Category } from "@shop-monorepo/types";

interface CategoryDto {
  name: string;
  isActive: boolean;
  parentId?: number | null;
}

const mapRowToCategory = (row: CategoryRowI): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
  parentId: row.parent_id,
});

const mapCategoryToRow = (dto: CategoryDto): Omit<CategoryRowI, "id"> => ({
  name: dto.name,
  slug: slugify(dto.name),
  is_active: dto.isActive ? 1 : 0,
  parent_id: dto.parentId ?? null,
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

function buildCategoryTree(categories: Category[]): Category[] {
  const rootCategories: Category[] = [];
  const childrenMap: Record<number, Category[]> = {};

  for (const category of categories) {
    if (category.parentId === null) {
      rootCategories.push(category);
    } else {
      if (!childrenMap[category.parentId]) {
        childrenMap[category.parentId] = [];
      }
      childrenMap[category.parentId].push(category);
    }
  }

  for (const root of rootCategories) {
    const children = childrenMap[root.id];
    if (children && children.length > 0) {
      root.children = children;
    }
  }

  return rootCategories;
}

export function getCategories(): Category[] {
  const allCategories = CategoryModel.findAll<CategoryRowI>().map(mapRowToCategory);
  return buildCategoryTree(allCategories);
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
