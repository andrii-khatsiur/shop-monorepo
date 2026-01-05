import { Hono } from "hono";
import * as handlers from "../handlers/brand";

const brandRoutes = new Hono();

brandRoutes.get("/", handlers.getBrands);
brandRoutes.get("/:slug", handlers.getBrand);
brandRoutes.post("/", handlers.createBrand);
brandRoutes.put("/:id", handlers.updateBrand);
brandRoutes.delete("/:id", handlers.deleteBrand);

export { brandRoutes };
