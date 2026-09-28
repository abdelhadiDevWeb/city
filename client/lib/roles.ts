import type { Account, Role } from "./api";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sub_admin: "Sub Admin",
};

export function primaryRole(account: Account): Role {
  return account.roles[0] ?? (account.type === "SuperAdmin" ? "super_admin" : account.role);
}

export function displayName(account: Account): string {
  return account.type === "SuperAdmin" ? account.nomComplet : `${account.prenom} ${account.nom}`;
}

export function initials(account: Account): string {
  return displayName(account)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
