import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SessionGate } from "./session";
import { Shell } from "./Shell";
import { ToastProvider } from "./ui";

export const metadata: Metadata = {
  title: "Dashboard · City",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <ToastProvider>
        <Shell>{children}</Shell>
      </ToastProvider>
    </SessionGate>
  );
}
