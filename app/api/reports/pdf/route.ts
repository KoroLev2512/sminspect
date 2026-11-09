import { NextResponse } from "next/server";
import { reportTypes } from "@/lib/dashboard";
import { renderReport } from "@/lib/pdf/report";
import type { ReportPayload } from "@/lib/pdf/types";

export const runtime = "nodejs";

const MAX_BODY = 8 * 1024 * 1024;

function isPayload(v: unknown): v is ReportPayload {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.type === "string" &&
    (reportTypes as string[]).includes(p.type) &&
    typeof p.number === "string" &&
    p.number.length <= 40 &&
    typeof p.title === "string" &&
    p.title.length <= 300 &&
    typeof p.period === "string" &&
    typeof p.generatedAt === "string" &&
    typeof p.asOf === "string" &&
    Array.isArray(p.objects) &&
    p.objects.length <= 100 &&
    Array.isArray(p.defects) &&
    p.defects.length <= 1000
  );
}

/** Renders a PDF report from data sent by the dashboard (the demo state lives in the browser). */
export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY) {
    return NextResponse.json({ error: "Слишком большой объём данных для отчёта" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный формат данных" }, { status: 400 });
  }
  if (!isPayload(payload)) {
    return NextResponse.json({ error: "Неполные данные отчёта" }, { status: 400 });
  }

  try {
    const pdf = await renderReport(payload);
    const fileName = `${payload.number}.pdf`;
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdf.length),
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[reports] PDF render failed", err);
    return NextResponse.json({ error: "Не удалось сформировать PDF" }, { status: 500 });
  }
}
