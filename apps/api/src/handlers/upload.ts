import { Context } from "hono";
import { R2Service } from "../services/r2Service";
import { logger } from "../utils/logger";

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
    return c.json({ error: "File upload failed" }, 500);
  }
};

export const deleteFile = async (c: Context) => {
  const { url } = await c.req.json<{ url: string }>();

  if (!url) {
    return c.json({ error: "URL not provided" }, 400);
  }

  try {
    await R2Service.deleteFile(url);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "File deletion failed" }, 500);
  }
};
