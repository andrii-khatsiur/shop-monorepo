import { getProducts, createProduct } from "../../../services/productService";
import { createProductsData } from "../data/products";
import type { Brand, Category, Product } from "@shop-monorepo/types";

export function seedProducts(brands: Brand[], categories: Category[]): Product[] {
  const { total } = getProducts(1, 1);

  if (total > 0) {
    console.log(`  ↳ Products already seeded (${total} found)`);
    const { hits } = getProducts(1, total);
    return hits;
  }

  const productsData = createProductsData(brands, categories);

  console.log(`  ↳ Seeding ${productsData.length} products...`);

  const createdProducts: Product[] = [];

  for (const productData of productsData) {
    const product = createProduct(productData);
    if (product) {
      createdProducts.push(product);
    }
  }

  console.log(`  ↳ Created ${createdProducts.length} products`);

  return createdProducts;
}
