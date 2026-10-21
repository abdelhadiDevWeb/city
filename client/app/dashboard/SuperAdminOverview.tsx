"use client";

import {
  BadgeCheck,
  Building,
  Building2,
  ChartLine,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  MapPin,
  Plus,
  Receipt,
  ShieldCheck,
  ShieldPlus,
  TriangleAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDZD } from "@/lib/format";
import { getStats, listFormules, type Formule, type Stats } from "@/lib/platform-api";
import { listResidences, type ResidenceSummary } from "@/lib/residences-api";
import { ROLE_BADGE, ROLE_LABELS, displayName } from "@/lib/roles";
import { useSession } from "./session";
import { FormError, Panel, Pill, button, card, describeError } from "./ui";

export function SuperAdminOverview() {
  const { account } = useSession();
  const [residences, setResidences] = useState<ResidenceSummary[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [formules, setFormules] = useState<Formule[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([listResidences(), getStats(), listFormules()])
      .then(([resList, statsData, formulesData]) => {
        if (!active) return;
        setResidences(resList);
        setStats(statsData);
        setFormules(formulesData);
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

  const kpis = [
    {
      label: "Résidences enregistrées",
      value: list.length,
      hint: `${list.reduce((sum, r) => sum + r.batiments, 0)} bâtiments au total`,
      icon: Building2,
    },
    {
      label: "Responsables (Admins)",
      value: `${list.length - withoutAdmin.length} / ${list.length}`,
      hint: withoutAdmin.length > 0 ? `${withoutAdmin.length} résidence(s) sans admin` : "Toutes les résidences ont un admin",
      icon: ShieldCheck,
      alert: withoutAdmin.length > 0,
    },
    {
      label: "Abonnements actifs",
      value: stats ? stats.totaux.souscriptionsActives : "—",
      hint: stats ? `${stats.totaux.souscriptionsImpayees} en attente de paiement` : undefined,
      icon: BadgeCheck,
      alert: Boolean(stats && stats.totaux.souscriptionsImpayees > 0),
    },
    {
      label: "Revenus encaissés",
      value: stats ? formatDZD(stats.revenus.encaisse) : "—",
      hint: stats && stats.revenus.enAttente > 0 ? `${formatDZD(stats.revenus.enAttente)} en attente` : "Comptabilité à jour",
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            Espace Super Admin
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">Tableau de bord Plateforme</h1>
          <p className="mt-1.5 text-sm text-stone-500">
            Gestion globale des résidences, des responsables, des formules d&apos;abonnements et de la comptabilité.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-stone-600">
            Connecté en tant que <span className="font-semibold text-ink">{displayName(account)}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE.super_admin}`}>
              {ROLE_LABELS.super_admin}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/abonnements" className={button("secondary")}>
            <CreditCard className="h-4 w-4" aria-hidden />
            Abonnements
          </Link>
          <Link href="/dashboard/ajouter-residence" className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Résidence
          </Link>
        </div>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, alert }) => (
          <div key={label} className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{label}</span>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${alert ? "bg-amber-50 text-amber-600" : "bg-orange-50 text-brand"}`}>
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{residences ? value : "—"}</p>
            {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
          </div>
        ))}
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/ajouter-residence"
          className={`${card} group flex items-center justify-between p-4 transition hover:border-brand/40 hover:shadow-xs`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand">
              <Building2 className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink group-hover:text-brand">Résidences</span>
              <span className="block text-xs text-stone-500">Créer & nommer admins</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-brand" aria-hidden />
        </Link>

        <Link
          href="/dashboard/abonnements"
          className={`${card} group flex items-center justify-between p-4 transition hover:border-brand/40 hover:shadow-xs`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink group-hover:text-brand">Abonnements</span>
              <span className="block text-xs text-stone-500">Formules & encaissements</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-brand" aria-hidden />
        </Link>

        <Link
          href="/dashboard/statistiques"
          className={`${card} group flex items-center justify-between p-4 transition hover:border-brand/40 hover:shadow-xs`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ChartLine className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink group-hover:text-brand">Statistiques</span>
              <span className="block text-xs text-stone-500">Graphiques & croissance</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-brand" aria-hidden />
        </Link>

        <Link
          href="/dashboard/profil"
          className={`${card} group flex items-center justify-between p-4 transition hover:border-brand/40 hover:shadow-xs`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldPlus className="h-5 w-5" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink group-hover:text-brand">Super Admins</span>
              <span className="block text-xs text-stone-500">Gestion des accès globaux</span>
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-brand" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Résidences Panel */}
        <div className="lg:col-span-2">
          <Panel
            title="Dernières résidences créées"
            badge={
              <Link href="/dashboard/ajouter-residence" className="text-xs font-semibold text-stone-500 hover:text-brand">
                Tout gérer ({list.length}) →
              </Link>
            }
          >
            {residences && list.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-500">Aucune résidence enregistrée pour le moment.</p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {list.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/dashboard/ajouter-residence?id=${r.id}`}
                      className="group flex items-center justify-between gap-4 py-3.5 text-sm transition hover:bg-stone-50/70 -mx-4 px-4 rounded-xl"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-ink group-hover:text-brand">{r.nom}</span>
                        <span className="flex items-center gap-1.5 truncate text-xs text-stone-500">
                          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                          {r.localisation} · {r.batiments} bâtiment{r.batiments > 1 ? "s" : ""}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        {r.admin ? (
                          <Pill tone="dark">{`${r.admin.prenom} ${r.admin.nom}`}</Pill>
                        ) : (
                          <Pill tone="warning">Sans admin</Pill>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-400 group-hover:text-brand">
                          Gérer
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Formules / Abonnements Panel */}
        <div>
          <Panel
            title="Formules d'abonnements"
            badge={
              <Link href="/dashboard/abonnements" className="text-xs font-semibold text-stone-500 hover:text-brand">
                Gérer →
              </Link>
            }
          >
            {!formules ? (
              <p className="py-6 text-center text-xs text-stone-500">Chargement des formules...</p>
            ) : formules.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucune formule configurée.</p>
            ) : (
              <ul className="space-y-3">
                {formules.slice(0, 4).map((f) => (
                  <li key={f.id} className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50/50 p-3">
                    <div>
                      <p className="font-semibold text-ink">{f.nom}</p>
                      <p className="text-xs text-stone-500">
                        {f.duree % 12 === 0 ? `${f.duree / 12} an(s)` : `${f.duree} mois`} · {f.souscriptions} souscription{f.souscriptions > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="font-bold text-brand">{formatDZD(f.prix)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
