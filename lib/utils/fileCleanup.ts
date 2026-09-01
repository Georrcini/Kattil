import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { del } from "@vercel/blob";

const DELETABLE_PREFIXES = [
  "/uploads/",
  "/images/madurai-gallery/",
  "/images/chennai-gallery/",
];

/**
 * Safely delete an uploaded file.
 * - Blob URLs (https://): deleted via Vercel Blob SDK when token is available
 * - Relative paths (/uploads/, /images/): deleted from local filesystem (dev)
 * - Static assets (/assets/): always skipped
 */
export async function deleteUploadedFile(
  path: string | null | undefined
): Promise<"deleted" | "skipped" | "missing"> {
  if (!path) return "missing";

  // Vercel Blob URL
  if (path.startsWith("https://") || path.startsWith("http://")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return "skipped";
    try {
      await del(path);
      console.log(`[fileCleanup] Deleted blob: ${path}`);
      return "deleted";
    } catch (err) {
      console.error(`[fileCleanup] Failed to delete blob ${path}:`, err);
      return "missing";
    }
  }

  // Static bundled asset — never delete
  if (path.startsWith("/assets/")) return "skipped";

  // Relative filesystem path — only allowed prefixes
  if (!DELETABLE_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return "skipped";
  }

  // Prevent path traversal
  if (path.includes("..")) return "skipped";

  const fullPath = join(process.cwd(), "public", path);
  if (!existsSync(fullPath)) return "missing";

  try {
    await unlink(fullPath);
    console.log(`[fileCleanup] Deleted: ${path}`);
    return "deleted";
  } catch (err) {
    console.error(`[fileCleanup] Failed to delete ${path}:`, err);
    return "missing";
  }
}

/** Delete multiple files, ignoring individual errors */
export async function deleteUploadedFiles(paths: (string | null | undefined)[]): Promise<void> {
  await Promise.allSettled(paths.map(deleteUploadedFile));
}
