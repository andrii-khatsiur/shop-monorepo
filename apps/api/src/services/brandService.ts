import { BrandModel, BrandRowI } from "../db/models/BrandModel";
import { slugify } from "../utils/common";
import type { Brand, BrandInput } from "@shop-monorepo/types";

const mapRowToBrand = (row: BrandRowI): Brand => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  isActive: Boolean(row.is_active),
});

const mapBrandToRow = (brand: BrandInput): Omit<BrandRowI, "id"> => ({
  name: brand.name,
  slug: slugify(brand.name),
  is_active: brand.isActive ? 1 : 0,
});

export function createBrand(data: BrandInput): Brand {
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

export interface BrandFilters {
  isActive?: boolean;
}

const mapSortFieldToSnakeCase = (field: string) => {
  if (field === 'isActive') return 'is_active';
  return field;
};

export function getBrands(
  sort?: { [key: string]: "asc" | "desc" | undefined },
  filters?: BrandFilters
): Brand[] {
  const mappedSort = sort
    ? { [mapSortFieldToSnakeCase(Object.keys(sort)[0])]: Object.values(sort)[0] }
    : undefined;

  const where: Record<string, number> = {};
  if (filters?.isActive !== undefined) {
    where.is_active = filters.isActive ? 1 : 0;
  }

  const defaultSort = { name: "asc" } as { [key: string]: "asc" | "desc" };
  const effectiveSort = mappedSort && Object.keys(mappedSort).length > 0 ? mappedSort : defaultSort;

  const brands = BrandModel.findMany<BrandRowI>(where, effectiveSort);
  return brands.map(mapRowToBrand);
}

export function getBrandBySlug(slug: string): Brand | null {
  const brand = BrandModel.findOne<BrandRowI>({ slug });

  return brand ? mapRowToBrand(brand) : null;
}

export function updateBrand(id: number, data: BrandInput): Brand | null {
  const existing = BrandModel.findById<BrandRowI>(id);
  if (!existing) return null;

  const brand = BrandModel.update<BrandRowI>(id, mapBrandToRow(data));

  return brand ? mapRowToBrand(brand) : null;
}

export function deleteBrand(id: number): boolean {
  const result = BrandModel.delete(id);
  return result;
}
