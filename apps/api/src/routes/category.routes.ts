import { Hono } from "hono";
import * as handlers from "../handlers/category";

const categoryRoutes = new Hono();

categoryRoutes.get("/", handlers.getCategories);
categoryRoutes.get("/:slug", handlers.getCategory); // Публічний доступ по слагу
categoryRoutes.post("/", handlers.createCategory);
categoryRoutes.patch("/:id", handlers.updateCategory); // Адмін-дії по ID
categoryRoutes.delete("/:id", handlers.deleteCategory);

export { categoryRoutes };
