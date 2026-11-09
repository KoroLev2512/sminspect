import { NextResponse } from "next/server";
import { demoEngine } from "@/lib/analysis/demo-engine";
import { MAX_UPLOAD_BYTES, type AnalysisInput } from "@/lib/analysis/types";

export const runtime = "nodejs";

// The engine is swappable: replace demoEngine with a real model adapter that
// implements AnalysisEngine (lib/analysis/types.ts).
const engine = demoEngine;

function detectType(bytes: Uint8Array): AnalysisInput["mimeType"] | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  return null;
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "Файл больше 10 МБ" }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Ожидается multipart/form-data с полем file" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Не передан файл" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Файл пустой" }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Файл больше 10 МБ" }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = detectType(bytes);
  if (!mimeType) {
    return NextResponse.json(
      { error: "Поддерживаются только изображения JPG и PNG" },
      { status: 415 },
    );
  }

  try {
    const result = await engine.analyze({ fileName: file.name.slice(0, 200), mimeType, bytes });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[analysis] engine failed", err);
    return NextResponse.json({ error: "Сбой модуля анализа" }, { status: 500 });
  }
}
