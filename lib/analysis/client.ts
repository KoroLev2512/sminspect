// Browser helpers for the inspection upload flow.

import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, type AnalysisResult } from "@/lib/analysis/types";

export const MAX_FILES_PER_INSPECTION = 8;
export const ACCEPT_ATTR = ".jpg,.jpeg,.png,image/jpeg,image/png";

/** Returns a Russian error message, or null if the file can be uploaded. */
export function validateFile(file: File): string | null {
  const okType =
    (ACCEPTED_TYPES as readonly string[]).includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
  if (!okType) return `«${file.name}»: поддерживаются только JPG, JPEG и PNG`;
  if (file.size > MAX_UPLOAD_BYTES) return `«${file.name}»: файл больше 10 МБ`;
  if (file.size === 0) return `«${file.name}»: файл пустой`;
  return null;
}

/** Sends one image to the analysis API. Throws with a user-facing message. */
export async function analyzeFile(file: File): Promise<AnalysisResult> {
  const body = new FormData();
  body.append("file", file, file.name);
  let res: Response;
  try {
    res = await fetch("/api/analysis", { method: "POST", body });
  } catch {
    throw new Error("Сервис анализа недоступен: проверьте подключение");
  }
  const data = (await res.json().catch(() => null)) as (AnalysisResult & { error?: string }) | null;
  if (!res.ok || !data || data.error) {
    throw new Error(data?.error ?? `Сервис анализа вернул ошибку ${res.status}`);
  }
  return data;
}

/**
 * Downscaled JPEG data URL kept in the demo store for images that are not
 * demo samples (the original file cannot be persisted in localStorage).
 */
export async function toStoredPreview(file: File, maxSide = 960): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Не удалось прочитать изображение"));
      el.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Не удалось обработать изображение");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Loads a prepared demo sample as a File, exactly as served (hash must match). */
export async function fetchSampleFile(url: string, name: string): Promise<File> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error("Не удалось загрузить демо-снимок");
  const blob = await res.blob();
  return new File([blob], name, { type: "image/jpeg" });
}
