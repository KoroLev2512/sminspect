// Server-side PDF report renderer (pdfkit). Imported only by
// app/api/reports/pdf/route.ts. Fonts: Inter TTF with Cyrillic from
// assets/fonts (traced into the standalone build via next.config.ts).

import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import {
  SEVERITY_PENALTY,
  STATUS_THRESHOLDS,
  defectStatusLabels,
  formatDate,
  formatDateTime,
  inspectionStatusLabels,
  severityLabels,
  sourceLabels,
  statusLabels,
  typeLabels,
  type BBox,
  type Severity,
} from "@/lib/dashboard";
import { MAX_PDF_IMAGES, type PdfDetection, type ReportPayload } from "@/lib/pdf/types";

type Doc = PDFKit.PDFDocument;

const C = {
  navy: "#001733",
  blue: "#006aed",
  cyan: "#18dcdc",
  slate: "#68748d",
  graphite: "#464e5d",
  mist: "#e6e9f0",
  hail: "#f3f4f8",
  amber: "#f5a623",
  amberText: "#8a5a00",
  red: "#c0392b",
  green: "#1e874b",
};

const sevColor: Record<Severity, string> = { critical: "#e5484d", medium: C.amber, low: C.cyan };
const statusColor = { critical: C.red, warning: C.amber, good: C.green } as const;

const M = 48; // page margin
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const CONTENT_W = PAGE_W - M * 2;
const BOTTOM = PAGE_H - M - 24; // leave room for the footer

// ---- Assets (read once per process) ------------------------------------------

let fontCache: Record<string, Buffer> | null = null;
function fonts() {
  if (!fontCache) {
    const dir = path.join(process.cwd(), "assets/fonts");
    fontCache = {
      regular: fs.readFileSync(path.join(dir, "Inter-400.ttf")),
      semibold: fs.readFileSync(path.join(dir, "Inter-600.ttf")),
      bold: fs.readFileSync(path.join(dir, "Inter-700.ttf")),
    };
  }
  return fontCache;
}

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Resolves a report image: public file path or data URL. Returns null if unusable. */
function loadImage(src: string): Buffer | null {
  try {
    if (src.startsWith("data:image/")) {
      const m = /^data:image\/(jpeg|png);base64,(.+)$/.exec(src);
      if (!m) return null;
      const buf = Buffer.from(m[2], "base64");
      return buf.length <= 4 * 1024 * 1024 ? buf : null;
    }
    if (!/^\/[\w\-/.]+\.(jpe?g|png)$/i.test(src)) return null;
    const file = path.normalize(path.join(PUBLIC_DIR, src));
    if (!file.startsWith(PUBLIC_DIR + path.sep)) return null;
    return fs.readFileSync(file);
  } catch {
    return null;
  }
}

// ---- Layout helpers ---------------------------------------------------------

function font(doc: Doc, weight: "regular" | "semibold" | "bold", size: number, color = C.navy) {
  doc.font(`Inter-${weight}`).fontSize(size).fillColor(color);
  return doc;
}

function ensure(doc: Doc, height: number) {
  if (doc.y + height > BOTTOM) {
    doc.addPage();
    doc.y = M;
  }
}

function heading(doc: Doc, text: string) {
  ensure(doc, 60);
  doc.moveDown(0.6);
  font(doc, "bold", 15).text(text, M, doc.y, { width: CONTENT_W });
  const y = doc.y + 4;
  doc.rect(M, y, 32, 2.5).fill(C.blue);
  doc.y = y + 12;
}

function paragraph(doc: Doc, text: string, opts: { color?: string; size?: number } = {}) {
  font(doc, "regular", opts.size ?? 10, opts.color ?? C.graphite);
  ensure(doc, doc.heightOfString(text, { width: CONTENT_W }) + 6);
  doc.text(text, M, doc.y, { width: CONTENT_W, lineGap: 2 });
  doc.moveDown(0.4);
}

function keyValues(doc: Doc, rows: [string, string][]) {
  const labelW = 170;
  for (const [k, v] of rows) {
    font(doc, "regular", 10);
    const h = Math.max(
      doc.heightOfString(k, { width: labelW }),
      doc.heightOfString(v, { width: CONTENT_W - labelW }),
    );
    ensure(doc, h + 8);
    const y = doc.y;
    font(doc, "regular", 10, C.slate).text(k, M, y, { width: labelW });
    font(doc, "semibold", 10).text(v, M + labelW, y, { width: CONTENT_W - labelW });
    doc.y = y + h + 6;
  }
}

