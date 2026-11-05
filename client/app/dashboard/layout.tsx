import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SessionGate } from "./session";
import { Shell } from "./Shell";
import { ToastProvider } from "./ui";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Dashboard · City",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <I18nProvider>
        <ToastProvider>
          <Shell>{children}</Shell>
        </ToastProvider>
      </I18nProvider>
    </SessionGate>
  );
}
