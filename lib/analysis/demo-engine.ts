// Server-side only: imported by app/api/analysis/route.ts.
import { createHash } from "crypto";
import { demoSamples } from "@/lib/analysis/demo-samples";
import type { AnalysisEngine, AnalysisInput, AnalysisResult } from "@/lib/analysis/types";

/**
 * Demo analysis engine: NOT a computer-vision model. It recognises the
 * prepared sample files by hash and returns their hand-made annotations.
 * Any other image is reported as unsupported — it never invents defects.
 */
export const demoEngine: AnalysisEngine = {
  info: {
    id: "demo-annotations",
    version: "1.0",
    kind: "demo",
    title: "Модуль разметки повреждений",
  },

  async analyze(input: AnalysisInput): Promise<AnalysisResult> {
    const sha256 = createHash("sha256").update(input.bytes).digest("hex");
    const sample = demoSamples.find((s) => s.sha256 === sha256);
    const processedAt = new Date().toISOString();

    if (!sample) {
      return {
        engine: this.info,
        matched: false,
        sampleId: null,
        detections: [],
        message:
          "Для этого снимка разметка повреждений не выполнялась.",
        processedAt,
      };
    }

    const n = sample.detections.length;
    return {
      engine: this.info,
      matched: true,
      sampleId: sample.id,
      detections: sample.detections,
      message: `Разметка: ${n} ${n === 1 ? "область" : n < 5 ? "области" : "областей"} повреждений.`,
      processedAt,
    };
  },
};