function kpis(doc: Doc, items: { label: string; value: string; color?: string }[]) {
  const gap = 10;
  const w = (CONTENT_W - gap * (items.length - 1)) / items.length;
  ensure(doc, 70);
  const y = doc.y;
  items.forEach((it, idx) => {
    const x = M + idx * (w + gap);
    doc.roundedRect(x, y, w, 62, 6).fill(C.hail);
    font(doc, "regular", 8.5, C.slate).text(it.label, x + 10, y + 10, { width: w - 20 });
    font(doc, "bold", 20, it.color ?? C.navy).text(it.value, x + 10, y + 30, { width: w - 20 });
  });
  doc.y = y + 74;
}

interface Column {
  header: string;
  width: number;
  align?: "left" | "right" | "center";
}

/** Table with automatic row heights, page breaks and repeated headers. */
function table(doc: Doc, columns: Column[], rows: string[][], rowColors?: (string | null)[]) {
  const pad = 5;
  const drawHeader = () => {
    const y = doc.y;
    doc.rect(M, y, CONTENT_W, 20).fill(C.navy);
    let x = M;
    for (const c of columns) {
      font(doc, "semibold", 8, "#ffffff").text(c.header, x + pad, y + 6, {
        width: c.width - pad * 2,
        align: c.align ?? "left",
        lineBreak: false,
        ellipsis: true,
      });
      x += c.width;
    }
    doc.y = y + 20;
  };

  ensure(doc, 44);
  drawHeader();
  rows.forEach((row, ri) => {
    font(doc, "regular", 8.5);
    const h =
      Math.max(...row.map((cell, ci) => doc.heightOfString(cell, { width: columns[ci].width - pad * 2 }))) +
      pad * 2;
    if (doc.y + h > BOTTOM) {
      doc.addPage();
      doc.y = M;
      drawHeader();
    }
    const y = doc.y;
    if (ri % 2 === 1) doc.rect(M, y, CONTENT_W, h).fill(C.hail);
    let x = M;
    row.forEach((cell, ci) => {
      const color = ci === 0 && rowColors?.[ri] ? rowColors[ri]! : C.navy;
      font(doc, ci === 0 ? "semibold" : "regular", 8.5, color).text(cell, x + pad, y + pad, {
        width: columns[ci].width - pad * 2,
        align: columns[ci].align ?? "left",
      });
      x += columns[ci].width;
    });
    doc.moveTo(M, y + h).lineTo(M + CONTENT_W, y + h).lineWidth(0.5).strokeColor(C.mist).stroke();
    doc.y = y + h;
  });
  doc.moveDown(0.8);
}

function severityBars(doc: Doc, counts: Record<Severity, number>) {
  const order: Severity[] = ["critical", "medium", "low"];
  const max = Math.max(1, ...order.map((s) => counts[s]));
  for (const s of order) {
    ensure(doc, 22);
    const y = doc.y;
    font(doc, "regular", 9.5, C.graphite).text(severityLabels[s], M, y + 2, { width: 100 });
    const w = ((CONTENT_W - 160) * counts[s]) / max;
    doc.roundedRect(M + 110, y, CONTENT_W - 160, 14, 3).fill(C.hail);
    if (counts[s] > 0) doc.roundedRect(M + 110, y, Math.max(w, 4), 14, 3).fill(sevColor[s]);
    font(doc, "semibold", 9.5).text(String(counts[s]), M + CONTENT_W - 40, y + 2, {
      width: 40,
      align: "right",
    });
    doc.y = y + 22;
  }
  doc.moveDown(0.4);
}

