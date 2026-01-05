import { Model } from "./model";

export interface CategoryRowI {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

export class CategoryModel extends Model {
  public static tableName = "categories";
}
