import { calculateDiscount, slugify } from "../utils/common";
import { ProductModel, ProductRowI } from "../db/models/ProductModel";
import { BrandModel, BrandRowI } from "../db/models/BrandModel";
import { CategoryModel, CategoryRowI } from "../db/models/CategoryModel ";
import type {
  Product,
  ProductInput,
  PaginatedProducts,
} from "@shop-monorepo/types";

const validateProductInput = (data: ProductInput) => {
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
};

const mapToProductRow = (input: ProductInput) => ({
  name: input.name,
  description: input.description,
  image: input.image,
  old_price: input.oldPrice ?? null,
  discount: calculateDiscount(input.price, input.oldPrice),
  price: input.price,
  brand_id: input.brandId ?? null,
  slug: slugify(input.name),
  is_active: input.isActive ? 1 : 0,
  is_new: input.isNew ? 1 : 0,
});

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
    categoryIds: categoriesMap[row.id] ?? [],
  });

export function createProduct(data: ProductInput): Product | null {
  validateProductInput(data);

  const product = ProductModel.createWithCategories(
    mapToProductRow(data),
    data?.categoryIds
  );

  if (product) {
    return getProductById(product.id);
  }

  return null;
}

export interface ProductFilters {
  brandSlug?: string;
  categorySlug?: string;
}

export function getProducts(
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {},
  sortBy?: { field: string; direction: "asc" | "desc" }
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
    category?.id,
    sortBy
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

export function updateProduct(id: number, data: ProductInput): Product | null {
  const existing = ProductModel.findById<ProductRowI>(id);
  if (!existing) return null;

  validateProductInput(data);

  const updatedProduct = ProductModel.updateProductWithCategories(
    id,
    mapToProductRow(data),
    data?.categoryIds
  );

  if (updatedProduct) {
    return getProductById(id);
  }

  return null;
}

export function deleteProduct(id: number): boolean {
  return ProductModel.delete(id);
}

export function getProductBySlug(slug: string): Product | null {
  const product = ProductModel.findOne<ProductRowI>({ slug });
  if (!product) return null;
  const categoriesMap = ProductModel.findCategoriesByProductIds([product.id]);
  return mapToProduct(categoriesMap)(product);
}