/** Draws an image with numbered annotation boxes. Returns false if the image is unusable. */
function annotatedImage(
  doc: Doc,
  src: string,
  boxes: { bbox: BBox; severity: Severity; label: string }[],
  maxW: number,
  maxH: number,
  caption: string,
  at?: { x: number; y: number },
): number | false {
  const buf = loadImage(src);
  if (!buf) return false;
  let img: { width: number; height: number };
  try {
    // openImage exists in pdfkit but is missing from @types/pdfkit.
    img = (doc as unknown as { openImage(src: Buffer): { width: number; height: number } }).openImage(buf);
  } catch {
    return false;
  }
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  font(doc, "regular", 8.5);
  const capH = doc.heightOfString(caption, { width: w });
  if (!at) ensure(doc, h + capH + 16);
  const x = at?.x ?? M;
  const y = at?.y ?? doc.y;
  doc.image(buf, x, y, { width: w, height: h });
  boxes.forEach((b, idx) => {
    const bx = x + (b.bbox.x / 100) * w;
    const by = y + (b.bbox.y / 100) * h;
    const bw = (b.bbox.w / 100) * w;
    const bh = (b.bbox.h / 100) * h;
    doc.rect(bx, by, bw, bh).lineWidth(1.6).strokeColor(sevColor[b.severity]).stroke();
    const tag = String(idx + 1);
    doc.rect(bx, Math.max(y, by - 13), 14, 13).fill(sevColor[b.severity]);
    font(doc, "bold", 8, C.navy).text(tag, bx, Math.max(y, by - 13) + 2.5, {
      width: 14,
      align: "center",
      lineBreak: false,
    });
  });
  font(doc, "regular", 8.5, C.slate).text(caption, x, y + h + 4, { width: w });
  const total = h + capH + 12;
  if (!at) doc.y = y + total;
  return total;
}

function legend(doc: Doc, items: { severity: Severity; text: string }[]) {
  items.forEach((it, idx) => {
    font(doc, "regular", 9);
    const h = doc.heightOfString(`${idx + 1}. ${it.text}`, { width: CONTENT_W - 16 });
    ensure(doc, h + 4);
    const y = doc.y;
    doc.rect(M, y + 2, 8, 8).fill(sevColor[it.severity]);
    font(doc, "regular", 9, C.graphite).text(`${idx + 1}. ${it.text}`, M + 14, y, {
      width: CONTENT_W - 14,
    });
    doc.y = y + h + 3;
  });
  doc.moveDown(0.5);
}

function disclaimerBox(doc: Doc, text: string) {
  font(doc, "regular", 9);
  const h = doc.heightOfString(text, { width: CONTENT_W - 28 }) + 20;
  ensure(doc, h + 10);
  const y = doc.y;
  doc.roundedRect(M, y, CONTENT_W, h, 6).fill("#fdf3e1");
  doc.rect(M, y, 3, h).fill(C.amber);
  font(doc, "regular", 9, C.amberText).text(text, M + 16, y + 10, { width: CONTENT_W - 28 });
  doc.y = y + h + 10;
}

// ---- Sections ---------------------------------------------------------------

const reportHeadings: Record<ReportPayload["type"], string> = {
  Состояние: "Отчёт о состоянии объекта",
  Инспекция: "Отчёт по инспекции",
  "Прогноз износа": "Прогноз износа и приоритеты ремонта",
  Сводный: "Сводный отчёт по объектам",
};

const DEMO_NOTICE =
  "Демонстрационный отчёт. Данные объектов, дефектов и инспекций — демонстрационный набор SmartInspect. Разметка снимков подготовлена заранее и не является результатом работы обученной модели компьютерного зрения. Индекс состояния и сроки ремонта рассчитаны по демо-методике и требуют подтверждения инженером.";

function titlePage(doc: Doc, p: ReportPayload) {
  doc.rect(0, 0, PAGE_W, 230).fill(C.navy);
  const logo = loadImage("/logo.png");
  if (logo) {
    doc.roundedRect(M, 52, 44, 44, 8).fill("#ffffff");
    doc.image(logo, M + 6, 58, { width: 32, height: 32 });
  }
  font(doc, "bold", 20, "#ffffff").text("SmartInspect", M + 56, 62);
  font(doc, "regular", 9.5, "#d1d6e0").text(
    "Платформа диагностики дорог и мостовых сооружений",
    M + 56,
    86,
  );
  font(doc, "semibold", 11, C.cyan).text(reportHeadings[p.type].toUpperCase(), M, 150, {
    width: CONTENT_W,
    characterSpacing: 0.6,
  });
  font(doc, "bold", 22, "#ffffff").text(p.title, M, 172, { width: CONTENT_W, lineGap: 2 });

  doc.y = 270;
  keyValues(doc, [
    ["Номер отчёта", p.number],
    ["Тип", p.type],
    ["Период", p.period],
    ["Сформирован", formatDateTime(p.generatedAt)],
    ["Срез демо-данных", formatDate(p.asOf)],
    [
      "Объекты",
      p.objects.length === 1 ? p.objects[0].name : `${p.objects.length} объектов мониторинга`,
    ],
  ]);
  doc.moveDown(1);
  disclaimerBox(doc, DEMO_NOTICE);
}

