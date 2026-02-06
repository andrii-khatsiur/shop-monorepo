import { Model, SortPropsType } from "./model";

export interface CategoryRowI {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  is_active: number;
  parent_id: number | null;
}

export class CategoryModel extends Model {
  public static tableName = "categories";

  static findAllSorted<T>(
    this: typeof Model & { tableName: string },
    sort?: SortPropsType
  ): T[] {
    const defaultSort = { name: "asc" } as { [key: string]: "asc" | "desc" };
    const effectiveSort =
      sort && Object.keys(sort).length > 0 ? sort : defaultSort;
    return this.findMany({}, effectiveSort) as T[];
  }
}
