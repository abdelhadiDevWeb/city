"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import { isActive, navFor } from "./nav";
import { useSession } from "./session";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { account, logout } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const role = primaryRole(account);

  async function handleLogout() {
    setSigningOut(true);
    await logout();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-stone-200 px-5">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden>
            <rect width="32" height="32" rx="9" className="fill-ink" />
            <path d="M9 23V13h4v10zM14.5 23V8h4v15zM20 23v-7h4v7z" className="fill-brand" />
          </svg>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold uppercase tracking-wide text-ink">City</span>
            <span className="block text-[11px] text-stone-500">Portail Syndic Professionnel</span>
          </span>
        </Link>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Fermer le menu" className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav aria-label="Menu opérationnel" className="flex-1 overflow-y-auto px-3 py-5">
        <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">Menu opérationnel</p>
        <ul className="space-y-1">
          {navFor(role).map(({ href, label, icon: Icon, count }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-ink text-white shadow-sm" : "text-stone-600 hover:bg-stone-100 hover:text-ink"
                  }`}
                >
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand" : "text-stone-400 group-hover:text-ink"}`} aria-hidden />
                  <span className="flex-1 truncate">{label}</span>
                  {!!count && (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                        active ? "bg-brand text-ink" : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-stone-200 p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 p-2.5">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-brand">
            {initials(account)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-ink">{displayName(account)}</span>
            <span className="block truncate text-[11px] text-stone-500">{ROLE_LABELS[role]}</span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="rounded-lg p-2 text-stone-400 transition hover:bg-orange-50 hover:text-brand disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
