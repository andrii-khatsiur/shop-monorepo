import { Hono } from "hono";
import { requireAdmin, AuthEnv } from "../middleware/requireAuth";
import * as handlers from "../handlers/upload";

const uploadRoutes = new Hono<AuthEnv>();

// All upload routes are protected
uploadRoutes.use("*", requireAdmin);
uploadRoutes.post("/", handlers.uploadFile);
uploadRoutes.delete("/", handlers.deleteFile);

export { uploadRoutes };
