// Data sent from the browser (which owns the demo state) to the PDF API.

import type {
  BBox,
  DefectStatus,
  InspectionSource,
  InspectionStatus,
  ObjectStatus,
  ObjectType,
  ReportType,
  Severity,
} from "@/lib/dashboard";

export interface PdfDetection {
  type: string;
  severity: Severity;
  bbox: BBox;
  location: string;
}

export interface PdfObject {
  id: string;
  name: string;
  type: ObjectType;
  region: string;
  length: string;
  baseScore: number;
  condition: number;
  status: ObjectStatus;
  defects: number;
  open: number;
  critical: number;
  forecastMonths: number;
  lastInspection: { date: string; source: InspectionSource; operator: string; title: string } | null;
  history: { month: string; value: number }[];
}

export interface PdfDefect {
  id: string;
  objectId: string;
  objectName: string;
  type: string;
  severity: Severity;
  status: DefectStatus;
  detectedAt: string;
  location: string;
  recommendation: string;
  image: string;
  bbox: BBox;
}

export interface PdfInspection {
  id: string;
  title: string;
  objectName: string;
  date: string;
  source: InspectionSource;
  operator: string;
  description: string;
  status: InspectionStatus;
  statusLog: { status: InspectionStatus; at: string }[];
  materials: {
    name: string;
    url: string;
    state: "matched" | "unsupported" | "error" | "pending";
    message: string;
    detections: PdfDetection[];
  }[];
  savedDefects: number;
}

export interface ReportPayload {
  type: ReportType;
  number: string;
  title: string;
  period: string;
  generatedAt: string;
  asOf: string;
  /** Objects in scope: one for «Состояние», several for summary/forecast. */
  objects: PdfObject[];
  defects: PdfDefect[];
  inspection: PdfInspection | null;
}

export const MAX_PDF_IMAGES = 8;
