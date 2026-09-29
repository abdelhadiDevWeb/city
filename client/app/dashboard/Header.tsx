"use client";

import {
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  LogOut,
  Megaphone,
  Menu as MenuIcon,
  Plus,
  ShieldPlus,
  User,
  UserPlus,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { alertes } from "@/lib/demo-data";
import { ROLE_BADGE, ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import { useSession } from "./session";
import { ALERT_STYLES, Menu, button, menuItem } from "./ui";

type QuickAction = { href: string; label: string; icon: LucideIcon };

const SUPER_ADMIN_ACTIONS: QuickAction[] = [
  { href: "/dashboard/ajouter-residence", label: "Ajouter une résidence", icon: Building2 },
  { href: "/dashboard/abonnements", label: "Attribuer un abonnement", icon: CreditCard },
  { href: "/dashboard/profil", label: "Nouveau Super Admin", icon: ShieldPlus },
];

const MANAGER_ACTIONS: QuickAction[] = [
  { href: "/dashboard/residents", label: "Ajouter un résident", icon: UserPlus },
  { href: "/dashboard/finances", label: "Encaisser un paiement", icon: Wallet },
  { href: "/dashboard/maintenance", label: "Signaler un incident", icon: Wrench },
  { href: "/dashboard/residences", label: "Nouveau bâtiment", icon: Building2 },
  { href: "/dashboard/annonces", label: "Publier une annonce", icon: Megaphone },
];

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { account, logout } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const role = primaryRole(account);

  async function handleLogout() {
    setSigningOut(true);
    await logout();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu"
          className="-ml-1 rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-ink lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Menu
            label="Action rapide"
            triggerClassName={button("primary")}
            width="w-60"
            trigger={
              <>
                <Plus className="h-4 w-4" aria-hidden />
                <span className="hidden md:inline">Action Rapide</span>
                <ChevronDown className="hidden h-4 w-4 text-white/60 md:block" aria-hidden />
              </>
            }
          >
            {(close) =>
              (role === "super_admin" ? SUPER_ADMIN_ACTIONS : MANAGER_ACTIONS).map(({ href, label, icon: Icon }) => (
                <Link key={href + label} href={href} role="menuitem" onClick={close} className={menuItem}>
                  <Icon className="h-4 w-4 text-brand" aria-hidden />
                  {label}
                </Link>
              ))
            }
          </Menu>

          <Menu
            label="Notifications"
            width="w-80"
            triggerClassName="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-stone-300 hover:text-ink"
            trigger={
              <>
                <Bell className="h-[18px] w-[18px]" aria-hidden />
                {alertes.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-white" aria-hidden />}
              </>
            }
          >
            {(close) => (
              <>
                <p className="px-3 pb-2 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">Notifications</p>
                {alertes.map((alerte) => {
                  const { icon: Icon, className } = ALERT_STYLES[alerte.niveau];
                  return (
                    <Link key={alerte.id} href="/dashboard/annonces" role="menuitem" onClick={close} className={`${menuItem} items-start`}>
                      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${className}`}>
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{alerte.titre}</span>
                        <span className="block text-xs text-stone-500">{alerte.detail}</span>
                        <span className="mt-0.5 block text-[11px] text-stone-400">{alerte.date}</span>
                      </span>
                    </Link>
                  );
                })}
              </>
            )}
          </Menu>

          <Menu
            label="Mon compte"
            width="w-64"
            triggerClassName="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition hover:bg-stone-100"
            trigger={
              <>
                <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {initials(account)}
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="hidden max-w-[160px] truncate text-sm font-semibold text-ink md:block">{displayName(account)}</span>
                  <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-stone-400 md:block" aria-hidden />
              </>
            }
          >
            {(close) => (
              <>
                <div className="border-b border-stone-100 px-3 pb-3 pt-2">
                  <p className="truncate text-sm font-semibold text-ink">{displayName(account)}</p>
                  <p className="truncate text-xs text-stone-500">{account.email}</p>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
                </div>
                <div className="pt-1.5">
                  <Link href="/dashboard/profil" role="menuitem" onClick={close} className={menuItem}>
                    <User className="h-4 w-4 text-stone-500" aria-hidden />
                    Mon profil
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout} disabled={signingOut} className={`${menuItem} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                    <LogOut className="h-4 w-4" aria-hidden />
                    {signingOut ? "Déconnexion..." : "Se déconnecter"}
                  </button>
                </div>
              </>
            )}
          </Menu>
        </div>
      </div>
    </header>
  );
}
