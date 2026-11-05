"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ROLE_LABELS, primaryRole } from "@/lib/roles";
import { CommandPalette } from "./CommandPalette";
import { EmergencyWidget } from "./EmergencyWidget";
import { Header } from "./Header";
import { canAccess } from "./nav";
import { useSession } from "./session";
import { Sidebar } from "./Sidebar";
import { button, card } from "./ui";
import { useI18n } from "@/lib/i18n";

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const pathname = usePathname();
  const { account } = useSession();
  const { t, isRTL } = useI18n();
  const role = primaryRole(account);

  useEffect(() => {
    function onGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onGlobalKeyDown);
    return () => window.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const roleLabel = t.roles[role] || ROLE_LABELS[role];

  return (
    <div className="min-h-screen flex-1 bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Desktop sidebar with CSS logical positioning */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e border-stone-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={t.common.close}
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-ink/40"
          />
          <aside className="relative h-full w-72 max-w-[85%] bg-white shadow-2xl">
            <Sidebar onClose={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content column with CSS logical padding */}
      <div className="flex min-h-screen flex-col lg:ps-64">
        <Header onOpenMenu={() => setMenuOpen(true)} onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            {canAccess(pathname, role) ? (
              children
            ) : (
              <section className={`${card} mx-auto max-w-lg p-6 sm:p-8 text-center`}>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
                  <ShieldX className="h-6 w-6" aria-hidden />
                </span>
                <h1 className="mt-4 text-lg font-bold text-ink">
                  {isRTL ? "وصول غير مصرح به" : "Accès non autorisé"}
                </h1>
                <p className="mt-1 text-sm text-stone-500">
                  {isRTL
                    ? `هذه الصفحة غير متاحة لرتبة ${roleLabel}.`
                    : `Cette page n'est pas disponible pour le rôle ${roleLabel}.`}
                </p>
                <Link href="/dashboard" className={`${button("primary")} mt-6`}>
                  {t.common.back} {t.nav.dashboard}
                </Link>
              </section>
            )}
          </div>
        </main>

        <CommandPalette
          isOpen={commandOpen}
          onClose={() => setCommandOpen(false)}
          onOpenEmergency={() => setEmergencyOpen(true)}
        />

        <EmergencyWidget
          isOpenExternal={emergencyOpen}
          onCloseExternal={() => setEmergencyOpen(false)}
        />
      </div>
    </div>
  );
}