function objectSection(doc: Doc, o: ReportPayload["objects"][number]) {
  heading(doc, "Сведения об объекте");
  keyValues(doc, [
    ["Объект", o.name],
    ["Тип", typeLabels[o.type]],
    ["Регион", o.region],
    ["Протяжённость", o.length],
    ["Статус", statusLabels[o.status]],
    [
      "Последняя инспекция",
      o.lastInspection
        ? `${formatDate(o.lastInspection.date)} · ${sourceLabels[o.lastInspection.source]} · ${o.lastInspection.operator}`
        : "нет данных",
    ],
  ]);
  heading(doc, "Ключевые показатели");
  kpis(doc, [
    { label: "Индекс состояния", value: `${o.condition}/100`, color: statusColor[o.status] },
    { label: "Открытых дефектов", value: String(o.open) },
    { label: "Критических открытых", value: String(o.critical), color: o.critical ? C.red : C.navy },
    { label: "Ремонт через (оценка)", value: `≈${o.forecastMonths} мес.` },
  ]);
}

function defectsTable(doc: Doc, p: ReportPayload, withObject: boolean) {
  if (p.defects.length === 0) {
    paragraph(doc, "Дефекты не выявлены.");
    return;
  }
  const cols: Column[] = withObject
    ? [
        { header: "№", width: 26 },
        { header: "Дефект", width: 120 },
        { header: "Объект", width: 120 },
        { header: "Расположение", width: 110 },
        { header: "Критичность", width: 64 },
        { header: "Статус", width: CONTENT_W - 440 },
      ]
    : [
        { header: "№", width: 26 },
        { header: "Дефект", width: 140 },
        { header: "Расположение", width: 150 },
        { header: "Выявлен", width: 70 },
        { header: "Критичность", width: 64 },
        { header: "Статус", width: CONTENT_W - 450 },
      ];
  table(
    doc,
    cols,
    p.defects.map((d, idx) =>
      withObject
        ? [String(idx + 1), d.type, d.objectName, d.location, severityLabels[d.severity], defectStatusLabels[d.status]]
        : [String(idx + 1), d.type, d.location, formatDate(d.detectedAt), severityLabels[d.severity], defectStatusLabels[d.status]],
    ),
  );
}

function severityCounts(p: ReportPayload, openOnly = true) {
  const counts: Record<Severity, number> = { critical: 0, medium: 0, low: 0 };
  for (const d of p.defects) if (!openOnly || d.status !== "resolved") counts[d.severity] += 1;
  return counts;
}

function photosSection(doc: Doc, p: ReportPayload) {
  const withPhoto = p.defects.filter((d) => d.status !== "resolved").slice(0, MAX_PDF_IMAGES);
  if (withPhoto.length === 0) return;
  heading(doc, "Фотофиксация открытых дефектов");
  paragraph(doc, "Области повреждений выделены по демонстрационной разметке. Цвет рамки — критичность.", { size: 9 });
  // Two photos per row; frames are 4:3.
  const gap = 14;
  const colW = (CONTENT_W - gap) / 2;
  const imgH = colW * 0.75;
  for (let i = 0; i < withPhoto.length; i += 2) {
    const pair = withPhoto.slice(i, i + 2);
    const captions = pair.map(
      (d) => `${d.type} · ${severityLabels[d.severity]} · ${d.location} · выявлен ${formatDate(d.detectedAt)}`,
    );
    font(doc, "regular", 8.5);
    const capH = Math.max(...captions.map((c) => doc.heightOfString(c, { width: colW })));
    ensure(doc, imgH + capH + 16);
    const y = doc.y;
    let rowH = 0;
    pair.forEach((d, k) => {
      const x = M + k * (colW + gap);
      const drawn = annotatedImage(
        doc,
        d.image,
        [{ bbox: d.bbox, severity: d.severity, label: d.type }],
        colW,
        imgH,
        captions[k],
        { x, y },
      );
      if (drawn === false) {
        font(doc, "regular", 9, C.slate).text(`Снимок для «${d.type}» недоступен.`, x, y, { width: colW });
        rowH = Math.max(rowH, 20);
      } else rowH = Math.max(rowH, drawn);
    });
    doc.y = y + rowH + 4;
  }
}

