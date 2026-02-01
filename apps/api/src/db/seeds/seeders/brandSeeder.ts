import { getBrands, createBrand } from "../../../services/brandService";
import { brandsData } from "../data/brands";
import type { Brand } from "@shop-monorepo/types";

export function seedBrands(): Brand[] {
  const existingBrands = getBrands();

  if (existingBrands.length > 0) {
    console.log(`  ↳ Brands already seeded (${existingBrands.length} found)`);
    return existingBrands;
  }

  console.log(`  ↳ Seeding ${brandsData.length} brands...`);

  const createdBrands: Brand[] = [];

  for (const brandData of brandsData) {
    const brand = createBrand(brandData);
    createdBrands.push(brand);
  }

  console.log(`  ↳ Created ${createdBrands.length} brands`);

  return createdBrands;
}
