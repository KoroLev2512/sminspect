"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Renders the marketing chrome (Nav + Footer) on public pages, but leaves
 * the dashboard and auth screens bare so they can provide their own layout.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register";

  if (bare) return <>{children}</>;

  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
