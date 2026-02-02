import type { CategoryInput } from "@shop-monorepo/types";

export const rootCategoriesData: CategoryInput[] = [
  { name: "Макіяж", isActive: true },
  { name: "Догляд за шкірою", isActive: true },
  { name: "Догляд за волоссям", isActive: true },
  { name: "Парфумерія", isActive: true },
  { name: "Аксесуари", isActive: true },
  { name: "Чоловічий догляд", isActive: true },
];

export interface SubcategoryInput extends CategoryInput {
  parentSlug: string;
}

export const subCategoriesData: SubcategoryInput[] = [
  // Макіяж subcategories
  { name: "Губи", isActive: true, parentSlug: "makiyazh" },
  { name: "Очі", isActive: true, parentSlug: "makiyazh" },
  { name: "Обличчя", isActive: true, parentSlug: "makiyazh" },
  // Догляд за шкірою subcategories
  { name: "Сироватки", isActive: true, parentSlug: "doglyad-za-shkiroyu" },
  { name: "Креми", isActive: true, parentSlug: "doglyad-za-shkiroyu" },
  { name: "Маски", isActive: true, parentSlug: "doglyad-za-shkiroyu" },
  // Догляд за волоссям subcategories
  { name: "Шампуні", isActive: true, parentSlug: "doglyad-za-volossyam" },
  { name: "Кондиціонери", isActive: true, parentSlug: "doglyad-za-volossyam" },
  // Парфумерія subcategories
  { name: "Жіночі парфуми", isActive: true, parentSlug: "parfumeriya" },
  { name: "Чоловічі парфуми", isActive: true, parentSlug: "parfumeriya" },
  // Аксесуари subcategories
  { name: "Пензлі", isActive: true, parentSlug: "aksesuary" },
  { name: "Косметички", isActive: true, parentSlug: "aksesuary" },
  // Чоловічий догляд subcategories
  { name: "Гоління", isActive: true, parentSlug: "cholovichyj-doglyad" },
  { name: "Догляд за бородою", isActive: true, parentSlug: "cholovichyj-doglyad" },
];
