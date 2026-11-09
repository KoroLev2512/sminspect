"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  type Alert,
  type Defect,
  type DefectStatus,
  type DemoState,
  type Inspection,
  type InspectionStatus,
  type MaterialAnalysis,
  type ReportItem,
} from "@/lib/dashboard";
import { analyzeFile } from "@/lib/analysis/client";
import { demoSamples } from "@/lib/analysis/demo-samples";
import { DEMO_SEED_VERSION, createSeed } from "@/lib/demo/seed";

// Client-side demo store. The whole dashboard reads one DemoState, persisted
// in localStorage so changes survive reloads, and resettable to the
// deterministic seed for repeatable demos.

const STORAGE_KEY = "smartinspect.demo";

export type NewInspection = Pick<
  Inspection,
  "title" | "objectId" | "date" | "source" | "operator" | "description"
> & { materials: Inspection["materials"] };

export interface ProcessingProgress {
  done: number;
  total: number;
  currentName: string;
}

interface DemoDataValue {
  state: DemoState;
  /** Live progress of inspections being analysed in this tab. */
  processing: Record<string, ProcessingProgress>;
  /**
   * Runs the analysis of the inspection's materials. `files` must be in the
   * same order as inspection.materials.
   */
  processInspection: (inspectionId: string, files: File[]) => Promise<void>;
  /** True once the persisted state has been read on the client. */
  hydrated: boolean;
  storageError: string;
  setDefectStatus: (id: string, status: DefectStatus) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
  createInspection: (input: NewInspection) => string;
  updateInspection: (id: string, update: (i: Inspection) => Inspection) => void;
  setInspectionStatus: (id: string, status: InspectionStatus) => void;
  /** Turns the inspection's detections into registry defects; returns their ids. */
  saveInspectionDefects: (inspectionId: string) => string[];
  addReport: (report: ReportItem) => void;
  updateReport: (id: string, patch: Partial<ReportItem>) => void;
  resetDemo: () => void;
}

const DemoDataContext = createContext<DemoDataValue | null>(null);

