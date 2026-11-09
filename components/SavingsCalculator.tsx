"use client";

import { useState } from "react";
import styles from "@/components/Dashboard.module.css";

// Scenario calculator. All default values are illustrative assumptions for
// the demo, not measured results; the formulas are shown next to the output.

interface Inputs {
  km: number;
  manualCost: number;
  autoCost: number;
  perYear: number;
  setup: number;
  years: number;
}

const defaults: Inputs = {
  km: 500,
  manualCost: 12000,
  autoCost: 4500,
  perYear: 4,
  setup: 1500000,
  years: 3,
};

const rub = (n: number) =>
  `${Math.round(n).toLocaleString("ru-RU").replace(/ /g, " ")} ₽`;

const fields: { key: keyof Inputs; label: string; unit: string; step: number; max: number }[] = [
  { key: "km", label: "Протяжённость обследования", unit: "км", step: 10, max: 100000 },
  { key: "manualCost", label: "Традиционное обследование", unit: "₽/км", step: 500, max: 1000000 },
  { key: "autoCost", label: "Обследование со SmartInspect", unit: "₽/км", step: 500, max: 1000000 },
  { key: "perYear", label: "Периодичность", unit: "раз в год", step: 1, max: 52 },
  { key: "setup", label: "Затраты на внедрение (разово)", unit: "₽", step: 100000, max: 1e10 },
  { key: "years", label: "Горизонт расчёта", unit: "лет", step: 1, max: 10 },
];

export function SavingsCalculator() {
  const [v, setV] = useState<Inputs>(defaults);

  const manualYear = v.km * v.manualCost * v.perYear;
  const autoYear = v.km * v.autoCost * v.perYear;
  const savingYear = manualYear - autoYear;
  const relative = manualYear > 0 ? (savingYear / manualYear) * 100 : 0;
  const net = savingYear * v.years - v.setup;
  const roi = v.setup > 0 ? (net / v.setup) * 100 : null;
  const payback = savingYear > 0 ? (v.setup / savingYear) * 12 : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Калькулятор экономического эффекта</h3>
        <span className={styles.demoTag}>Сценарий</span>
      </div>
      <p className={styles.fieldNote} style={{ marginBottom: 16 }}>
        Значения по умолчанию — условные допущения для демонстрации, а не подтверждённые результаты.
        Подставьте свои тарифы и объёмы.
      </p>
      <div className={styles.calcGrid}>
        <div className={styles.formGrid}>
          {fields.map((f) => (
            <label key={f.key} className={styles.field}>
              <span>
                {f.label}, {f.unit}
              </span>
              <input
                type="number"
                min={0}
                max={f.max}
                step={f.step}
                value={v[f.key]}
                onChange={(e) => {
                  const n = Math.min(f.max, Math.max(0, Number(e.target.value) || 0));
                  setV((prev) => ({ ...prev, [f.key]: n }));
                }}
              />
            </label>
          ))}
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => setV(defaults)}
            style={{ justifySelf: "start" }}
          >
            Вернуть допущения
          </button>
        </div>

        <div>
          <dl className={styles.calcList}>
            <div>
              <dt>Традиционный подход в год</dt>
              <dd>{rub(manualYear)}</dd>
            </div>
            <div>
              <dt>Со SmartInspect в год</dt>
              <dd>{rub(autoYear)}</dd>
            </div>
            <div className={styles.calcTotal}>
              <dt>Экономия в год</dt>
              <dd style={{ color: savingYear >= 0 ? "#1e874b" : "#c0392b" }}>
                {rub(savingYear)} ({relative.toFixed(0)}%)
              </dd>
            </div>
            <div>
              <dt>Чистый эффект за {v.years} г. с учётом внедрения</dt>
              <dd>{rub(net)}</dd>
            </div>
            <div>
              <dt>ROI за горизонт</dt>
              <dd>{roi === null ? "—" : `${roi.toFixed(0)}%`}</dd>
            </div>
            <div>
              <dt>Окупаемость внедрения</dt>
              <dd>{payback === null ? "не окупается" : `${payback.toFixed(1).replace(".", ",")} мес.`}</dd>
            </div>
          </dl>
          <div className={styles.formula}>
            <p>Стоимость в год = км × тариф × периодичность</p>
            <p>Экономия = традиционная − со SmartInspect; % — от традиционной</p>
            <p>Чистый эффект = экономия × лет − внедрение; ROI = чистый эффект / внедрение</p>
            <p>Окупаемость = внедрение / годовая экономия × 12</p>
          </div>
        </div>
      </div>
    </div>
  );
}
