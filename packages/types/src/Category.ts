export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  parentId: number | null;
  children?: Category[];
}

export interface CategoryInput {
  name: string;
  isActive: boolean;
  parentId?: number | null;
}
