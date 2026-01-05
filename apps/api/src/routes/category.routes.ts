import { Hono } from "hono";
import * as handlers from "../handlers/category";

const categoryRoutes = new Hono();

categoryRoutes.get("/", handlers.getCategories);
categoryRoutes.get("/:slug", handlers.getCategory);
categoryRoutes.post("/", handlers.createCategory);
categoryRoutes.put("/:id", handlers.updateCategory);
categoryRoutes.delete("/:id", handlers.deleteCategory);

export { categoryRoutes };
