"use client";

import { useState, type FormEvent } from "react";
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

export function DemoForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
          <span>Имя *</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Иван Иванов"
          />
        </label>
        <label className={styles.field}>
          <span>Email *</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="ivan@company.ru"
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Компания *</span>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="ООО «ДорСтрой»"
          />
        </label>
        <label className={styles.field}>
          <span>Должность</span>
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="Технический директор"
          />
        </label>
      </div>

      <label className={styles.field}>
        <span>Сегмент *</span>
        <select
          required
          value={form.segment}
          onChange={(e) => setForm({ ...form, segment: e.target.value })}
        >
          {segments.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span>Сообщение</span>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Расскажите о масштабе инфраструктуры и задачах мониторинга"
        />
      </label>

      {status === "error" && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btnPrimary" disabled={status === "loading"}>
        {status === "loading" ? "Отправка…" : "Запросить демо →"}
      </button>
    </form>
  );
}
