import { useSearchParams } from "react-router-dom";
import type { Category } from "@shop-monorepo/types";

export interface ProductFilters {
  brand?: string;
  category?: string;
}

export function useProductFilters(categories: Category[]) {
  const [searchParams, setSearchParams] = useSearchParams();

  const brandFilter = searchParams.get("brand") || undefined;
  const categoryFilter = searchParams.get("category") || undefined;

  const filters: ProductFilters = {
    brand: brandFilter,
    category: categoryFilter,
  };

  const flatCategories = categories.flatMap((c) => [c, ...(c.children || [])]);

  const selectedCategoryId = flatCategories.find(
    (c) => c.slug === categoryFilter
  )?.id;

  const setBrandFilter = (value: string | undefined) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set("brand", value);
      } else {
        prev.delete("brand");
      }
      prev.delete("page");
      return prev;
    });
  };

  const setCategoryFilter = (value: number | undefined) => {
    const category = flatCategories.find((c) => c.id === value);
    setSearchParams((prev) => {
      if (category) {
        prev.set("category", category.slug);
      } else {
        prev.delete("category");
      }
      prev.delete("page");
      return prev;
    });
  };

  return {
    filters,
    brandFilter,
    selectedCategoryId,
    setBrandFilter,
    setCategoryFilter,
  };
}
