import { Hono } from "hono";
import { brandRoutes } from "./brand";
import { categoryRoutes } from "./category";
import { productRoutes } from "./product";

const apiRoutes = new Hono();

apiRoutes.route("/brands", brandRoutes);
apiRoutes.route("/categories", categoryRoutes);
apiRoutes.route("/products", productRoutes);

export { apiRoutes };