function recommendationsSection(doc: Doc, p: ReportPayload) {
  const open = p.defects.filter((d) => d.status !== "resolved");
  heading(doc, "Рекомендации");
  if (open.length === 0) {
    paragraph(doc, "Открытых дефектов нет. Рекомендуется плановое обследование по графику.");
    return;
  }
  for (const d of open) {
    const line = `${d.type} (${d.location}${p.objects.length > 1 ? `, ${d.objectName}` : ""}): ${d.recommendation}`;
    font(doc, "regular", 9.5);
    const h = doc.heightOfString(line, { width: CONTENT_W - 18 });
    ensure(doc, h + 6);
    const y = doc.y;
    doc.circle(M + 4, y + 6, 3).fill(sevColor[d.severity]);
    font(doc, "regular", 9.5, C.graphite).text(line, M + 16, y, { width: CONTENT_W - 18, lineGap: 1.5 });
    doc.y = y + h + 5;
  }
  paragraph(doc, "Рекомендации сформированы системой и должны быть подтверждены инженерным заключением до планирования работ.", { size: 8.5, color: C.slate });
}

function methodologySection(doc: Doc, extra?: string) {
  heading(doc, "Методика и ограничения");
  paragraph(
    doc,
    `Индекс состояния (0–100) = базовая оценка конструктива по последнему обследованию − штрафы за открытые дефекты: критический −${SEVERITY_PENALTY.critical}, средний −${SEVERITY_PENALTY.medium}, низкий −${SEVERITY_PENALTY.low}. Устранённые дефекты не учитываются. Статус: индекс ниже ${STATUS_THRESHOLDS.critical} — критическое, ниже ${STATUS_THRESHOLDS.warning} — требует внимания, иначе — в норме.`,
  );
  if (extra) paragraph(doc, extra);
  paragraph(
    doc,
    "Ограничения: демонстрационная версия не содержит обученной модели компьютерного зрения; разметка снимков подготовлена вручную для демо-набора. Оценки уверенности и сроки ремонта носят иллюстративный характер. Координаты объектов условные. Отчёт не является заключением о техническом состоянии сооружения.",
  );
}

// ---- Report types -----------------------------------------------------------

function conditionReport(doc: Doc, p: ReportPayload) {
  const o = p.objects[0];
  if (!o) {
    paragraph(doc, "Объект не выбран.");
    return;
  }
  objectSection(doc, o);
  heading(doc, "Открытые дефекты по критичности");
  severityBars(doc, severityCounts(p));
  heading(doc, "Реестр дефектов объекта");
  paragraph(doc, `Всего в реестре: ${o.defects}, открытых: ${o.open}, критических открытых: ${o.critical}.`, { size: 9 });
  defectsTable(doc, p, false);
  photosSection(doc, p);
  recommendationsSection(doc, p);
  methodologySection(doc);
}

