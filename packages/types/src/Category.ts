export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CategoryInput {
  name: string;
  isActive: boolean;
}
