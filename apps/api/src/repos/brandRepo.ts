import { BrandModel, BrandRowI } from "../db/models/BrandModel";
import { slugify } from "../utils/common";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

interface BrandDto {
  name: string;
  isActive: boolean;
}

const mapRowToBrand = (row: BrandRowI): Brand => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
});

const mapBrandToRow = (brand: BrandDto): Omit<BrandRowI, "id"> => ({
  name: brand.name,
  slug: slugify(brand.name),
  is_active: brand.isActive ? 1 : 0,
});

export function createBrand(data: BrandDto): Brand {
  const input = mapBrandToRow(data);
  try {
    const brand = BrandModel.create<BrandRowI>(input);

    if (!brand) throw new Error("Failed to create brand");
    return mapRowToBrand(brand);
  } catch (error: any) {
    if (error.message?.includes("UNIQUE constraint failed")) {
      throw new Error(`Brand with slug "${input.slug}" already exists`);
    }
    throw error;
  }
}

export function getBrands(): Brand[] {
  const brands = BrandModel.findAll<BrandRowI>();
  return brands.map(mapRowToBrand);
}

export function getBrandBySlug(slug: string): Brand | null {
  const brand = BrandModel.findOne<BrandRowI>({ slug });

  return brand ? mapRowToBrand(brand) : null;
}

export function updateBrand(id: number, data: BrandDto): Brand | null {
  const existing = BrandModel.findById<BrandRowI>(id);
  if (!existing) return null;

  const brand = BrandModel.update<BrandRowI>(id, mapBrandToRow(data));

  return brand ? mapRowToBrand(brand) : null;
}

export function deleteBrand(id: number): boolean {
  const result = BrandModel.delete(id);
  return result;
}
