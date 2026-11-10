"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import {
  ACCEPT_ATTR,
  MAX_FILES_PER_INSPECTION,
  fetchSampleFile,
  toStoredPreview,
  validateFile,
} from "@/lib/analysis/client";
import { demoSamples } from "@/lib/analysis/demo-samples";
import { DEMO_AS_OF, formatBytes, sourceLabels, type InspectionSource } from "@/lib/dashboard";
import { useInitialQuery } from "@/lib/use-query-params";
import styles from "@/components/Dashboard.module.css";

interface Item {
  key: string;
  file: File;
  previewUrl: string;
  sampleId: string | null;
}

type Errors = Partial<Record<"title" | "objectId" | "date" | "operator" | "files", string>>;

const defaultOperator: Record<InspectionSource, string> = {
  drone: "БПЛА-бригада №1",
  mobile: "Мобильный комплекс А-1",
  sensor: "Сеть сенсоров SI-540",
};

let itemSeq = 0;
function nextItemKey(file: File) {
  itemSeq += 1;
  return `${itemSeq}-${file.name}-${file.size}`;
}

function newMaterialId(idx: number) {
  return `mat-${Date.now().toString(36)}-${idx}`;
}

function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function NewInspectionPage() {
  const router = useRouter();
  const { state, createInspection, processInspection } = useDemoData();
  const initial = useInitialQuery();

  const [objectId, setObjectId] = useState("");
  const [title, setTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);
  const [source, setSource] = useState<InspectionSource>("drone");
  const [date, setDate] = useState(DEMO_AS_OF);
  const [operator, setOperator] = useState(defaultOperator.drone);
  const [operatorTouched, setOperatorTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Free object URLs when leaving the page.
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.previewUrl)), []);

  const objectName = state.objects.find((o) => o.id === objectId)?.name ?? "";

  function chooseObject(id: string) {
    setObjectId(id);
    setErrors((e) => ({ ...e, objectId: undefined }));
    if (!titleTouched) {
      const name = state.objects.find((o) => o.id === id)?.name;
      setTitle(name ? `Обследование — ${name}` : "");
    }
  }

  useEffect(() => {
    const obj = initial?.get("object");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from ?object=
    if (obj && state.objects.some((o) => o.id === obj)) chooseObject(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when the URL is read
  }, [initial]);

  function chooseSource(next: InspectionSource) {
    setSource(next);
    if (!operatorTouched) setOperator(defaultOperator[next]);
  }

  function addFiles(files: File[], sampleId: string | null = null) {
    const problems: string[] = [];
    const accepted: Item[] = [];
    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        problems.push(err);
        continue;
      }
      if (items.length + accepted.length >= MAX_FILES_PER_INSPECTION) {
        problems.push(`Не больше ${MAX_FILES_PER_INSPECTION} снимков в одной инспекции`);
        break;
      }
      accepted.push({
        key: nextItemKey(file),
        file,
        previewUrl: URL.createObjectURL(file),
        sampleId,
      });
    }
    setFileErrors(problems);
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      setErrors((e) => ({ ...e, files: undefined }));
    }
  }

  function removeItem(key: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.key === key);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.key !== key);
    });
  }

  async function addSample(id: string) {
    const sample = demoSamples.find((s) => s.id === id);
    if (!sample) return;
    setLoadingSample(id);
    try {
      const file = await fetchSampleFile(sample.url, `${sample.id}.jpg`);
      addFiles([file], sample.id);
      if (!objectId) chooseObject(sample.suggestedObjectId);
    } catch (err) {
      setFileErrors([err instanceof Error ? err.message : "Не удалось загрузить снимок"]);
    } finally {
      setLoadingSample(null);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!title.trim()) next.title = "Укажите название инспекции";
    if (!objectId) next.objectId = "Выберите объект";
    if (!date) next.date = "Укажите дату обследования";
    else if (date > today()) next.date = "Дата не может быть в будущем";
    if (!operator.trim()) next.operator = "Укажите оператора или бригаду";
    if (items.length === 0) next.files = "Загрузите хотя бы один снимок";
    return next;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const materials = await Promise.all(
        items.map(async (item, idx) => {
          const sample = demoSamples.find((s) => s.id === item.sampleId);
          return {
            id: newMaterialId(idx),
            name: item.file.name,
            sizeBytes: item.file.size,
            url: sample ? sample.url : await toStoredPreview(item.file),
          };
        }),
      );
      const id = createInspection({
        title: title.trim(),
        objectId,
        date,
        source,
        operator: operator.trim(),
        description: description.trim(),
        materials,
      });
      const files = items.map((i) => i.file);
      router.push(`/dashboard/inspections/${id}`);
      void processInspection(id, files);
    } catch (err) {
      setFileErrors([err instanceof Error ? err.message : "Не удалось подготовить снимки"]);
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link href="/dashboard/inspections" className={styles.pill} style={{ marginBottom: 16 }}>
        <Icon name="arrowLeft" size={16} /> Все инспекции
      </Link>

      <div className={styles.pageHead}>
        <h2 className={styles.pageTitle}>Новая инспекция</h2>
        <p className={styles.pageSubtitle}>
          Заполните данные обследования и загрузите снимки. После создания снимки будут переданы
          модулю анализа.
        </p>
      </div>

      <form onSubmit={submit} noValidate className={styles.split}>
        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Данные обследования</h3>
            </div>
            <div className={styles.formGrid}>
              <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <span>Название инспекции *</span>
                <input
                  type="text"
                  value={title}
                  maxLength={140}
                  placeholder="Например: Обследование пролётов после паводка"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setTitleTouched(true);
                    setErrors((er) => ({ ...er, title: undefined }));
                  }}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <span className={styles.hint}>{errors.title}</span>}
              </label>
              <label className={styles.field}>
                <span>Объект *</span>
                <select
                  value={objectId}
                  onChange={(e) => chooseObject(e.target.value)}
                  aria-invalid={!!errors.objectId}
                >
                  <option value="">Выберите объект</option>
                  {state.objects.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
                {errors.objectId && <span className={styles.hint}>{errors.objectId}</span>}
              </label>
              <label className={styles.field}>
                <span>Источник данных *</span>
                <select
                  value={source}
                  onChange={(e) => chooseSource(e.target.value as InspectionSource)}
                >
                  {(Object.keys(sourceLabels) as InspectionSource[]).map((s) => (
                    <option key={s} value={s}>
                      {sourceLabels[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>Дата обследования *</span>
                <input
                  type="date"
                  value={date}
                  max={today()}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setErrors((er) => ({ ...er, date: undefined }));
                  }}
                  aria-invalid={!!errors.date}
                />
                {errors.date && <span className={styles.hint}>{errors.date}</span>}
              </label>
              <label className={styles.field}>
                <span>Оператор / бригада *</span>
                <input
                  type="text"
                  value={operator}
                  maxLength={80}
                  onChange={(e) => {
                    setOperator(e.target.value);
                    setOperatorTouched(true);
                    setErrors((er) => ({ ...er, operator: undefined }));
                  }}
                  aria-invalid={!!errors.operator}
                />
                {errors.operator && <span className={styles.hint}>{errors.operator}</span>}
              </label>
              <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <span>Описание</span>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  maxLength={1000}
                  value={description}
                  placeholder="Цель обследования, погодные условия, особенности участка"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Материалы *</h3>
              <span className={styles.pill}>
                {items.length} из {MAX_FILES_PER_INSPECTION}
              </span>
            </div>

            <div
              className={`${styles.dropzone} ${dragOver ? styles.dropzoneActive : ""} ${errors.files ? styles.dropzoneError : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <Icon name="download" size={24} style={{ transform: "rotate(180deg)" }} />
              <p>
                Перетащите снимки сюда или{" "}
                <button type="button" className={styles.linkButtonAccent} onClick={() => fileInput.current?.click()}>
                  выберите файлы
                </button>
              </p>
              <span className={styles.fieldNote}>JPG, JPEG или PNG, до 10 МБ каждый</span>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPT_ATTR}
                multiple
                hidden
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []));
                  e.target.value = "";
                }}
              />
            </div>

            {errors.files && <p className={styles.hint} style={{ marginTop: 8 }}>{errors.files}</p>}
            {fileErrors.length > 0 && (
              <ul className={styles.formError} role="alert" style={{ listStyle: "none" }}>
                {fileErrors.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className={styles.uploadGrid}>
                {items.map((item) => (
                  <div key={item.key} className={styles.uploadItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.previewUrl} alt={item.file.name} />
                    <div className={styles.uploadMeta}>
                      <span className={styles.uploadName} title={item.file.name}>
                        {item.file.name}
                      </span>
                      <span className={styles.cellMuted}>
                        {formatBytes(item.file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.uploadRemove}
                      onClick={() => removeItem(item.key)}
                      aria-label={`Удалить ${item.file.name}`}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.stackGap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Набор снимков</h3>
            </div>
            <p className={styles.fieldNote} style={{ marginBottom: 12 }}>
              Для этих снимков разметка подготовлена заранее; для других изображений модуль
              сообщит, что разметки нет.
            </p>
            {(["photo", "video"] as const).map((kind) => (
              <div key={kind} style={{ marginTop: kind === "video" ? 16 : 0 }}>
                <p className={styles.sampleGroupTitle}>
                  {kind === "photo" ? "Фотоснимки" : "Кадры видео облёта А-121 (38 с)"}
                </p>
                <div className={styles.sampleGrid}>
                  {demoSamples
                    .filter((s) => (s.kind ?? "photo") === kind)
                    .map((s) => {
                      const added = items.some((i) => i.sampleId === s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          className={`${styles.sampleItem} ${added ? styles.sampleAdded : ""}`}
                          onClick={() => addSample(s.id)}
                          disabled={added || loadingSample !== null}
                          title={s.title}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.url} alt="" loading="lazy" />
                          <span>
                            {loadingSample === s.id
                              ? "Загрузка…"
                              : added
                                ? "Добавлен"
                                : s.videoTime
                                  ? `Кадр ${s.videoTime}`
                                  : s.title}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Итог</h3>
            </div>
            <dl className={styles.calcList}>
              <div>
                <dt>Объект</dt>
                <dd style={{ textAlign: "right" }}>{objectName || "—"}</dd>
              </div>
              <div>
                <dt>Источник</dt>
                <dd>{sourceLabels[source]}</dd>
              </div>
              <div>
                <dt>Снимков</dt>
                <dd>{items.length}</dd>
              </div>
            </dl>
            <button
              type="submit"
              className="btnPrimary"
              style={{ width: "100%", justifyContent: "center", marginTop: 20 }}
              disabled={submitting}
            >
              {submitting ? "Создание…" : "Создать и запустить анализ"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
