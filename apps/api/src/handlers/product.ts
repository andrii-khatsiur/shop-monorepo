import { Context } from "hono";
import * as ProductRepo from "../repos/productRepo";

export const getProducts = (c: Context) => {
  const page = Number(c.req.query("page") || 1);
  const limit = Number(c.req.query("limit") || 10);

  const result = ProductRepo.getProducts(page, limit);
  return c.json(result);
};

export const getProduct = (c: Context) => {
  const param = c.req.param("idOrSlug");

  const isId = /^\d+$/.test(param);

  const product = isId
    ? ProductRepo.getProductById(Number(param))
    : ProductRepo.getProductBySlug(param);

  if (!product) {
    return c.json({ error: `Product "${param}" not found` }, 404);
  }

  return c.json(product);
};

export const createProduct = async (c: Context) => {
  try {
    const body = await c.req.json();
    const product = ProductRepo.createProduct(body);
    return c.json(product, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
};

export const updateProduct = async (c: Context) => {
  const id = Number(c.req.param("id"));
  try {
    const body = await c.req.json();
    const updated = ProductRepo.updateProduct(id, body);
    if (!updated) return c.json({ error: "Product not found" }, 404);
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
};

export const deleteProduct = (c: Context) => {
  const id = Number(c.req.param("id"));
  const success = ProductRepo.deleteProduct(id);
  if (!success) return c.json({ error: "Product not found" }, 404);
  return c.json({ message: "Product deleted" });
};