function inspectionReport(doc: Doc, p: ReportPayload) {
  const i = p.inspection;
  if (!i) {
    paragraph(doc, "Инспекция не найдена.");
    return;
  }
  heading(doc, "Сведения об инспекции");
  keyValues(doc, [
    ["Инспекция", i.title],
    ["Объект", i.objectName],
    ["Дата обследования", formatDate(i.date)],
    ["Источник данных", sourceLabels[i.source]],
    ["Оператор", i.operator],
    ["Статус", inspectionStatusLabels[i.status]],
    ["Снимков", String(i.materials.length)],
    ["Сохранено в реестр", `${i.savedDefects} дефектов`],
  ]);
  if (i.description) paragraph(doc, i.description);

  heading(doc, "Ход обработки");
  table(
    doc,
    [
      { header: "Этап", width: 200 },
      { header: "Время", width: CONTENT_W - 200 },
    ],
    i.statusLog.map((l) => [inspectionStatusLabels[l.status], formatDateTime(l.at)]),
  );

  const detections = i.materials.flatMap((m) => m.detections);
  heading(doc, "Результаты анализа");
  kpis(doc, [
    { label: "Снимков обработано", value: String(i.materials.filter((m) => m.state !== "pending").length) },
    { label: "С демо-разметкой", value: String(i.materials.filter((m) => m.state === "matched").length) },
    { label: "Областей повреждений", value: String(detections.length) },
    {
      label: "Критических",
      value: String(detections.filter((d) => d.severity === "critical").length),
      color: C.red,
    },
  ]);

  heading(doc, "Материалы и разметка");
  i.materials.slice(0, MAX_PDF_IMAGES).forEach((m, idx) => {
    font(doc, "semibold", 10);
    // Keep the caption with its image: reserve room for both.
    ensure(doc, 320);
    doc.text(`Снимок ${idx + 1}: ${m.name}`, M, doc.y, { width: CONTENT_W });
    doc.moveDown(0.3);
    const ok = annotatedImage(
      doc,
      m.url,
      m.detections.map((d: PdfDetection) => ({ bbox: d.bbox, severity: d.severity, label: d.type })),
      CONTENT_W * 0.7,
      260,
      m.state === "matched"
        ? `Демо-разметка: ${m.detections.length} обл.`
        : m.message || "Разметка не выполнялась",
    );
    if (!ok) paragraph(doc, "Изображение недоступно для отчёта.", { size: 9 });
    if (m.detections.length) {
      legend(
        doc,
        m.detections.map((d) => ({
          severity: d.severity,
          text: `${d.type} — ${severityLabels[d.severity].toLowerCase()}, ${d.location}`,
        })),
      );
    }
  });
  if (i.materials.length > MAX_PDF_IMAGES) {
    paragraph(doc, `В отчёт включены первые ${MAX_PDF_IMAGES} снимков из ${i.materials.length}.`, { size: 9 });
  }

  heading(doc, "Дефекты в реестре по итогам инспекции");
  defectsTable(doc, p, false);
  recommendationsSection(doc, p);
  methodologySection(doc);
}

function forecastReport(doc: Doc, p: ReportPayload) {
  heading(doc, "Сводка прогноза");
  const sorted = [...p.objects].sort((a, b) => a.forecastMonths - b.forecastMonths);
  paragraph(
    doc,
    `Объектов в выборке: ${p.objects.length}. Приоритет ремонта определяется оценочным сроком до рекомендованных работ, индексом состояния и числом открытых критических дефектов.`,
  );
  table(
    doc,
    [
      { header: "Приоритет", width: 56, align: "center" },
      { header: "Объект", width: 170 },
      { header: "Индекс", width: 50, align: "right" },
      { header: "Изм. за 5 мес.", width: 70, align: "right" },
      { header: "Крит.", width: 42, align: "right" },
      { header: "Ремонт через", width: CONTENT_W - 388, align: "right" },
    ],
    sorted.map((o, idx) => {
      const first = o.history[0]?.value ?? o.condition;
      const delta = o.condition - first;
      return [
        String(idx + 1),
        o.name,
        String(o.condition),
        `${delta > 0 ? "+" : ""}${delta}`,
        String(o.critical),
        `≈ ${o.forecastMonths} мес.`,
      ];
    }),
    sorted.map((o) => statusColor[o.status]),
  );

  heading(doc, "Динамика индекса по объектам");
  const months = p.objects[0]?.history.map((h) => h.month.slice(5, 7)) ?? [];
  const names = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const monthW = 46;
  table(
    doc,
    [
      { header: "Объект", width: CONTENT_W - monthW * (months.length + 1) },
      ...months.map((m) => ({ header: names[Number(m) - 1], width: monthW, align: "right" as const })),
      { header: "Сейчас", width: monthW, align: "right" },
    ],
    p.objects.map((o) => [o.name, ...o.history.map((h) => String(h.value)), String(o.condition)]),
  );

  heading(doc, "Комментарии по приоритетным объектам");
  for (const o of sorted.slice(0, 4)) {
    paragraph(
      doc,
      `${o.name}: индекс ${o.condition} (${statusLabels[o.status].toLowerCase()}), открытых дефектов ${o.open}, из них критических ${o.critical}. Рекомендуемый срок работ — около ${o.forecastMonths} мес.${o.critical > 0 ? " Требуется внеочередное инженерное обследование критических дефектов." : ""}`,
    );
  }
  methodologySection(
    doc,
    "Прогноз сроков ремонта — экспертная оценка демо-сценария на основе индекса состояния, его динамики и открытых критических дефектов. Верифицированная предиктивная модель в демонстрационной версии не используется.",
  );
}

