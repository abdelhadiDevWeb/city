"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { ROLE_LABELS, primaryRole } from "@/lib/roles";
import { Header } from "./Header";
import { canAccess } from "./nav";
import { useSession } from "./session";
import { Sidebar } from "./Sidebar";
import { button, card } from "./ui";

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { account } = useSession();
  const role = primaryRole(account);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex-1 bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-stone-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {menuOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 h-full w-full bg-ink/40" />
          <aside className="relative h-full w-72 max-w-[85%] bg-white shadow-2xl">
            <Sidebar onClose={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            {canAccess(pathname, role) ? (
              children
            ) : (
              <section className={`${card} mx-auto max-w-lg p-8 text-center`}>
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
                  <ShieldX className="h-6 w-6" aria-hidden />
                </span>
                <h1 className="mt-4 text-lg font-bold text-ink">Accès non autorisé</h1>
                <p className="mt-1 text-sm text-stone-500">Cette page n&apos;est pas disponible pour le rôle {ROLE_LABELS[role]}.</p>
                <Link href="/dashboard" className={`${button("primary")} mt-6`}>
                  Retour au tableau de bord
                </Link>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
