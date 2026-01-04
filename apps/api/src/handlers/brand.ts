import { Context } from "hono";

import * as BrandRepo from "../repos/brandRepo";

export const getBrands = (c: Context) => {
  const brands = BrandRepo.getBrands();
  return c.json(brands);
};

export const getBrand = (c: Context) => {
  const id = Number(c.req.param("id"));
  const brand = BrandRepo.getBrandById(id);

  if (!brand) return c.json({ error: "Brand not found" }, 404);
  return c.json(brand);
};

export const createBrand = async (c: Context) => {
  try {
    const body = await c.req.json();
    const newBrand = BrandRepo.createBrand(body);
    return c.json(newBrand, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
};

export const updateBrand = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const updated = BrandRepo.updateBrand(id, body);
  if (!updated) return c.json({ error: "Brand not found" }, 404);

  return c.json(updated);
};

export const deleteBrand = (c: Context) => {
  const id = Number(c.req.param("id"));
  const success = BrandRepo.deleteBrand(id);

  if (!success) return c.json({ error: "Brand not found" }, 404);
  return c.json({ message: "Brand deleted successfully" });
};
