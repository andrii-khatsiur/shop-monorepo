import { Hono } from "hono";
import { requireAdmin, AuthEnv } from "../middleware/requireAuth";
import * as handlers from "../handlers/category";

const categoryRoutes = new Hono();

// Public routes
categoryRoutes.get("/", handlers.getCategories);
categoryRoutes.get("/:slug", handlers.getCategory);

// Protected routes
const protectedCategories = new Hono<AuthEnv>();
protectedCategories.use("*", requireAdmin);
protectedCategories.post("/", handlers.createCategory);
protectedCategories.put("/:id", handlers.updateCategory);
protectedCategories.delete("/:id", handlers.deleteCategory);

categoryRoutes.route("/", protectedCategories);

export { categoryRoutes };
