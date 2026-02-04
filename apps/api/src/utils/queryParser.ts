import { Context } from "hono";

export const parseBooleanParam = (
  value: string | undefined
): boolean | undefined => {
  if (value === undefined) return undefined;
  return value === "true";
};

export function parseSortParams(
  c: Context
): { [key: string]: "asc" | "desc" | undefined } | undefined {
  const sortByField = c.req.query("sortBy");
  const sortDir = c.req.query("sortDir") as "asc" | "desc" | undefined;

  if (sortByField) {
    return { [sortByField]: sortDir || "asc" };
  }
  return undefined;
}