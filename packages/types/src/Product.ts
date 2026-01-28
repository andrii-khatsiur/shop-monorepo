export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  oldPrice: number | null;
  discount: number | null;
  price: number;
  brandId: number | null;
  slug: string;
  isActive: boolean;
  isNew: boolean;
  createdAt: string;
  categoryIds: number[];
}

export interface ProductInput {
  name: string;
  description: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  brandId?: number | null;
  isActive?: boolean;
  isNew?: boolean;
  categoryIds?: number[];
}

export interface PaginatedProducts {
  hits: Product[];
  total: number;
}