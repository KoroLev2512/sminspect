"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useDemoData } from "@/components/DemoDataProvider";
import { Icon } from "@/components/dash-icons";
import { UserAvatar } from "@/components/dash-ui";
import { DEMO_AS_OF, formatDate } from "@/lib/dashboard";
import {
  MIN_PASSWORD_LENGTH,
  avatarEmojis,
  defaultNotifications,
  formatPhone,
  isValidEmail,
  isValidPhone,
  notificationOptions,
  segments,
  type AuthUser,
  type NotificationId,
} from "@/lib/auth";
import styles from "@/components/Dashboard.module.css";

/** Shows a "Сохранено" mark for a moment after a successful save. */
function useFlash(ms = 2500) {
  const [on, setOn] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  function flash() {
    setOn(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOn(false), ms);
  }
  return [on, flash] as const;
}

function SavedMark({ show, text = "Сохранено" }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <span className={styles.saved} role="status">
      <Icon name="check" size={16} /> {text}
    </span>
  );
}

/* ---- Profile --------------------------------------------------------------- */

type ProfileForm = Pick<
  AuthUser,
  "name" | "email" | "company" | "role" | "segment"
> & { phone: string; emoji: string };

type ProfileErrors = Partial<Record<"name" | "email" | "phone", string>>;

function toForm(user: AuthUser): ProfileForm {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    company: user.company,
    role: user.role,
    segment: user.segment,
    emoji: user.emoji ?? "",
  };
}

function validateProfile(form: ProfileForm): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!form.name.trim()) errors.name = "Укажите имя";
  if (!isValidEmail(form.email.trim())) errors.email = "Некорректный адрес почты";
  if (!isValidPhone(form.phone)) errors.phone = "Нужно 10 цифр после +7";
  return errors;
}

