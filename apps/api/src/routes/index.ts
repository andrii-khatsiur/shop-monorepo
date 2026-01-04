import { Hono } from "hono";
import brandRoutes from "./brand";

const api = new Hono();

api.route("/brands", brandRoutes);

export default api;
