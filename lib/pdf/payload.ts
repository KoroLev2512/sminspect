// Builds the PDF payload from the client-side demo state.

import {
  DEMO_AS_OF,
  getInspection,
  getObjectName,
  objectMetrics,
  type DemoState,
  type ReportItem,
} from "@/lib/dashboard";
import type { PdfObject, ReportPayload } from "@/lib/pdf/types";

const severityRank = { critical: 0, medium: 1, low: 2 } as const;

export function buildReportPayload(state: DemoState, report: ReportItem): ReportPayload {
  const inspection = report.inspectionId ? getInspection(state, report.inspectionId) : null;
  const focusObjectId = report.objectId ?? inspection?.objectId ?? null;
  const scope = state.objects.filter((o) => {
    if (report.type === "Сводный") return true;
    if (report.type === "Прогноз износа") return focusObjectId ? o.id === focusObjectId : true;
    return o.id === focusObjectId;
  });

  const objects: PdfObject[] = scope.map((o) => {
    const m = objectMetrics(state, o.id);
    return {
      id: o.id,
      name: o.name,
      type: o.type,
      region: o.region,
      length: o.length,
      baseScore: o.baseScore,
      condition: m.condition,
      status: m.status,
      defects: m.defects,
      open: m.open,
      critical: m.critical,
      forecastMonths: o.forecastMonths,
      lastInspection: m.lastInspection
        ? {
            date: m.lastInspection.date,
            source: m.lastInspection.source,
            operator: m.lastInspection.operator,
            title: m.lastInspection.title,
          }
        : null,
      history: o.conditionHistory,
    };
  });

  const scopeIds = new Set(scope.map((o) => o.id));
  const defects = state.defects
    .filter((d) =>
      report.type === "Инспекция" && inspection
        ? d.inspectionId === inspection.id
        : scopeIds.has(d.objectId),
    )
    .sort(
      (a, b) =>
        Number(a.status === "resolved") - Number(b.status === "resolved") ||
        severityRank[a.severity] - severityRank[b.severity],
    )
    .map((d) => ({
      id: d.id,
      objectId: d.objectId,
      objectName: getObjectName(state, d.objectId),
      type: d.type,
      severity: d.severity,
      status: d.status,
      detectedAt: d.detectedAt,
      location: d.location,
      recommendation: d.recommendation,
      image: d.image,
      bbox: d.bbox,
    }));

  return {
    type: report.type,
    number: report.number,
    title: report.title,
    period: report.period,
    generatedAt: report.createdAt,
    asOf: DEMO_AS_OF,
    objects,
    defects,
    inspection:
      report.type === "Инспекция" && inspection
        ? {
            id: inspection.id,
            title: inspection.title,
            objectName: getObjectName(state, inspection.objectId),
            date: inspection.date,
            source: inspection.source,
            operator: inspection.operator,
            description: inspection.description,
            status: inspection.status,
            statusLog: inspection.statusLog,
            savedDefects: inspection.savedDefectIds.length,
            materials: inspection.materials.map((m) => ({
              name: m.name,
              url: m.url,
              state: m.analysis?.state ?? "pending",
              message: m.analysis?.message ?? "",
              detections: (m.analysis?.state === "matched" ? m.analysis.detections : []).map(
                (d) => ({ type: d.type, severity: d.severity, bbox: d.bbox, location: d.location }),
              ),
            })),
          }
        : null,
  };
}
