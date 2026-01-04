import { Hono } from "hono";
import * as handlers from "../handlers/brand";

const brandRoutes = new Hono();

brandRoutes.get("/", handlers.getBrands);
brandRoutes.get("/:id", handlers.getBrand);
brandRoutes.post("/", handlers.createBrand);
brandRoutes.patch("/:id", handlers.updateBrand);
brandRoutes.delete("/:id", handlers.deleteBrand);

export { brandRoutes };
