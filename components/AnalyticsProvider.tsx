"use client";

import Script from "next/script";
import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type ConsentType = "all" | "necessary" | null;

interface CookieConsentContextType {
  consent: ConsentType;
  acceptAll: () => void;
  acceptNecessary: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType>({
  consent: null,
  acceptAll: () => {},
  acceptNecessary: () => {},
  resetConsent: () => {},
});

export const COOKIE_CONSENT_KEY = "smartinspect_cookie_consent";

const consentSubscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("cookie_consent_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cookie_consent_change", callback);
  };
};

function getConsentSnapshot(): ConsentType {
  try {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentType;
    if (saved === "all" || saved === "necessary") return saved;
  } catch {}
  return null;
}

function getServerConsentSnapshot(): ConsentType {
  return null;
}

function getMountedSnapshot(): boolean {
  return true;
}

function getServerMountedSnapshot(): boolean {
  return false;
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const consent = useSyncExternalStore(
    consentSubscribe,
    getConsentSnapshot,
    getServerConsentSnapshot
  );

  const mounted = useSyncExternalStore(
    consentSubscribe,
    getMountedSnapshot,
    getServerMountedSnapshot
  );

  function notifyChange() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie_consent_change"));
    }
  }

  function acceptAll() {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "all");
      notifyChange();
    } catch {}
  }

  function acceptNecessary() {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "necessary");
      notifyChange();
    } catch {}
  }

  function resetConsent() {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      notifyChange();
    } catch {}
  }

  return (
    <CookieConsentContext.Provider value={{ consent, acceptAll, acceptNecessary, resetConsent }}>
      {children}
      {/* Аналитические скрипты (Яндекс.Метрика/GA) загружаются СТРОГО после получения согласия 'all' */}
      {mounted && consent === "all" && (
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(99999999, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true,
                   webvisor:true
              });
            `,
          }}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
