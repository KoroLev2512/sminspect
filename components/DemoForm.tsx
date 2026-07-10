"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/auth";
import styles from "./DemoForm.module.css";

const segments = [
  "Муниципалитет / госорган",
  "Дорожно-строительная компания",
  "Логистика / транспорт",
  "Страхование",
  "Другое",
];

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  segment: string;
  message: string;
}

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  segment: segments[0],
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Укажите имя";
  if (!f.email.trim()) e.email = "Укажите эл. почту";
  else if (!isValidEmail(f.email.trim())) e.email = "Некорректный адрес почты";
  if (!f.company.trim()) e.company = "Укажите компанию";
  if (!f.segment.trim()) e.segment = "Выберите сегмент";
  return e;
}

export function DemoForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function change<K extends keyof FormState>(key: K, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setErrors(validate(next));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);

    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Не удалось отправить заявку");
      }

      setStatus("success");
      setForm(initial);
      setErrors({});
      setSubmitted(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <h3 className={styles.successTitle}>Заявка отправлена</h3>
        <p className={styles.successDesc}>
          Мы свяжемся с вами в течение 1–2 рабочих дней для согласования демонстрации
          платформы.
        </p>
        <button
          type="button"
          className="btnPrimary"
          onClick={() => setStatus("idle")}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Имя <i className={styles.req}>*</i></span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            placeholder="Иван Иванов"
            aria-invalid={!!errors.name}
          />
          {errors.name && <small className={styles.hint}>{errors.name}</small>}
        </label>
        <label className={styles.field}>
          <span>Почта <i className={styles.req}>*</i></span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => change("email", e.target.value)}
            placeholder="ivan@company.ru"
            aria-invalid={!!errors.email}
          />
          {errors.email && <small className={styles.hint}>{errors.email}</small>}
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Компания <i className={styles.req}>*</i></span>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => change("company", e.target.value)}
            placeholder="ООО «ДорСтрой»"
            aria-invalid={!!errors.company}
          />
          {errors.company && <small className={styles.hint}>{errors.company}</small>}
        </label>
        <label className={styles.field}>
          <span>Должность</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => change("role", e.target.value)}
            placeholder="Технический директор"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Сегмент <i className={styles.req}>*</i></span>
        <select
          required
          value={form.segment}
          onChange={(e) => change("segment", e.target.value)}
          aria-invalid={!!errors.segment}
        >
          {segments.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.segment && <small className={styles.hint}>{errors.segment}</small>}
      </label>

      <label className={styles.field}>
        <span>Сообщение</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => change("message", e.target.value)}
          placeholder="Расскажите о масштабе инфраструктуры и задачах мониторинга"
        />
      </label>

      {status === "error" && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btnPrimary" disabled={status === "loading"}>
        {status === "loading" ? "Отправка…" : "Запросить демо"}
      </button>

      <p className={styles.consent}>
        Отправляя форму, вы соглашаетесь с{" "}
        <Link href="/privacy">политикой обработки персональных данных</Link>.
      </p>
    </form>
  );
}