function summaryReport(doc: Doc, p: ReportPayload) {
  const open = p.defects.filter((d) => d.status !== "resolved");
  const avg = Math.round(p.objects.reduce((s, o) => s + o.condition, 0) / Math.max(1, p.objects.length));
  heading(doc, "Общая картина");
  kpis(doc, [
    { label: "Объектов", value: String(p.objects.length) },
    { label: "Средний индекс", value: String(avg) },
    { label: "Открытых дефектов", value: String(open.length) },
    {
      label: "Критических открытых",
      value: String(open.filter((d) => d.severity === "critical").length),
      color: C.red,
    },
  ]);
  heading(doc, "Состояние объектов");
  const sorted = [...p.objects].sort((a, b) => a.condition - b.condition);
  table(
    doc,
    [
      { header: "Объект", width: 150 },
      { header: "Регион", width: 88 },
      { header: "Индекс", width: 42, align: "right" },
      { header: "Статус", width: 76 },
      { header: "Откр/крит", width: 54, align: "right" },
      { header: "Инспекция", width: CONTENT_W - 410 },
    ],
    sorted.map((o) => [
      o.name,
      o.region,
      String(o.condition),
      statusLabels[o.status],
      `${o.open}/${o.critical}`,
      o.lastInspection ? o.lastInspection.date.split("-").reverse().join(".") : "—",
    ]),
    sorted.map((o) => statusColor[o.status]),
  );
  heading(doc, "Открытые дефекты по критичности");
  severityBars(doc, severityCounts(p));
  heading(doc, "Критические дефекты");
  const crit: ReportPayload = { ...p, defects: open.filter((d) => d.severity === "critical") };
  defectsTable(doc, crit, true);
  recommendationsSection(doc, crit);
  methodologySection(doc);
}

// ---- Entry point ------------------------------------------------------------

export async function renderReport(p: ReportPayload): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: M,
    bufferPages: true,
    info: {
      Title: `${p.number} — ${p.title}`,
      Author: "SmartInspect (демо)",
      Subject: reportHeadings[p.type],
      Creator: "SmartInspect",
    },
  });
  const f = fonts();
  doc.registerFont("Inter-regular", f.regular);
  doc.registerFont("Inter-semibold", f.semibold);
  doc.registerFont("Inter-bold", f.bold);

  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  titlePage(doc, p);
  doc.addPage();
  doc.y = M;
  if (p.type === "Состояние") conditionReport(doc, p);
  else if (p.type === "Инспекция") inspectionReport(doc, p);
  else if (p.type === "Прогноз износа") forecastReport(doc, p);
  else summaryReport(doc, p);

  // Running header/footer on every page except the title page.
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const bottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    if (i > range.start) {
      font(doc, "regular", 8, C.slate).text(`SmartInspect · ${p.number}`, M, 22, {
        width: CONTENT_W / 2,
        lineBreak: false,
      });
      font(doc, "semibold", 8, C.amberText).text("ДЕМОНСТРАЦИОННЫЕ ДАННЫЕ", M + CONTENT_W / 2, 22, {
        width: CONTENT_W / 2,
        align: "right",
        lineBreak: false,
      });
    }
    font(doc, "regular", 8, C.slate).text(
      `Стр. ${i - range.start + 1} из ${range.count} · сформирован ${formatDateTime(p.generatedAt)}`,
      M,
      PAGE_H - 34,
      { width: CONTENT_W, align: "center", lineBreak: false },
    );
    doc.page.margins.bottom = bottom;
  }

  doc.end();
  return done;
}
