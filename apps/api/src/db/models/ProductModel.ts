import { Model } from "./model";

export interface ProductRowI {
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

export class ProductModel extends Model {
  static tableName = "products";

  static findManyWithFilter(
    page: number,
    limit: number,
    brandId?: number,
    categoryId?: number
  ): { rows: ProductRowI[]; total: number } {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    const whereClauses: string[] = [];

    if (brandId) {
      whereClauses.push(`brand_id = ?`);
      params.push(brandId);
    }

    if (categoryId) {
      whereClauses.push(`
        EXISTS (
          SELECT 1
          FROM product_categories pc
          WHERE pc.product_id = p.id
            AND pc.category_id = ?
        )
      `);
      params.push(categoryId);
    }

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    const countRow = this.db
      .query<{ total: number }, any[]>(
        `SELECT COUNT(*) as total FROM products p ${whereSql}`
      )
      .get(...params);

    const total = countRow?.total ?? 0;

    if (total === 0) return { rows: [], total };

    const rows = this.db
      .query<ProductRowI, any[]>(
        `SELECT * FROM products p ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset);

    return { rows, total };
  }

  static findCategoriesByProductIds(
    productIds: number[]
  ): Record<number, number[]> {
    if (!productIds.length) return {};

    const placeholders = productIds.map(() => "?").join(",");
    const rows = this.db
      .query<{ product_id: number; category_id: number }, any[]>(
        `SELECT product_id, category_id FROM product_categories WHERE product_id IN (${placeholders})`
      )
      .all(...productIds);

    const map: Record<number, number[]> = {};
    for (const r of rows) {
      if (!map[r.product_id]) map[r.product_id] = [];
      map[r.product_id].push(r.category_id);
    }
    return map;
  }

  private static createProductCategories(
    categoryIds: number[],
    productId: number
  ) {
    if (categoryIds.length > 0) {
      const insertStmt = this.db.prepare(
        "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)"
      );
      for (const catId of categoryIds) {
        insertStmt.run(productId, catId);
      }
    }
  }

  static createWithCategories(
    input: Omit<ProductRowI, "id" | "created_at">,
    categoryIds?: number[]
  ): ProductRowI {
    return this.db.transaction((row, catIds) => {
      const product = this.create<ProductRowI>(row);

      if (!product) throw new Error("Failed to create product");

      this.createProductCategories(catIds, product.id);

      return product;
    })(input, categoryIds);
  }

  static updateProductWithCategories(
    productId: number,
    input: Omit<ProductRowI, "id" | "created_at">,
    categoryIds?: number[]
  ) {
    return this.db.transaction((id, update, catIds) => {
      const updatedProduct = this.update<ProductRowI>(id, update);

      if (!updatedProduct) throw new Error("Failed to update product");

      this.db
        .query("DELETE FROM product_categories WHERE product_id = ?")
        .run(id);

      this.createProductCategories(catIds, updatedProduct.id);

      return updatedProduct;
    })(productId, input, categoryIds);
  }
}
