import { createClient } from "@/lib/supabase/client";

// Client-side image ingestion for the admin back-office (brief §9-11, §22-23).
// - Without Supabase configured: downscaled and encoded as a data URL, stored directly on
//   the record (see store/useCatalogStore.ts).
// - With Supabase configured: downscaled the same way, then uploaded as a real file to the
//   `catalog` Storage bucket, returning a public URL.
// Either way `images: string[]` holds a plain URL string — screens never know which.

const MAX_DIM = 1200;
const ACCEPT = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];

export function isAcceptedImage(file: File) {
  return ACCEPT.includes(file.type);
}

async function downscale(file: File, maxDim = MAX_DIM): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    ctx.drawImage(bitmap, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/webp", 0.85)
    );
  } finally {
    bitmap.close?.();
  }
}

export async function fileToDataUrl(file: File, maxDim = MAX_DIM): Promise<string> {
  const blob = await downscale(file, maxDim);
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Uploads to the `catalog` Storage bucket under `folder/`, returns the public URL.
 * Caller must check isSupabaseConfigured() first. */
export async function uploadToCatalogBucket(file: File, folder: string): Promise<string> {
  const supabase = createClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const blob = await downscale(file);
  const path = `${folder}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from("catalog").upload(path, blob, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("catalog").getPublicUrl(path);
  return data.publicUrl;
}