export function ProfileCard({ user }: { user: AuthUser }) {
  const { updateProfile, isDemo } = useAuth();
  const [form, setForm] = useState<ProfileForm>(() => toForm(user));
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [formError, setFormError] = useState("");
  const [saved, flashSaved] = useFlash();

  const initial = toForm(user);
  const dirty = (Object.keys(initial) as (keyof ProfileForm)[]).some(
    (k) => initial[k] !== form[k],
  );

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function set<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
    setFormError("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const found = validateProfile(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const result = updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company.trim(),
      role: form.role.trim(),
      segment: form.segment,
      emoji: form.emoji || undefined,
    });
    if (!result.ok) {
      if (result.error.includes("почт")) setErrors({ email: result.error });
      else setFormError(result.error);
      return;
    }
    setForm((f) => ({ ...f, name: f.name.trim(), email: f.email.trim().toLowerCase() }));
    flashSaved();
  }

  function reset() {
    setForm(toForm(user));
    setErrors({});
    setFormError("");
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Профиль</h3>
        <SavedMark show={saved} />
      </div>

      <form onSubmit={submit} noValidate>
        <div className={styles.avatarRow}>
          <UserAvatar name={form.name || user.name} emoji={form.emoji} size={72} />
          <div className={styles.avatarActions}>
            <span className={styles.emojiLabel} id="emoji-label">
              Аватар
            </span>
            <div className={styles.emojiGrid} role="radiogroup" aria-labelledby="emoji-label">
              <button
                type="button"
                role="radio"
                aria-checked={!form.emoji}
                aria-label="Инициалы"
                title="Инициалы"
                className={`${styles.emojiOption} ${styles.emojiInitials} ${!form.emoji ? styles.emojiOptionActive : ""}`}
                onClick={() => set("emoji", "")}
              >
                Аа
              </button>
              {avatarEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  role="radio"
                  aria-checked={form.emoji === emoji}
                  aria-label={`Эмодзи ${emoji}`}
                  className={`${styles.emojiOption} ${form.emoji === emoji ? styles.emojiOptionActive : ""}`}
                  onClick={() => set("emoji", emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Имя и фамилия</span>
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className={styles.hint}>{errors.name}</span>}
          </label>
          <label className={styles.field}>
            <span>Почта</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              disabled={isDemo}
              aria-invalid={!!errors.email}
            />
            {errors.email ? (
              <span className={styles.hint}>{errors.email}</span>
            ) : (
              isDemo && <span className={styles.fieldNote}>У гостевого доступа почта фиксирована</span>
            )}
          </label>
          <label className={styles.field}>
            <span>Телефон</span>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+7 (900) 000-00-00"
              value={form.phone}
              onChange={(e) => set("phone", formatPhone(e.target.value))}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <span className={styles.hint}>{errors.phone}</span>}
          </label>
          <label className={styles.field}>
            <span>Компания</span>
            <input
              type="text"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Должность</span>
            <input
              type="text"
              autoComplete="organization-title"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Сегмент</span>
            <select value={form.segment} onChange={(e) => set("segment", e.target.value)}>
              {segments.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <div className={styles.formActions}>
          <button type="submit" className="btnPrimary" disabled={!dirty}>
            Сохранить изменения
          </button>
          {dirty && (
            <button type="button" className={styles.btnGhost} onClick={reset}>
              Отменить
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---- Password -------------------------------------------------------------- */

export function PasswordCard() {
  const { changePassword, isDemo } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [saved, flashSaved] = useFlash(3500);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.current) return setError("Введите текущий пароль");
    if (form.next.length < MIN_PASSWORD_LENGTH) {
      return setError(`Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
    }
    if (form.next !== form.confirm) return setError("Пароли не совпадают");

    const result = changePassword(form.current, form.next);
    if (!result.ok) return setError(result.error);
    setForm({ current: "", next: "", confirm: "" });
    flashSaved();
  }

  const filled = form.current && form.next && form.confirm;

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Безопасность</h3>
        <SavedMark show={saved} text="Пароль изменён" />
      </div>
      {isDemo ? (
        <p className={styles.fieldNote}>
          Вы вошли в гостевой доступ: его пароль общий и не меняется. Зарегистрируйте свой аккаунт,
          чтобы управлять паролем.
        </p>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className={styles.formGrid3}>
            <label className={styles.field}>
              <span>Текущий пароль</span>
              <input
                type="password"
                autoComplete="current-password"
                value={form.current}
                onChange={(e) => set("current", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Новый пароль</span>
              <input
                type="password"
                autoComplete="new-password"
                value={form.next}
                onChange={(e) => set("next", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Повторите новый пароль</span>
              <input
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                aria-invalid={!!form.confirm && form.confirm !== form.next}
              />
            </label>
          </div>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
          <div className={styles.formActions}>
            <button type="submit" className="btnPrimary" disabled={!filled}>
              Изменить пароль
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---- Notifications --------------------------------------------------------- */

export function NotificationsCard({ user }: { user: AuthUser }) {
  const { updateProfile } = useAuth();
  const [saved, flashSaved] = useFlash(1800);
  const prefs = user.notifications ?? defaultNotifications;

  function toggle(id: NotificationId) {
    const result = updateProfile({ notifications: { ...prefs, [id]: !prefs[id] } });
    if (result.ok) flashSaved();
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Уведомления</h3>
        <SavedMark show={saved} />
      </div>
      {notificationOptions.map((opt) => (
        <div key={opt.id} className={styles.toggleRow}>
          <div>
            <div className={styles.cellStrong}>{opt.label}</div>
            <div className={styles.cellMuted} style={{ fontSize: "var(--text-caption)" }}>
              {opt.desc}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs[opt.id]}
            aria-label={opt.label}
            className={`${styles.toggle} ${prefs[opt.id] ? styles.toggleOn : ""}`}
            onClick={() => toggle(opt.id)}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ---- Delete account -------------------------------------------------------- */

export function DeleteAccountCard() {
  const { deleteAccount, isDemo } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = deleteAccount(password);
    if (!result.ok) return setError(result.error);
    router.replace("/login");
  }

  function cancel() {
    setConfirming(false);
    setPassword("");
    setError("");
  }

  return (
    <div className={`${styles.card} ${styles.dangerCard}`}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Удаление аккаунта</h3>
      </div>
      <p className={styles.fieldNote}>
        Профиль, настройки и тарифный план будут удалены без возможности восстановления.
      </p>

      {isDemo ? (
        <p className={styles.fieldNote} style={{ marginTop: 8 }}>
          Гостевой доступ удалить нельзя.
        </p>
      ) : !confirming ? (
        <div className={styles.formActions}>
          <button type="button" className={styles.btnDanger} onClick={() => setConfirming(true)}>
            Удалить аккаунт
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className={styles.dangerConfirm}>
          <label className={styles.field}>
            <span>Введите пароль для подтверждения</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              aria-invalid={!!error}
            />
          </label>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnDanger} disabled={!password}>
              Удалить навсегда
            </button>
            <button type="button" className={styles.btnGhost} onClick={cancel}>
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---- Demo data ------------------------------------------------------------- */

export function DemoDataCard() {
  const { resetDemo } = useDemoData();
  const router = useRouter();
  const [done, flashDone] = useFlash(3000);

  function reset() {
    if (
      !window.confirm(
        "Сбросить данные кабинета к исходному состоянию? Созданные инспекции, изменения статусов и сформированные отчёты будут удалены.",
      )
    ) {
      return;
    }
    resetDemo();
    flashDone();
    router.refresh();
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>Данные кабинета</h3>
        <SavedMark show={done} text="Данные сброшены" />
      </div>
      <p className={styles.fieldNote}>
        Данные кабинета — срез на {formatDate(DEMO_AS_OF)}. Изменения хранятся в этом браузере.
        Сброс возвращает исходные объекты, инспекции, дефекты и отчёты.
      </p>
      <div className={styles.formActions}>
        <button type="button" className={styles.btnSecondary} onClick={reset}>
          Сбросить данные
        </button>
      </div>
    </div>
  );
}
