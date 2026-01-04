import { db } from "../db";
import { calculateDiscount, slugify } from "../utils";
import { Brand } from "./brandRepo";
import { Category } from "./categoryRepo";

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
  brand: Brand | null;
  categories: Category[];
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
  brand_name: string | null;
  brand_slug: string | null;
  brand_is_active: number | null;
  category_json: string;
}

export interface ProductDto {
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  brandId?: number | null;
  isActive?: boolean;
  isNew?: boolean;
  categoryIds?: number[];
}

export interface PaginatedProducts {
  hits: Product[];
  total: number;
}

const SELECT_PRODUCT_JOINED = `
  SELECT 
    p.*,
    b.name as brand_name, b.slug as brand_slug, b.is_active as brand_is_active,
    (
      SELECT json_group_array(
        json_object('id', c.id, 'name', c.name, 'slug', c.slug, 'isActive', c.is_active)
      )
      FROM product_categories pc
      JOIN categories c ON c.id = pc.category_id
      WHERE pc.product_id = p.id
    ) as category_json
  FROM products p
  LEFT JOIN brands b ON p.brand_id = b.id
`;

export function createProduct(data: ProductDto): Product {
  const slug = slugify(data.name);

  const productRowId = db.transaction((dto: ProductDto, pSlug: string) => {
    const row = db
      .query<ProductRow, any>(
        `
      INSERT INTO products (
        name, description, image, old_price, discount, price, brand_id, slug, is_active, is_new
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `
      )
      .get(
        dto.name,
        dto.description,
        dto.image,
        dto.oldPrice ?? null,
        calculateDiscount(dto.price, dto.oldPrice),
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
    return row.id;
  })(data, slug);

  return getProductById(productRowId)!;
}

export function getProducts(
  page: number = 1,
  limit: number = 10
): PaginatedProducts {
  const offset = (page - 1) * limit;

  const countRes = db
    .query<{ total: number }, []>("SELECT COUNT(*) as total FROM products")
    .get();
  const total = countRes?.total ?? 0;

  const rows = db
    .query<ProductRow, [number, number]>(
      `
    ${SELECT_PRODUCT_JOINED}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `
    )
    .all(limit, offset);

  return {
    hits: rows.map(mapToProduct),
    total,
  };
}

export function getProductById(id: number): Product | null {
  const row = db
    .query<ProductRow, [number]>(
      `
    ${SELECT_PRODUCT_JOINED}
    WHERE p.id = ?
  `
    )
    .get(id);

  return row ? mapToProduct(row) : null;
}

export function updateProduct(
  id: number,
  data: Partial<ProductDto>
): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  db.transaction((updateData: Partial<ProductDto>) => {
    const name = updateData.name ?? existing.name;
    const price = updateData.price ?? existing.price;
    const oldPrice =
      updateData.oldPrice !== undefined
        ? updateData.oldPrice
        : existing.oldPrice;

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
      oldPrice,
      calculateDiscount(price, oldPrice),
      price,
      updateData.brandId !== undefined ? updateData.brandId : existing.brandId,
      updateData.name ? slugify(updateData.name) : existing.slug,
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
  })(data);

  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const result = db.query("DELETE FROM products WHERE id = ?").run(id);
  return result.changes > 0;
}

export function getProductBySlug(slug: string): Product | null {
  const row = db
    .query<ProductRow, [string]>(
      `
    ${SELECT_PRODUCT_JOINED}
    WHERE p.slug = ?
  `
    )
    .get(slug);

  return row ? mapToProduct(row) : null;
}

function mapToProduct(row: ProductRow): Product {
  const rawCategories = JSON.parse(row.category_json);

  const categories: Category[] = Array.isArray(rawCategories)
    ? rawCategories
        .filter((c) => c.id !== null)
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          isActive: Boolean(c.isActive),
        }))
    : [];

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
    brand: row.brand_id
      ? {
          id: row.brand_id,
          name: row.brand_name!,
          slug: row.brand_slug!,
          isActive: Boolean(row.brand_is_active),
        }
      : null,
    categories,
  };
}
