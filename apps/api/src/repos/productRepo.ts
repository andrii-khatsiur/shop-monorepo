import { db } from "../db";
import { calculateDiscount, slugify } from "../utils";

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  oldPrice: number | null;
  discount: number | null;
  price: number;
  brandId: number | null;
  slug: string;
  isActive: boolean;
  isNew: boolean;
  createdAt: string;
  categoryIds?: number[];
}

interface ProductRow {
  id: number;
  name: string;
  description: string;
  image: string;
  old_price: number | null;
  discount: number | null;
  price: number;
  brand_id: number | null;
  slug: string;
  is_active: number;
  is_new: number;
  created_at: string;
}

interface ProductDto {
  name: string;
  description: string;
  image: string;
  oldPrice?: number | null;
  discount?: number | null;
  price: number;
  brandId?: number | null;
  isActive?: boolean;
  isNew?: boolean;
  categoryIds?: number[];
}

export function createProduct(data: ProductDto): Product {
  const slug = slugify(data.name);

  const transaction = db.transaction((dto: ProductDto, pSlug: string) => {
    const row = db
      .query<ProductRow, any>(
        `
      INSERT INTO products (
        name, description, image, old_price, discount, price, brand_id, slug, is_active, is_new
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `
      )
      .get(
        dto.name,
        dto.description,
        dto.image,
        dto.oldPrice ?? null,
        calculateDiscount(dto.price, dto?.oldPrice),
        dto.price,
        dto.brandId ?? null,
        pSlug,
        dto.isActive ?? 1,
        dto.isNew ?? 0
      );

    if (!row) throw new Error("Failed to create product");

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const insertStmt = db.prepare(
        "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)"
      );
      for (const catId of dto.categoryIds) {
        insertStmt.run(row.id, catId);
      }
    }

    return row;
  });

  const productRow = transaction(data, slug);
  return mapToProduct(productRow, data.categoryIds);
}

export function getProducts(): Product[] {
  const rows = db.query<ProductRow, []>("SELECT * FROM products").all();
  return rows.map((row) => mapToProduct(row));
}

export function getProductById(id: number): Product | null {
  const row = db
    .query<ProductRow, [number]>("SELECT * FROM products WHERE id = ?")
    .get(id);
  if (!row) return null;

  const categoryRows = db
    .query<{ category_id: number }, [number]>(
      "SELECT category_id FROM product_categories WHERE product_id = ?"
    )
    .all(id);

  const categoryIds = categoryRows.map((c) => c.category_id);
  return mapToProduct(row, categoryIds);
}

export function updateProduct(
  id: number,
  data: Partial<ProductDto>
): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  const transaction = db.transaction((updateData: Partial<ProductDto>) => {
    const name = updateData.name ?? existing.name;
    const slug = updateData.name ? slugify(updateData.name) : existing.slug;

    db.query(
      `
      UPDATE products SET 
        name = ?, description = ?, image = ?, old_price = ?, 
        discount = ?, price = ?, brand_id = ?, slug = ?, 
        is_active = ?, is_new = ?
      WHERE id = ?
    `
    ).run(
      name,
      updateData.description ?? existing.description,
      updateData.image ?? existing.image,
      updateData.oldPrice ?? existing.oldPrice,
      updateData.discount ?? existing.discount,
      updateData.price ?? existing.price,
      updateData.brandId ?? existing.brandId,
      slug,
      updateData.isActive ?? (existing.isActive ? 1 : 0),
      updateData.isNew ?? (existing.isNew ? 1 : 0),
      id
    );

    if (updateData.categoryIds) {
      db.query("DELETE FROM product_categories WHERE product_id = ?").run(id);
      const insertStmt = db.prepare(
        "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)"
      );
      for (const catId of updateData.categoryIds) {
        insertStmt.run(id, catId);
      }
    }
  });

  transaction(data);
  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const result = db.query("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

function mapToProduct(row: ProductRow, categoryIds?: number[]): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    oldPrice: row.old_price,
    discount: row.discount,
    price: row.price,
    brandId: row.brand_id,
    slug: row.slug,
    isActive: !!row.is_active,
    isNew: !!row.is_new,
    createdAt: row.created_at,
    categoryIds: categoryIds || [],
  };
}
