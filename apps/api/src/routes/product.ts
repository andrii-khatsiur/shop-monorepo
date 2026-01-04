import { Hono } from "hono";
import * as handlers from "../handlers/product";

const productRoutes = new Hono();

productRoutes.get("/", handlers.getProducts);
productRoutes.get("/:idOrSlug", handlers.getProduct);
productRoutes.post("/", handlers.createProduct);
productRoutes.patch("/:id", handlers.updateProduct);
productRoutes.delete("/:id", handlers.deleteProduct);

export { productRoutes };
