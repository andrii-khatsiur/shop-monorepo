import { db } from "../db/db";
import { slugify } from "../utils/common";

export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

interface CategoryDto {
  name: string;
  isActive: boolean;
}

const mapRowToCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
});

export function createCategory({ name, isActive }: CategoryDto): Category {
  const slug = slugify(name);

  try {
    const row = db
      .query<CategoryRow, [string, string, number]>(
        `INSERT INTO categories (name, slug, is_active) VALUES (?, ?, ?) RETURNING *`
      )
      .get(name, slug, isActive ? 1 : 0);

    if (!row) throw new Error("Failed to create category");
    return mapRowToCategory(row);
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      throw new Error(`Category with slug "${slug}" already exists`);
    }
    throw error;
  }
}

export function getCategories(): Category[] {
  return db
    .query<CategoryRow, []>("SELECT * FROM categories ORDER BY name ASC")
    .all()
    .map(mapRowToCategory);
}

export function getCategoryById(id: number): Category | null {
  const row = db
    .query<CategoryRow, [number]>("SELECT * FROM categories WHERE id = ?")
    .get(id);

  return row ? mapRowToCategory(row) : null;
}

export function getCategoryBySlug(slug: string): Category | null {
  const row = db
    .query<CategoryRow, [string]>("SELECT * FROM categories WHERE slug = ?")
    .get(slug);

  return row ? mapRowToCategory(row) : null;
}

export function updateCategory(
  id: number,
  data: Partial<CategoryDto>
): Category | null {
  const existing = getCategoryById(id);
  if (!existing) return null;

  const name = data.name ?? existing.name;
  const slug = data.name ? slugify(data.name) : existing.slug;
  const isActive = data.isActive ?? existing.isActive;

  db.query(
    `UPDATE categories SET name = ?, slug = ?, is_active = ? WHERE id = ?`
  ).run(name, slug, isActive ? 1 : 0, id);

  return { id, name, slug, isActive };
}

export function deleteCategory(id: number): boolean {
  const result = db.query("DELETE FROM categories WHERE id = ?").run(id);
  return result.changes > 0;
}
