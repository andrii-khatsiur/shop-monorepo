import { Model } from "../model";

export interface BrandRowI {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

export class BrandModel extends Model {
  public static tableName = "brands";
}
