import { Hono } from "hono";
import { requireAdmin, AuthEnv } from "../middleware/requireAuth";
import * as handlers from "../handlers/product";

const productRoutes = new Hono();

// Public routes
productRoutes.get("/", handlers.getProducts);
productRoutes.get("/:idOrSlug", handlers.getProduct);

// Protected routes
const protectedProducts = new Hono<AuthEnv>();
protectedProducts.use("*", requireAdmin);
protectedProducts.post("/", handlers.createProduct);
protectedProducts.put("/:id", handlers.updateProduct);
protectedProducts.delete("/:id", handlers.deleteProduct);

productRoutes.route("/", protectedProducts);

export { productRoutes };
