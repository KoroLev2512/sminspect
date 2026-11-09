// Client-only helpers for the profile photo.
// The avatar is stored inside the user record in localStorage, so it is
// center-cropped and downscaled to a small JPEG before saving.

export const AVATAR_SIZE = 256;
export const MAX_AVATAR_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export const AVATAR_ACCEPT = ACCEPTED.join(",");

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode"));
    img.src = src;
  });
}

/**
 * Validates an uploaded file and returns a 256×256 JPEG data URL,
 * or throws an Error with a user-facing Russian message.
 */
export async function fileToAvatar(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Поддерживаются JPG, PNG и WebP");
  }
  if (file.size > MAX_AVATAR_FILE_BYTES) {
    throw new Error("Файл больше 5 МБ");
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url).catch(() => {
      throw new Error("Не удалось прочитать изображение");
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    const sy = (img.naturalHeight - side) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Не удалось обработать изображение");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
