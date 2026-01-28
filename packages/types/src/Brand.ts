export interface Brand {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface BrandInput {
  name: string;
  isActive: boolean;
}
