import { S3Client } from "bun";
import { ENV } from "../config/env";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

if (
  !ENV.R2_BUCKET_NAME ||
  !ENV.R2_ACCESS_KEY_ID ||
  !ENV.R2_SECRET_ACCESS_KEY ||
  !ENV.R2_PUBLIC_URL ||
  !ENV.R2_ENDPOINT
) {
  logger.error("R2 environment variables are not set");
}

const r2 = new S3Client({
  accessKeyId: ENV.R2_ACCESS_KEY_ID,
  secretAccessKey: ENV.R2_SECRET_ACCESS_KEY,
  endpoint: ENV.R2_ENDPOINT,
  region: "auto",
});

export const R2Service = {
  async uploadFile(file: File) {
    const key = `temp/${uuidv4()}-${file.name}`;

    const s3file = r2.file(key, { bucket: ENV.R2_BUCKET_NAME });

    await s3file.write(await file.arrayBuffer(), {
      type: file.type || "application/octet-stream",
    });

    return {
      url: `${ENV.R2_PUBLIC_URL}/${key}`,
    };
  },

  async moveFromTemp(tempUrl: string, targetFolder: string): Promise<string> {
    const tempKey = tempUrl.replace(`${ENV.R2_PUBLIC_URL}/`, "");
    const newKey = tempKey.replace("temp/", `${targetFolder}/`);

    const tempFile = r2.file(tempKey, { bucket: ENV.R2_BUCKET_NAME });
    const content = await tempFile.arrayBuffer();
    const contentType =
      (await tempFile.stat())?.type || "application/octet-stream";

    const newFile = r2.file(newKey, { bucket: ENV.R2_BUCKET_NAME });
    await newFile.write(content, { type: contentType });

    await tempFile.delete();

    return `${ENV.R2_PUBLIC_URL}/${newKey}`;
  },

  async deleteFile(url: string) {
    const key = url.replace(`${ENV.R2_PUBLIC_URL}/`, "");
    const s3file = r2.file(key, { bucket: ENV.R2_BUCKET_NAME });
    await s3file.delete();
  },
};
