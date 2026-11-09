import type { ReactNode } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { DemoDataProvider } from "@/components/DemoDataProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <DashboardShell>{children}</DashboardShell>
    </DemoDataProvider>
  );
}
