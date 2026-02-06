import { Hono } from "hono";
import { requireAdmin, AuthEnv } from "../middleware/requireAuth";
import * as handlers from "../handlers/brand";

const brandRoutes = new Hono();

// Public routes
brandRoutes.get("/", handlers.getBrands);
brandRoutes.get("/:slug", handlers.getBrand);

// Protected routes
const protectedBrands = new Hono<AuthEnv>();
protectedBrands.use("*", requireAdmin);
protectedBrands.post("/", handlers.createBrand);
protectedBrands.put("/:id", handlers.updateBrand);
protectedBrands.delete("/:id", handlers.deleteBrand);

brandRoutes.route("/", protectedBrands);

export { brandRoutes };
