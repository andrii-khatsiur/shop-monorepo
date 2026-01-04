import { Hono } from "hono";
import { brandRoutes } from "./brand";
import { categoryRoutes } from "./category";

const apiRoutes = new Hono();

apiRoutes.route("/brands", brandRoutes);
apiRoutes.route("/categories", categoryRoutes);

export { apiRoutes };
