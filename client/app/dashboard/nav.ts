import {
  Building2,
  ChartColumn,
  ChartLine,
  CircleUser,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  Megaphone,
  SlidersHorizontal,
  UserCog,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/api";
import { impayes, incidents, taches } from "@/lib/demo-data";

export type NavItem = { href: string; label: string; icon: LucideIcon; count?: number };

const SUPER_ADMIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/ajouter-residence", label: "Ajouter Résidence", icon: Building2 },
  { href: "/dashboard/statistiques", label: "Statistiques", icon: ChartLine },
  { href: "/dashboard/abonnements", label: "Gestion Abonnements", icon: CreditCard },
  { href: "/dashboard/profil", label: "Mon profil", icon: CircleUser },
];

const MANAGER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/residences", label: "Résidences & Bâtiments", icon: Building2 },
  { href: "/dashboard/residents", label: "Résidents & Propriétaires", icon: Users },
  { href: "/dashboard/finances", label: "Finances & Charges", icon: Wallet, count: impayes.length },
  { href: "/dashboard/maintenance", label: "Maintenance & Pannes", icon: Wrench, count: incidents.length },
  { href: "/dashboard/personnel", label: "Personnel & Tâches", icon: UserCog, count: taches.filter((t) => t.statut !== "Terminée").length },
  { href: "/dashboard/annonces", label: "Annonces & Alertes", icon: Megaphone },
  { href: "/dashboard/documents", label: "Documents & Contrats", icon: FolderOpen },
  { href: "/dashboard/rapports", label: "Rapports & Exports", icon: ChartColumn },
  { href: "/dashboard/configuration", label: "Configuration & Types", icon: SlidersHorizontal },
];

const ALWAYS_ALLOWED = ["/dashboard/profil"];

export function navFor(role: Role): NavItem[] {
  return role === "super_admin" ? SUPER_ADMIN_NAV : MANAGER_NAV;
}

export function isActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

// UI-only gate so each role sees its own pages; the API enforces the real permissions.
export function canAccess(pathname: string, role: Role): boolean {
  return [...ALWAYS_ALLOWED, ...navFor(role).map((item) => item.href)].some((href) => isActive(pathname, href));
}
