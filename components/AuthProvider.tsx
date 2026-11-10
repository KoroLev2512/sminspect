"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_STORAGE_KEY,
  DEMO_CREDENTIALS,
  MIN_PASSWORD_LENGTH,
  USERS_STORAGE_KEY,
  demoUser,
  isValidEmail,
  isValidPhone,
  type AuthUser,
  type PlanId,
  type StoredAccount,
} from "@/lib/auth";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  company: string;
  role: string;
  segment: string;
}

export type Result = { ok: true } | { ok: false; error: string };

/** Fields that can be changed from the profile screen. */
export type ProfilePatch = Partial<Omit<AuthUser, "id">>;

interface AuthContextValue {
  user: AuthUser | null;
  status: "loading" | "ready";
  /** True for the shared demo login: its password and account are read-only. */
  isDemo: boolean;
  login: (email: string, password: string) => Result;
  register: (input: RegisterInput) => Result;
  logout: () => void;
  updateProfile: (patch: ProfilePatch) => Result;
  changePassword: (current: string, next: string) => Result;
  deleteAccount: (password: string) => Result;
  setPlan: (plan: PlanId) => void;
}

const QUOTA_ERROR = "Не хватает места в хранилище браузера, изменения не сохранены.";

const AuthContext = createContext<AuthContextValue | null>(null);

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(accounts));
}

/**
 * Profile photos (an `avatar` data URL) were briefly supported before emoji
 * avatars replaced them. Strip them from the session and accounts so they
 * stop taking up localStorage space.
 */
function dropLegacyPhotoAvatars(session: AuthUser | null) {
  if (session && "avatar" in session) {
    delete (session as AuthUser & { avatar?: string }).avatar;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }
  const accounts = readAccounts();
  let changed = false;
  for (const account of accounts) {
    if ("avatar" in account.user) {
      delete (account.user as AuthUser & { avatar?: string }).avatar;
      changed = true;
    }
  }
  if (changed) writeAccounts(accounts);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    // Restore the persisted session once on mount (client-only external store).
    let restored: AuthUser | null = null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as AuthUser;
      dropLegacyPhotoAvatars(restored);
    } catch {
      /* ignore corrupted session */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage
    setUser(restored);
    setStatus("ready");
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    (email, password) => {
      const normalized = email.trim().toLowerCase();

      if (
        normalized === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        persist(demoUser);
        return { ok: true };
      }

      const account = readAccounts().find(
        (a) => a.user.email.toLowerCase() === normalized,
      );
      if (!account) return { ok: false, error: "Аккаунт с такой почтой не найден" };
      if (account.password !== password) {
        return { ok: false, error: "Неверный пароль" };
      }

      persist(account.user);
      return { ok: true };
    },
    [persist],
  );

  const register = useCallback<AuthContextValue["register"]>(
    (input) => {
      const email = input.email.trim().toLowerCase();
      if (!input.name.trim()) return { ok: false, error: "Укажите имя" };
      if (!isValidEmail(email)) return { ok: false, error: "Некорректный адрес почты" };
      if (input.password.length < MIN_PASSWORD_LENGTH) {
        return { ok: false, error: `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов` };
      }
      if (email === DEMO_CREDENTIALS.email) {
        return { ok: false, error: "Эта почта зарезервирована под гостевой доступ" };
      }

      const accounts = readAccounts();
      if (accounts.some((a) => a.user.email.toLowerCase() === email)) {
        return { ok: false, error: "Аккаунт с такой почтой уже существует" };
      }

      const newUser: AuthUser = {
        id: `u-${crypto.randomUUID()}`,
        name: input.name.trim(),
        email,
        company: input.company.trim() || "—",
        role: input.role.trim() || "Специалист",
        segment: input.segment,
        plan: "basic",
      };

      writeAccounts([...accounts, { user: newUser, password: input.password }]);
      persist(newUser);
      return { ok: true };
    },
    [persist],
  );

  const logout = useCallback(() => persist(null), [persist]);

  const isDemo = user?.id === demoUser.id;

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    (patch) => {
      if (!user) return { ok: false, error: "Сессия истекла, войдите заново" };

      const next: AuthUser = { ...user, ...patch, id: user.id };
      next.name = next.name.trim();
      next.email = next.email.trim().toLowerCase();

      if (!next.name) return { ok: false, error: "Укажите имя" };
      if (!isValidEmail(next.email)) return { ok: false, error: "Некорректный адрес почты" };
      if (next.phone && !isValidPhone(next.phone)) {
        return { ok: false, error: "Телефон должен содержать 10 цифр после +7" };
      }

      const accounts = readAccounts();
      if (next.email !== user.email) {
        if (user.id === demoUser.id) {
          return { ok: false, error: "У гостевого доступа почту изменить нельзя" };
        }
        if (next.email === DEMO_CREDENTIALS.email) {
          return { ok: false, error: "Эта почта зарезервирована под гостевой доступ" };
        }
        if (accounts.some((a) => a.user.id !== user.id && a.user.email === next.email)) {
          return { ok: false, error: "Эта почта уже занята другим аккаунтом" };
        }
      }

      // Write the session first, then the accounts list; if storage is full,
      // roll the session back so the two never disagree.
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
        const idx = accounts.findIndex((a) => a.user.id === user.id);
        if (idx >= 0) {
          accounts[idx] = { ...accounts[idx], user: next };
          writeAccounts(accounts);
        }
      } catch {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } catch {
          /* previous value still fits or was never replaced */
        }
        return { ok: false, error: QUOTA_ERROR };
      }
      setUser(next);
      return { ok: true };
    },
    [user],
  );

  const changePassword = useCallback<AuthContextValue["changePassword"]>(
    (current, nextPassword) => {
      if (!user) return { ok: false, error: "Сессия истекла, войдите заново" };
      if (user.id === demoUser.id) {
        return { ok: false, error: "У гостевого доступа пароль изменить нельзя" };
      }
      const accounts = readAccounts();
      const idx = accounts.findIndex((a) => a.user.id === user.id);
      if (idx < 0) return { ok: false, error: "Аккаунт не найден" };
      if (accounts[idx].password !== current) {
        return { ok: false, error: "Текущий пароль указан неверно" };
      }
      if (nextPassword.length < MIN_PASSWORD_LENGTH) {
        return {
          ok: false,
          error: `Новый пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`,
        };
      }
      if (nextPassword === current) {
        return { ok: false, error: "Новый пароль совпадает с текущим" };
      }
      accounts[idx] = { ...accounts[idx], password: nextPassword };
      writeAccounts(accounts);
      return { ok: true };
    },
    [user],
  );

  const deleteAccount = useCallback<AuthContextValue["deleteAccount"]>(
    (password) => {
      if (!user) return { ok: false, error: "Сессия истекла, войдите заново" };
      if (user.id === demoUser.id) {
        return { ok: false, error: "Гостевой доступ удалить нельзя" };
      }
      const accounts = readAccounts();
      const account = accounts.find((a) => a.user.id === user.id);
      if (!account || account.password !== password) {
        return { ok: false, error: "Пароль указан неверно" };
      }
      writeAccounts(accounts.filter((a) => a.user.id !== user.id));
      persist(null);
      return { ok: true };
    },
    [user, persist],
  );

  const setPlan = useCallback<AuthContextValue["setPlan"]>(
    (plan) => {
      updateProfile({ plan });
    },
    [updateProfile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isDemo,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      setPlan,
    }),
    [
      user,
      status,
      isDemo,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      setPlan,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}
