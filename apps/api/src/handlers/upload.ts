import { Context } from "hono";
import { R2Service } from "../services/r2Service";

export const uploadFile = async (c: Context) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return c.json({ error: "File not provided" }, 400);
  }

  try {
    const result = await R2Service.uploadFile(file);
    return c.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "File upload failed" }, 500);
  }
};
