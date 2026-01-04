import { db } from "../db";
import { slugify } from "../utils";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

interface BrandRow {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

interface BrandDto {
  name: string;
  isActive: boolean;
}

const mapRowToBrand = (row: BrandRow): Brand => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
});

export function createBrand({ name, isActive }: BrandDto): Brand {
  const slug = slugify(name);

  try {
    const row = db
      .query<BrandRow, [string, string, number]>(
        `INSERT INTO brands (name, slug, is_active) VALUES (?, ?, ?) RETURNING *`
      )
      .get(name, slug, isActive ? 1 : 0);

    if (!row) throw new Error("Failed to create brand");
    return mapRowToBrand(row);
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      throw new Error(`Brand with slug "${slug}" already exists`);
    }
    throw error;
  }
}

export function getBrands(): Brand[] {
  return db
    .query<BrandRow, []>("SELECT * FROM brands ORDER BY name ASC")
    .all()
    .map(mapRowToBrand);
}

function getBrandById(id: number): Brand | null {
  const row = db
    .query<BrandRow, [number]>("SELECT * FROM brands WHERE id = ?")
    .get(id);

  return row ? mapRowToBrand(row) : null;
}

export function getBrandBySlug(slug: string): Brand | null {
  const row = db
    .query<BrandRow, [string]>("SELECT * FROM brands WHERE slug = ?")
    .get(slug);

  return row ? mapRowToBrand(row) : null;
}

export function updateBrand(id: number, data: Partial<BrandDto>): Brand | null {
  const existing = getBrandById(id);
  if (!existing) return null;

  const name = data.name ?? existing.name;
  const slug = data.name ? slugify(data.name) : existing.slug;
  const isActive = data.isActive ?? existing.isActive;

  db.query(
    `UPDATE brands SET name = ?, slug = ?, is_active = ? WHERE id = ?`
  ).run(name, slug, isActive ? 1 : 0, id);

  return { id, name, slug, isActive };
}

export function deleteBrand(id: number): boolean {
  const result = db.query("DELETE FROM brands WHERE id = ?").run(id);
  return result.changes > 0;
}
