import { calculateDiscount, slugify } from "../utils/common";
import { DatabaseConnection } from "../db/db";
import { ProductModel, ProductRowI } from "../db/models/ProductModel";
import { BrandModel, BrandRowI } from "../db/models/BrandModel";
import { CategoryModel, CategoryRowI } from "../db/models/CategoryModel ";

const db = DatabaseConnection.getDb();

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
  categoriesIds: number[];
}

interface ProductInput {
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

const mapToProduct =
  (categoriesMap: Record<number, number[]>) =>
  (row: ProductRowI): Product => ({
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
    categoriesIds: categoriesMap[row.id] ?? [],
  });

export interface PaginatedProducts {
  hits: Product[];
  total: number;
}

export function createProduct(data: ProductInput): Product {
  if (data.brandId) {
    const brand = BrandModel.findById(data.brandId);
    if (!brand) {
      const error = new Error(`Brand with ID ${data.brandId} not found`);
      (error as any).status = 400;
      throw error;
    }
  }

  if (data.categoryIds?.length) {
    const categories = CategoryModel.findByIds(data.categoryIds);
    if (categories.length !== data.categoryIds.length) {
      const error = new Error("One or more Category IDs are invalid");
      (error as any).status = 400;
      throw error;
    }
  }

  const slug = slugify(data.name);

  const productRowId = db.transaction((dto: ProductInput, pSlug: string) => {
    const row = db
      .query<ProductRowI, any>(
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

export interface ProductFilters {
  brandSlug?: string;
  categorySlug?: string;
}

export function getProducts(
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {}
): PaginatedProducts {
  const brand = filters.brandSlug
    ? BrandModel.findOne<BrandRowI>({ slug: filters.brandSlug })
    : null;
  if (filters.brandSlug && !brand) return { hits: [], total: 0 };

  const category = filters.categorySlug
    ? CategoryModel.findOne<CategoryRowI>({ slug: filters.categorySlug })
    : null;
  if (filters.categorySlug && !category) return { hits: [], total: 0 };

  const { rows: products, total } = ProductModel.findManyWithFilter(
    page,
    limit,
    brand?.id,
    category?.id
  );

  const productIds = products.map((p) => p.id);
  const categoriesMap = ProductModel.findCategoriesByProductIds(productIds);

  return {
    hits: products.map(mapToProduct(categoriesMap)),
    total,
  };
}
export function getProductById(id: number): Product | null {
  const row = ProductModel.findById<ProductRowI>(id);

  if (!row) return null;

  const categoriesMap = ProductModel.findCategoriesByProductIds([row.id]);

  return mapToProduct(categoriesMap)(row);
}

export function updateProduct(
  id: number,
  data: Partial<ProductInput>
): Product | null {
  const existing = getProductById(id);
  if (!existing) return null;

  db.transaction((updateData: Partial<ProductInput>) => {
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
  return ProductModel.delete(id);
}

export function getProductBySlug(slug: string): Product | null {
  const row = ProductModel.findOne<ProductRowI>({ slug });
  if (!row) return null;

  const categoriesMap = ProductModel.findCategoriesByProductIds([row.id]);

  return mapToProduct(categoriesMap)(row);
}