function nowIso() {
  // Local wall-clock time without timezone suffix, like the seed timestamps.
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function nextId(prefix: string, ids: string[]) {
  const max = ids.reduce((m, id) => {
    const n = Number(id.slice(prefix.length + 1));
    return Number.isFinite(n) && n > m ? n : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}

function readStored(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoState;
    return parsed.version === DEMO_SEED_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(createSeed);
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [processing, setProcessing] = useState<Record<string, ProcessingProgress>>({});
  const runningRef = useRef(new Set<string>());
  // Latest state for actions that must read it synchronously (id generation).
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      // Uploaded files live only in memory: a processing run cannot survive a
      // reload, so interrupted inspections are marked as failed explicitly.
      const at = nowIso();
      stored.inspections = stored.inspections.map((i) =>
        i.status === "queued" || i.status === "processing"
          ? {
              ...i,
              status: "failed",
              failureReason:
                "Обработка прервана: страница была перезагружена до завершения анализа. Создайте инспекцию заново и загрузите снимки.",
              statusLog: [...i.statusLog, { status: "failed", at }],
            }
          : i,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage
      setState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reporting the result of persisting to localStorage */
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError("");
    } catch {
      setStorageError(
        "Хранилище браузера переполнено: последние изменения не сохранятся после перезагрузки. Сбросьте демо или удалите лишние снимки.",
      );
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [state, hydrated]);

  const setDefectStatus = useCallback((id: string, status: DefectStatus) => {
    setState((s) => ({
      ...s,
      defects: s.defects.map((d) =>
        d.id === id && d.status !== status
          ? { ...d, status, history: [...d.history, { status, at: nowIso() }] }
          : d,
      ),
    }));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
    }));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setState((s) => ({ ...s, alerts: s.alerts.map((a) => ({ ...a, read: true })) }));
  }, []);

  const createInspection = useCallback((input: NewInspection) => {
    const id = nextId(
      "insp",
      stateRef.current.inspections.map((i) => i.id),
    );
    const at = nowIso();
    const inspection: Inspection = {
      id,
      ...input,
      coverage: `${input.materials.length} ${input.materials.length === 1 ? "снимок" : "снимков"}`,
      status: "created",
      createdAt: at,
      statusLog: [{ status: "created", at }],
      savedDefectIds: [],
    };
    setState((s) => ({ ...s, inspections: [inspection, ...s.inspections] }));
    return id;
  }, []);

  const updateInspection = useCallback(
    (id: string, update: (i: Inspection) => Inspection) => {
      setState((s) => ({
        ...s,
        inspections: s.inspections.map((i) => (i.id === id ? update(i) : i)),
      }));
    },
    [],
  );

  const setInspectionStatus = useCallback((id: string, status: InspectionStatus) => {
    setState((s) => ({
      ...s,
      inspections: s.inspections.map((i) =>
        i.id === id && i.status !== status
          ? { ...i, status, statusLog: [...i.statusLog, { status, at: nowIso() }] }
          : i,
      ),
    }));
  }, []);

  const saveInspectionDefects = useCallback((inspectionId: string) => {
    const s = stateRef.current;
    const inspection = s.inspections.find((i) => i.id === inspectionId);
    if (!inspection || inspection.savedDefectIds.length > 0) return [];

    const at = nowIso();
    const defectIds: string[] = [];
    const newDefects: Defect[] = [];
    const newAlerts: Alert[] = [];
    let defectSeq = s.defects.map((d) => d.id);
    let alertSeq = s.alerts.map((a) => a.id);

    for (const material of inspection.materials) {
      if (material.analysis?.state !== "matched") continue;
      for (const det of material.analysis.detections) {
        const id = nextId("def", defectSeq);
        defectSeq = [...defectSeq, id];
        defectIds.push(id);
        newDefects.push({
          id,
          objectId: inspection.objectId,
          inspectionId,
          type: det.type,
          severity: det.severity,
          status: "new",
          detectedAt: inspection.date,
          location: det.location,
          confidence: det.confidence,
          source: inspection.source,
          recommendation: det.recommendation,
          image: material.url,
          bbox: det.bbox,
          history: [{ status: "new", at }],
        });
        if (det.severity === "critical") {
          const alertId = nextId("al", alertSeq);
          alertSeq = [...alertSeq, alertId];
          const objectName = s.objects.find((o) => o.id === inspection.objectId)?.name ?? "";
          newAlerts.push({
            id: alertId,
            objectId: inspection.objectId,
            defectId: id,
            message: `${det.type}: ${det.location.toLowerCase()} — ${objectName}`,
            severity: "critical",
            createdAt: at,
            read: false,
          });
        }
      }
    }

    setState((prev) => ({
      ...prev,
      defects: [...newDefects, ...prev.defects],
      alerts: [...newAlerts, ...prev.alerts],
      inspections: prev.inspections.map((i) =>
        i.id === inspectionId ? { ...i, savedDefectIds: defectIds } : i,
      ),
    }));
    return defectIds;
  }, []);

  const processInspection = useCallback(
    async (inspectionId: string, files: File[]) => {
      if (runningRef.current.has(inspectionId)) return;
      runningRef.current.add(inspectionId);
      const pause = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

      setInspectionStatus(inspectionId, "queued");
      setProcessing((p) => ({
        ...p,
        [inspectionId]: { done: 0, total: files.length, currentName: "" },
      }));
      await pause(900);
      setInspectionStatus(inspectionId, "processing");

      let failures = 0;
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        setProcessing((p) => ({
          ...p,
          [inspectionId]: { done: idx, total: files.length, currentName: file.name },
        }));
        let analysis: MaterialAnalysis;
        let sampleUrl: string | null = null;
        const started = Date.now();
        try {
          const result = await analyzeFile(file);
          analysis = {
            state: result.matched ? "matched" : "unsupported",
            engine: result.engine.id,
            detections: result.detections,
            message: result.message,
          };
          sampleUrl = demoSamples.find((x) => x.id === result.sampleId)?.url ?? null;
        } catch (err) {
          failures += 1;
          analysis = {
            state: "error",
            engine: "demo-annotations",
            detections: [],
            message: err instanceof Error ? err.message : "Сбой анализа",
          };
        }
        // Keep each step visible for the demo, without faking extra work.
        const elapsed = Date.now() - started;
        if (elapsed < 1400) await pause(1400 - elapsed);
        updateInspection(inspectionId, (i) => ({
          ...i,
          materials: i.materials.map((m, mi) =>
            mi === idx ? { ...m, analysis, url: sampleUrl ?? m.url } : m,
          ),
        }));
      }

      setProcessing((p) => {
        const next = { ...p };
        delete next[inspectionId];
        return next;
      });
      runningRef.current.delete(inspectionId);

      if (failures === files.length && files.length > 0) {
        updateInspection(inspectionId, (i) => ({
          ...i,
          failureReason: "Ни один снимок не удалось обработать: сервис анализа вернул ошибку.",
        }));
        setInspectionStatus(inspectionId, "failed");
      } else {
        setInspectionStatus(inspectionId, "completed");
      }
    },
    [setInspectionStatus, updateInspection],
  );

  const addReport = useCallback((report: ReportItem) => {
    setState((s) => ({ ...s, reports: [report, ...s.reports] }));
  }, []);

  const updateReport = useCallback((id: string, patch: Partial<ReportItem>) => {
    setState((s) => ({
      ...s,
      reports: s.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setState(createSeed());
  }, []);

  const value = useMemo<DemoDataValue>(
    () => ({
      state,
      processing,
      processInspection,
      hydrated,
      storageError,
      setDefectStatus,
      markAlertRead,
      markAllAlertsRead,
      createInspection,
      updateInspection,
      setInspectionStatus,
      saveInspectionDefects,
      addReport,
      updateReport,
      resetDemo,
    }),
    [
      state,
      processing,
      processInspection,
      hydrated,
      storageError,
      setDefectStatus,
      markAlertRead,
      markAllAlertsRead,
      createInspection,
      updateInspection,
      setInspectionStatus,
      saveInspectionDefects,
      addReport,
      updateReport,
      resetDemo,
    ],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error("useDemoData должен использоваться внутри DemoDataProvider");
  return ctx;
}
