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
  USERS_STORAGE_KEY,
  demoUser,
  isValidEmail,
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

type Result = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
  user: AuthUser | null;
  status: "loading" | "ready";
  login: (email: string, password: string) => Result;
  register: (input: RegisterInput) => Result;
  logout: () => void;
  updateProfile: (patch: Partial<AuthUser>) => void;
  setPlan: (plan: PlanId) => void;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    // Restore the persisted session once on mount (client-only external store).
    let restored: AuthUser | null = null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as AuthUser;
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
      if (input.password.length < 6) {
        return { ok: false, error: "Пароль должен быть не короче 6 символов" };
      }
      if (email === DEMO_CREDENTIALS.email) {
        return { ok: false, error: "Эта почта зарезервирована под демо-доступ" };
      }

      const accounts = readAccounts();
      if (accounts.some((a) => a.user.email.toLowerCase() === email)) {
        return { ok: false, error: "Аккаунт с такой почтой уже существует" };
      }

      const newUser: AuthUser = {
        id: `u-${accounts.length + 1}-${email.length}`,
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

  const syncAccount = useCallback((next: AuthUser) => {
    const accounts = readAccounts();
    const idx = accounts.findIndex((a) => a.user.id === next.id);
    if (idx >= 0) {
      accounts[idx] = { ...accounts[idx], user: next };
      writeAccounts(accounts);
    }
  }, []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    (patch) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
        syncAccount(next);
        return next;
      });
    },
    [syncAccount],
  );

  const setPlan = useCallback<AuthContextValue["setPlan"]>(
    (plan) => updateProfile({ plan }),
    [updateProfile],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, updateProfile, setPlan }),
    [user, status, login, register, logout, updateProfile, setPlan],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}
