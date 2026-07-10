"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";
import { Icon } from "./dash-icons";
import { DEMO_CREDENTIALS, isValidEmail, segments } from "@/lib/auth";
import styles from "./Auth.module.css";

type FieldErrors = { name?: string; email?: string; password?: string };

const features = [
  "Автоматический анализ снимков с дронов, камер и сенсоров",
  "Интерактивная карта состояния дорог и мостов",
  "Прогноз износа и оповещения о критических дефектах",
];

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const { user, status, login, register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: mode === "login" ? DEMO_CREDENTIALS.email : "",
    password: mode === "login" ? DEMO_CREDENTIALS.password : "",
    company: "",
    role: "",
    segment: segments[0],
  });

  useEffect(() => {
    if (status === "ready" && user) router.replace("/dashboard");
  }, [status, user, router]);

  function validate(f: typeof form): FieldErrors {
    const e: FieldErrors = {};
    if (mode === "register" && !f.name.trim()) e.name = "Укажите имя и фамилию";
    if (!f.email.trim()) e.email = "Укажите эл. почту";
    else if (!isValidEmail(f.email.trim())) e.email = "Некорректный адрес почты";
    if (!f.password) e.password = "Введите пароль";
    else if (mode === "register" && f.password.length < 6)
      e.password = "Пароль должен быть не короче 6 символов";
    return e;
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    const next = { ...form, [key]: value };
    setForm(next);
    if (submitted) setFieldErrors(validate(next));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitted(true);

    const found = validate(form);
    setFieldErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);

    const result =
      mode === "login"
        ? login(form.email, form.password)
        : register({
            name: form.name,
            email: form.email,
            password: form.password,
            company: form.company,
            role: form.role,
            segment: form.segment,
          });

    if (result.ok) {
      router.push("/dashboard");
    } else {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <aside className={styles.aside}>
        <div className={styles.asideGrid} aria-hidden />
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <Image src="/logo.png" alt="" width={28} height={28} priority />
          </span>
          SmartInspect
        </Link>
        <div>
          <h2 className={styles.asideHeading}>
            Инфраструктура под постоянным контролем
          </h2>
          <ul className={styles.features}>
            {features.map((f) => (
              <li key={f} className={styles.feature}>
                <span className={styles.featureIcon}>
                  <Icon name="check" size={16} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.asideFoot}>
          Облачная платформа для автоматизированной диагностики дорог и мостов
        </p>
      </aside>

      <main className={styles.main}>
        <div className={styles.card}>
          <Link href="/" className={styles.back}>
            <Icon name="arrowLeft" size={16} />
            На главную
          </Link>

          <h1 className={styles.title}>
            {mode === "login" ? "Вход в кабинет" : "Регистрация"}
          </h1>
          <p className={styles.subtitle}>
            {mode === "login"
              ? "Войдите, чтобы управлять мониторингом инфраструктуры."
              : "Создайте аккаунт для доступа к платформе SmartInspect."}
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {mode === "register" && (
              <label className={styles.field}>
                <span>Имя и фамилия *</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Иван Иванов"
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <small className={styles.hint}>{fieldErrors.name}</small>
                )}
              </label>
            )}

            <label className={styles.field}>
              <span>Эл. почта *</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="ivan@company.ru"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <small className={styles.hint}>{fieldErrors.email}</small>
              )}
            </label>

            <label className={styles.field}>
              <span>Пароль *</span>
              <input
                type="password"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                aria-invalid={!!fieldErrors.password}
              />
              {fieldErrors.password && (
                <small className={styles.hint}>{fieldErrors.password}</small>
              )}
            </label>

            {mode === "register" && (
              <>
                <div className={styles.row}>
                  <label className={styles.field}>
                    <span>Компания</span>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder="ООО «ДорСтрой»"
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Должность</span>
                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => update("role", e.target.value)}
                      placeholder="Инженер"
                    />
                  </label>
                </div>
                <label className={styles.field}>
                  <span>Сегмент</span>
                  <select
                    value={form.segment}
                    onChange={(e) => update("segment", e.target.value)}
                  >
                    {segments.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button type="submit" className={`btnPrimary ${styles.submit}`} disabled={pending}>
              {pending
                ? "Проверяем…"
                : mode === "login"
                  ? "Войти"
                  : "Создать аккаунт"}
            </button>
          </form>

          {mode === "login" && (
            <p className={styles.demoHint}>
              Демо-доступ: <b>{DEMO_CREDENTIALS.email}</b> / пароль{" "}
              <b>{DEMO_CREDENTIALS.password}</b> — поля уже заполнены.
            </p>
          )}

          <p className={styles.switch}>
            {mode === "login" ? (
              <>
                Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
              </>
            ) : (
              <>
                Уже есть аккаунт? <Link href="/login">Войти</Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
