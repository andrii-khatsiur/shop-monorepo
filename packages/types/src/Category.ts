export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  parentId: number | null;
  children?: Category[];
}

export interface CategoryInput {
  name: string;
  image?: string | null;
  isActive: boolean;
  parentId?: number | null;
}
