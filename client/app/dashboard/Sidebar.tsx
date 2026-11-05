"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import { isActive, navFor } from "./nav";
import { useSession } from "./session";
import { useI18n, type Translations } from "@/lib/i18n";
import { LanguageSegmentedControl } from "./LanguageSwitcher";

function getNavLabel(href: string, defaultLabel: string, t: Translations): string {
  switch (href) {
    case "/dashboard":
      return t.nav.dashboard;
    case "/dashboard/residences":
    case "/dashboard/ajouter-residence":
      return t.nav.residences;
    case "/dashboard/residents":
      return t.nav.residents;
    case "/dashboard/finances":
      return t.nav.finances;
    case "/dashboard/maintenance":
      return t.nav.maintenance;
    case "/dashboard/personnel":
      return t.nav.personnel;
    case "/dashboard/annonces":
      return t.nav.annonces;
    case "/dashboard/assemblees":
      return t.nav.assemblees;
    case "/dashboard/documents":
      return t.nav.documents;
    case "/dashboard/abonnements":
      return t.nav.abonnements;
    case "/dashboard/statistiques":
      return t.nav.statistiques;
    case "/dashboard/rapports":
      return t.nav.rapports;
    case "/dashboard/configuration":
      return t.nav.configuration;
    case "/dashboard/profil":
      return t.nav.profil;
    default:
      return defaultLabel;
  }
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { account, logout } = useSession();
  const { t, locale } = useI18n();
  const [signingOut, setSigningOut] = useState(false);
  const role = primaryRole(account);

  async function handleLogout() {
    setSigningOut(true);
    await logout();
  }

  const roleLabel = t.roles[role] || ROLE_LABELS[role];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-stone-200 px-5">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="h-9 w-9 shrink-0" aria-hidden>
            <rect width="32" height="32" rx="9" className="fill-ink" />
            <path d="M9 23V13h4v10zM14.5 23V8h4v15zM20 23v-7h4v7z" className="fill-brand" />
          </svg>
          <span className="leading-tight">
            <span className="block text-sm font-extrabold uppercase tracking-wide text-ink">City</span>
            <span className="block text-[11px] text-stone-500">
              {locale === "ar" ? "منظومة إدارة الإقامات" : locale === "en" ? "Property Management" : "Portail Syndic Pro"}
            </span>
          </span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav aria-label="Menu" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
          {locale === "ar" ? "القائمة الرئيسية" : locale === "en" ? "Main Menu" : "Menu opérationnel"}
        </p>
        <ul className="space-y-1">
          {navFor(role).map(({ href, label, icon: Icon, count }) => {
            const active = isActive(pathname, href);
            const localizedLabel = getNavLabel(href, label, t);
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
                  <span className="flex-1 truncate">{localizedLabel}</span>
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

        {/* Mobile-only language selector inside drawer */}
        {onClose && (
          <div className="mt-6 pt-4 border-t border-stone-200/80 px-1">
            <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {locale === "ar" ? "اللغة" : locale === "en" ? "Language" : "Langue"}
            </p>
            <LanguageSegmentedControl />
          </div>
        )}
      </nav>

      <div className="border-t border-stone-200 p-3">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 p-2.5">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-brand">
            {initials(account)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-sm font-semibold text-ink">{displayName(account)}</span>
            <span className="block truncate text-[11px] text-stone-500">{roleLabel}</span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            aria-label={t.nav.logout}
            title={t.nav.logout}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-orange-50 hover:text-brand disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
