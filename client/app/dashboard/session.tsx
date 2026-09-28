"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, logout as apiLogout, type Account } from "@/lib/api";

type SessionValue = {
  account: Account;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

// Nothing under /dashboard renders until the backend has verified the access token
// (signature, expiry, issuer/audience, and that the account still exists) via /api/me.
export function SessionGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    let active = true;
    getMe()
      .then((verified) => {
        if (active) setAccount(verified);
      })
      .catch(() => {
        if (active) router.replace("/login");
      });
    return () => {
      active = false;
    };
  }, [router]);

  if (!account) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-background">
        <span aria-label="Checking your session" className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
      </div>
    );
  }

  async function logout() {
    try {
      await apiLogout();
    } finally {
      router.replace("/login");
    }
  }

  return <SessionContext.Provider value={{ account, logout }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionGate>");
  return ctx;
}
