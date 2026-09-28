import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "./Header";
import { SessionGate } from "./session";

export const metadata: Metadata = {
  title: "Dashboard · City",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <div className="flex min-h-screen flex-1 flex-col bg-background">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      </div>
    </SessionGate>
  );
}
