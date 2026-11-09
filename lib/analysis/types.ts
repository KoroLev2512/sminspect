// Contract between the UI and the image analysis service. The demo engine
// (lib/analysis/demo-engine.ts) implements it with pre-annotated samples; a
// real computer-vision model can replace it without touching the UI, as long
// as it returns the same AnalysisResult shape.

import type { Detection } from "@/lib/dashboard";

export interface EngineInfo {
  id: string;
  version: string;
  /** "demo" — заранее подготовленная разметка; "model" — инференс обученной модели */
  kind: "demo" | "model";
  title: string;
}

export interface AnalysisInput {
  fileName: string;
  mimeType: "image/jpeg" | "image/png";
  bytes: Uint8Array;
}

export interface AnalysisResult {
  engine: EngineInfo;
  /** For the demo engine: the file is one of the prepared samples. */
  matched: boolean;
  sampleId: string | null;
  detections: Detection[];
  /** Human-readable summary shown in the UI. */
  message: string;
  processedAt: string;
}

export interface AnalysisEngine {
  readonly info: EngineInfo;
  analyze(input: AnalysisInput): Promise<AnalysisResult>;
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png"] as const;
