"use client";

import { primaryRole } from "@/lib/roles";
import { MonEspace } from "./MonEspace";
import { useSession } from "./session";
import { SuperAdminOverview } from "./SuperAdminOverview";

export default function DashboardPage() {
  const { account } = useSession();
  return primaryRole(account) === "super_admin" ? <SuperAdminOverview /> : <MonEspace />;
}
