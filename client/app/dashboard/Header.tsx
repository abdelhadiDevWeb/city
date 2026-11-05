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
  Search,
  ShieldPlus,
  User,
  UserPlus,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAnnonces, type Alerte } from "@/lib/annonces-api";
import { getSocket, refreshSocketAuth, type RealtimeNotification } from "@/lib/socket";
import { ROLE_BADGE, ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import { useSession } from "./session";
import { ALERT_STYLES, Menu, button, menuItem, useToast } from "./ui";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

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

export function Header({ onOpenMenu, onOpenCommand }: { onOpenMenu: () => void; onOpenCommand?: () => void }) {
  const { account, logout } = useSession();
  const { t, isRTL, tText } = useI18n();
  const notify = useToast();
  const [signingOut, setSigningOut] = useState(false);
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const role = primaryRole(account);

  useEffect(() => {
    let active = true;
    if (account && account.type !== "SuperAdmin") {
      getAnnonces()
        .then((res) => {
          if (active && res?.alertes) {
            setAlertes(res.alertes);
          }
        })
        .catch(() => {
          // Silently ignore if unauthenticated or error
        });
    }

    const socket = getSocket();
    refreshSocketAuth();
    if (account && "idResidence" in account && account.idResidence) {
      socket.emit("join_residence", account.idResidence);
    }

    const recentNotifKeys = new Set<string>();

    const onNotification = (notif: RealtimeNotification) => {
      if (!active) return;
      const notifKey = `${notif.id || ""}_${notif.titre}`;
      if (recentNotifKeys.has(notifKey)) return;
      recentNotifKeys.add(notifKey);
      setTimeout(() => recentNotifKeys.delete(notifKey), 10000);

      const newAlerte: Alerte = {
        id: notif.id,
        titre: notif.titre,
        detail: notif.detail,
        niveau: notif.niveau || "info",
        date: notif.date || "À l'instant",
      };
      setAlertes((prev) => [newAlerte, ...prev.filter((a) => a.id !== notif.id)]);

      // Avoid double-toasting when the admin is directly on the annonces page
      if (typeof window !== "undefined" && window.location.pathname.includes("/dashboard/annonces")) {
        return;
      }
      notify(`📢 ${notif.titre} : ${notif.detail}`);
    };

    socket.on("new_notification", onNotification);

    return () => {
      active = false;
      socket.off("new_notification", onNotification);
    };
  }, [account, notify]);

  async function handleLogout() {
    setSigningOut(true);
    await logout();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu"
          className="-ms-1 rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-ink lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onOpenCommand}
          className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/80 px-2.5 sm:px-3 py-1.5 text-xs text-stone-500 hover:border-stone-300 hover:bg-stone-100 transition max-w-[140px] sm:max-w-none sm:w-60 focus:outline-none focus:ring-1 focus:ring-brand"
          title="Recherche universelle (Ctrl + K)"
        >
          <Search className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span className="truncate">{t.nav.searchPlaceholder}</span>
          <kbd className="ms-auto hidden rounded bg-stone-200/70 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 sm:inline-block border border-stone-300/50">
            Ctrl K
          </kbd>
        </button>

        <div className="ms-auto flex items-center gap-1.5 sm:gap-2.5">
          {/* Trilingual Language Switcher */}
          <LanguageSwitcher />

          <Menu
            label={t.nav.quickAction}
            triggerClassName={button("primary")}
            width="w-60"
            trigger={
              <>
                <Plus className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden md:inline">{t.nav.quickAction}</span>
                <ChevronDown className="hidden h-4 w-4 text-white/60 md:block" aria-hidden />
              </>
            }
          >
            {(close) =>
              (role === "super_admin" ? SUPER_ADMIN_ACTIONS : MANAGER_ACTIONS).map(({ href, label, icon: Icon }) => (
                <Link key={href + label} href={href} role="menuitem" onClick={close} className={menuItem}>
                  <Icon className="h-4 w-4 text-brand shrink-0" aria-hidden />
                  {tText(label)}
                </Link>
              ))
            }
          </Menu>

          <Menu
            label={t.nav.notifications}
            width="w-80"
            triggerClassName="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:border-stone-300 hover:text-ink shrink-0"
            trigger={
              <>
                <Bell className="h-[18px] w-[18px]" aria-hidden />
                {alertes.length > 0 && (
                  <span className={`absolute top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-white ${isRTL ? "left-2" : "right-2"}`} aria-hidden />
                )}
              </>
            }
          >
            {(close) => (
              <>
                <p className="px-3 pb-2 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">{t.nav.notifications}</p>
                {alertes.length === 0 ? (
                  <p className="px-3 py-6 text-center text-xs text-stone-500">{t.nav.noNotifications}</p>
                ) : (
                  alertes.map((alerte) => {
                    const { icon: Icon, className } = ALERT_STYLES[alerte.niveau];
                    return (
                      <Link key={alerte.id} href={role === "super_admin" ? "/dashboard" : "/dashboard/annonces"} role="menuitem" onClick={close} className={`${menuItem} items-start`}>
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
                  })
                )}
              </>
            )}
          </Menu>

          <Menu
            label={displayName(account)}
            width="w-64"
            triggerClassName="flex items-center gap-2 rounded-xl py-1 ps-1 pe-2 transition hover:bg-stone-100"
            trigger={
              <>
                <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {initials(account)}
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="hidden max-w-[140px] truncate text-sm font-semibold text-ink md:block">{displayName(account)}</span>
                  <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_BADGE[role]}`}>{t.roles?.[role] || tText(ROLE_LABELS[role])}</span>
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
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE[role]}`}>{t.roles?.[role] || tText(ROLE_LABELS[role])}</span>
                </div>
                <div className="pt-1.5">
                  <Link href="/dashboard/profil" role="menuitem" onClick={close} className={menuItem}>
                    <User className="h-4 w-4 text-stone-500 shrink-0" aria-hidden />
                    {t.nav.profil}
                  </Link>
                  <button type="button" role="menuitem" onClick={handleLogout} disabled={signingOut} className={`${menuItem} text-red-600 hover:bg-red-50 hover:text-red-700`}>
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                    {signingOut ? t.common.loading : t.nav.logout}
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
