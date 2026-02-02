import { Model, SortPropsType } from "./model";

export interface BrandRowI {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

export class BrandModel extends Model {
  public static tableName = "brands";

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
