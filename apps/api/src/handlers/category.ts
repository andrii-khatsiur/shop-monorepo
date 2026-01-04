import { Context } from "hono";
import * as CategoryRepo from "../repos/categoryRepo";

export const getCategories = (c: Context) => {
  const categories = CategoryRepo.getCategories();
  return c.json(categories);
};

export const getCategory = (c: Context) => {
  const slug = c.req.param("slug");
  const category = CategoryRepo.getCategoryBySlug(slug);

  if (!category) {
    return c.json({ error: `Category "${slug}" not found` }, 404);
  }

  return c.json(category);
};

export const createCategory = async (c: Context) => {
  const body = await c.req.json();
  const newCategory = CategoryRepo.createCategory(body);
  return c.json(newCategory, 201);
};

export const updateCategory = async (c: Context) => {
  const id = Number(c.req.param("id"));

  const body = await c.req.json();
  const updated = CategoryRepo.updateCategory(id, body);

  if (!updated) return c.json({ error: "Category not found" }, 404);
  return c.json(updated);
};

export const deleteCategory = (c: Context) => {
  const id = Number(c.req.param("id"));
  const success = CategoryRepo.deleteCategory(id);

  if (!success) return c.json({ error: "Category not found" }, 404);
  return c.json({ message: "Category deleted successfully" });
};
