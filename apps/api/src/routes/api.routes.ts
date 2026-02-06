import { Hono } from "hono";
import { brandRoutes } from "./brand.routes";
import { categoryRoutes } from "./category.routes";
import { productRoutes } from "./product.routes";
import { authRoutes } from "./auth.routes";
import { uploadRoutes } from "./upload.routes";

const apiRoutes = new Hono();

apiRoutes.route("/brands", brandRoutes);
apiRoutes.route("/categories", categoryRoutes);
apiRoutes.route("/products", productRoutes);
apiRoutes.route("/auth", authRoutes);
apiRoutes.route("/upload", uploadRoutes);

export { apiRoutes };
