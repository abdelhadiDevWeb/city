"use client";

import { useState } from "react";
import { ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import type { Role } from "@/lib/api";
import { useSession } from "./session";

const ROLE_BADGE: Record<Role, string> = {
  super_admin: "bg-brand text-ink",
  admin: "bg-ink text-white",
  sub_admin: "bg-stone-200 text-stone-800",
};

export function Header() {
  const { account, logout } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const role = primaryRole(account);

  async function handleLogout() {
    setSigningOut(true);
    await logout();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
            <rect width="32" height="32" rx="8" className="fill-ink" />
            <path d="M9 23V13h4v10zM14.5 23V8h4v15zM20 23v-7h4v7z" className="fill-brand" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-ink">City</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-ink">{displayName(account)}</p>
            <p className="text-xs text-stone-500">{account.email}</p>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>

          <div
            aria-hidden
            className="hidden h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700 sm:flex"
          >
            {initials(account)}
          </div>

          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:border-brand hover:text-brand disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}
