import { slugify } from "../utils/common";

import { CategoryModel, CategoryRowI } from "../db/models/CategoryModel ";
import { R2Service } from "./r2Service";
import type { Category } from "@shop-monorepo/types";

interface CategoryDto {
  name: string;
  image?: string | null;
  isActive: boolean;
  parentId?: number | null;
}

const mapRowToCategory = (row: CategoryRowI): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  image: row.image,
  isActive: Boolean(row.is_active),
  parentId: row.parent_id,
});

const mapCategoryToRow = (dto: CategoryDto): Omit<CategoryRowI, "id"> => ({
  name: dto.name,
  slug: slugify(dto.name),
  image: dto.image ?? null,
  is_active: dto.isActive ? 1 : 0,
  parent_id: dto.parentId ?? null,
});

export async function createCategory(dto: CategoryDto): Promise<Category> {
  if (dto.image?.includes("/temp/")) {
    dto.image = await R2Service.moveFromTemp(dto.image, "categories");
  }

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

export interface CategoryFilters {
  isActive?: boolean;
}

const mapSortFieldToSnakeCase = (field: string) => {
  if (field === 'isActive') return 'is_active';
  return field;
};

export function getCategories(
  sort?: { [key: string]: "asc" | "desc" | undefined },
  filters?: CategoryFilters
): Category[] {
  const mappedSort = sort
    ? { [mapSortFieldToSnakeCase(Object.keys(sort)[0])]: Object.values(sort)[0] }
    : undefined;

  const where: Record<string, number> = {};
  if (filters?.isActive !== undefined) {
    where.is_active = filters.isActive ? 1 : 0;
  }

  const defaultSort = { name: "asc" } as { [key: string]: "asc" | "desc" };
  const effectiveSort = mappedSort && Object.keys(mappedSort).length > 0 ? mappedSort : defaultSort;

  const allCategories = CategoryModel.findMany<CategoryRowI>(where, effectiveSort).map(mapRowToCategory);
  return buildCategoryTree(allCategories);
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = CategoryModel.findOne<CategoryRowI>({ slug });
  return row ? mapRowToCategory(row) : null;
}

export async function updateCategory(id: number, data: CategoryDto): Promise<Category | null> {
  const existing = CategoryModel.findById(id);
  if (!existing) return null;

  if (data.image?.includes("/temp/")) {
    data.image = await R2Service.moveFromTemp(data.image, "categories");
  }

  const updatedRow = mapCategoryToRow(data);

  const updated = CategoryModel.update<CategoryRowI>(id, updatedRow);
  return updated ? mapRowToCategory(updated) : null;
}

export function deleteCategory(id: number): boolean {
  return CategoryModel.delete(id);
}
