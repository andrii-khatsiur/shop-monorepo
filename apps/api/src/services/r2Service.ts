import { S3Client } from "bun";
import { ENV } from "../config/env";
import { v4 as uuidv4 } from "uuid";

if (
  !ENV.R2_BUCKET_NAME ||
  !ENV.R2_ACCESS_KEY_ID ||
  !ENV.R2_SECRET_ACCESS_KEY ||
  !ENV.R2_PUBLIC_URL ||
  !ENV.R2_ENDPOINT
) {
  throw new Error("R2 environment variables are not set");
}

const r2 = new S3Client({
  accessKeyId: ENV.R2_ACCESS_KEY_ID,
  secretAccessKey: ENV.R2_SECRET_ACCESS_KEY,
  endpoint: ENV.R2_ENDPOINT,
  region: "auto",
});

export const R2Service = {
  async uploadFile(file: File) {
    const key = `products/${uuidv4()}-${file.name}`;

    const s3file = r2.file(key, { bucket: ENV.R2_BUCKET_NAME });

    await s3file.write(await file.arrayBuffer(), {
      type: file.type || "application/octet-stream",
    });

    return {
      url: `${ENV.R2_PUBLIC_URL}/${key}`,
    };
  },

  async deleteFile(url: string) {
    const key = url.replace(`${ENV.R2_PUBLIC_URL}/`, "");
    const s3file = r2.file(key, { bucket: ENV.R2_BUCKET_NAME });
    await s3file.delete();
  },
};
