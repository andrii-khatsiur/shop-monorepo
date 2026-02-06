import { Hono } from "hono";
import * as handlers from "../handlers/upload";

const uploadRoutes = new Hono();

uploadRoutes.post("/", handlers.uploadFile);

export { uploadRoutes };
