import { Context } from "hono";

import * as BrandService from "../services/brandService";

export const getBrands = (c: Context) => {
  const brands = BrandService.getBrands();
  return c.json(brands);
};

export const getBrand = (c: Context) => {
  const slug = c.req.param("slug");
  const brand = BrandService.getBrandBySlug(slug);

  if (!brand) {
    return c.json({ error: `Brand with slug "${slug}" not found` }, 404);
  }

  return c.json(brand);
};

export const createBrand = async (c: Context) => {
  const body = await c.req.json();
  const newBrand = BrandService.createBrand(body);
  return c.json(newBrand, 201);
};

export const updateBrand = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const updated = BrandService.updateBrand(id, body);
  if (!updated) return c.json({ error: "Brand not found" }, 404);

  return c.json(updated);
};

export const deleteBrand = (c: Context) => {
  const id = Number(c.req.param("id"));
  const success = BrandService.deleteBrand(id);

  if (!success) return c.json({ error: "Brand not found" }, 404);
  return c.json({ message: "Brand deleted successfully" });
};
