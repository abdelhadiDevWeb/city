"use client";

import { Building, Building2, ChevronRight, MapPin, Plus, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listResidences, type ResidenceSummary } from "@/lib/residences-api";
import { ROLE_BADGE, ROLE_LABELS, displayName } from "@/lib/roles";
import { useSession } from "./session";
import { FormError, Panel, Pill, button, card, describeError } from "./ui";

export function SuperAdminOverview() {
  const { account } = useSession();
  const [residences, setResidences] = useState<ResidenceSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listResidences()
      .then((list) => {
        if (active) setResidences(list);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, []);

  const list = residences ?? [];
  const withoutAdmin = list.filter((r) => !r.admin);
  const stats = [
    { label: "Résidences", value: list.length, icon: Building2 },
    { label: "Bâtiments", value: list.reduce((sum, r) => sum + r.batiments, 0), icon: Building },
    { label: "Résidences avec admin", value: list.length - withoutAdmin.length, icon: ShieldCheck },
    { label: "Résidences sans admin", value: withoutAdmin.length, icon: TriangleAlert, alert: withoutAdmin.length > 0 },
  ];

  return (
    <div className="space-y-8">
      <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            Espace Super Admin
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">Tableau de bord</h1>
          <p className="mt-1.5 text-sm text-stone-500">Vue d&apos;ensemble des résidences, bâtiments et responsables de la plateforme.</p>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-stone-600">
            Bonjour, <span className="font-semibold text-ink">{displayName(account)}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE.super_admin}`}>{ROLE_LABELS.super_admin}</span>
          </p>
        </div>
        <Link href="/dashboard/ajouter-residence" className={button("primary")}>
          <Plus className="h-4 w-4 text-brand" aria-hidden />
          Ajouter Résidence
        </Link>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, alert }) => (
          <div key={label} className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">{label}</span>
              <Icon className={`h-4 w-4 ${alert ? "text-amber-500" : "text-stone-400"}`} aria-hidden />
            </div>
            <p className="mt-3 text-2xl font-bold text-ink">{residences ? value : "—"}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Dernières résidences"
        badge={
          <Link href="/dashboard/ajouter-residence" className="text-xs font-semibold text-stone-500 hover:text-brand">
            Tout gérer
          </Link>
        }
      >
        {residences && list.length === 0 ? (
          <p className="py-6 text-center text-sm text-stone-500">Aucune résidence pour le moment.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {list.slice(0, 5).map((r) => (
              <li key={r.id}>
                <Link href="/dashboard/ajouter-residence" className="group flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink group-hover:text-brand">{r.nom}</span>
                    <span className="flex items-center gap-1 truncate text-xs text-stone-500">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                      {r.localisation} · {r.batiments} bâtiment{r.batiments > 1 ? "s" : ""}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {r.admin ? <Pill tone="dark">{`${r.admin.prenom} ${r.admin.nom}`}</Pill> : <Pill tone="warning">Sans admin</Pill>}
                    <ChevronRight className="h-4 w-4 text-stone-400" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
