"use client";

import {
  BadgeCheck,
  Building,
  Building2,
  Calendar,
  ChartColumn,
  ChartLine,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock,
  CreditCard,
  FileSpreadsheet,
  FolderOpen,
  LayoutDashboard,
  Layers,
  MapPin,
  Megaphone,
  Plus,
  Receipt,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  ShieldPlus,
  SlidersHorizontal,
  TriangleAlert,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
  Wallet,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDZD } from "@/lib/format";
import { getPersonnel, type PersonnelData } from "@/lib/personnel-api";
import { getStats, listFormules, type Formule, type Stats } from "@/lib/platform-api";
import { listResidences, listResidents, type ResidenceSummary, type Resident } from "@/lib/residences-api";
import { ROLE_BADGE, ROLE_LABELS, displayName } from "@/lib/roles";
import { useSession } from "./session";
import { useI18n } from "@/lib/i18n";
import { SkeletonDashboard } from "./skeletons";
import { FormError, Mono, Panel, Pill, ProgressBar, button, card, describeError } from "./ui";

export function SuperAdminOverview() {
  const { account } = useSession();
  const { t, tText, locale, isRTL, formatCurrency } = useI18n();
  const [residences, setResidences] = useState<ResidenceSummary[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [formules, setFormules] = useState<Formule[] | null>(null);
  const [residents, setResidents] = useState<Resident[] | null>(null);
  const [personnel, setPersonnel] = useState<PersonnelData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      listResidences(),
      getStats(),
      listFormules(),
      listResidents(),
      getPersonnel(),
    ])
      .then(([resList, statsData, formulesData, residentsData, personnelData]) => {
        if (!active) return;
        if (resList.status === "fulfilled") setResidences(resList.value);
        if (statsData.status === "fulfilled") setStats(statsData.value);
        if (formulesData.status === "fulfilled") setFormules(formulesData.value);
        if (residentsData.status === "fulfilled") setResidents(residentsData.value);
        if (personnelData.status === "fulfilled") setPersonnel(personnelData.value);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!residences && !stats && !error) {
    return <SkeletonDashboard />;
  }

  const list = residences ?? [];
  const withoutAdmin = list.filter((r) => !r.admin);
  const totalBatiments = stats?.totaux.batiments ?? list.reduce((sum, r) => sum + r.batiments, 0);
  const totalAppartements = stats?.totaux.appartements ?? 0;
  const totalOccupes = stats?.totaux.appartementsAvecProprietaire ?? (residents ? residents.length : 0);
  const totalAdmins = stats?.totaux.admins ?? list.filter((r) => r.admin).length;
  const totalSousAdmins = stats?.totaux.sousAdmins ?? 0;
  const totalSouscriptions = stats?.totaux.souscriptionsActives ?? 0;
  const totalImpayees = stats?.totaux.souscriptionsImpayees ?? 0;
  const totalEncaisse = stats?.revenus.encaisse ?? 0;
  const totalEnAttente = stats?.revenus.enAttente ?? 0;

  // 4 Top Executive SaaS KPIs
  const kpis = [
    {
      label: "Résidences & Bâtiments",
      value: `${list.length} résidences`,
      hint: `${totalBatiments} bâtiments · ${totalAppartements || "—"} appartements`,
      icon: Building2,
      tone: "brand",
    },
    {
      label: "Responsables & Syndics",
      value: `${totalAdmins} admins`,
      hint: withoutAdmin.length > 0 ? `${withoutAdmin.length} résidence(s) sans admin` : `${totalSousAdmins} sous-admins de bâtiments`,
      icon: ShieldCheck,
      tone: withoutAdmin.length > 0 ? "warning" : "brand",
      alert: withoutAdmin.length > 0,
    },
    {
      label: "Abonnements Actifs (1 an)",
      value: stats ? `${totalSouscriptions} actifs` : "—",
      hint: totalImpayees > 0 ? `${totalImpayees} abonnement(s) en attente` : "Durée standard 1 an · Paiement flexible",
      icon: BadgeCheck,
      tone: "success",
      alert: totalImpayees > 0,
    },
    {
      label: "Revenus Consolidés Plateforme",
      value: stats ? formatDZD(totalEncaisse) : "—",
      hint: totalEnAttente > 0 ? `${formatDZD(totalEnAttente)} en attente` : "Comptabilité SaaS à jour",
      icon: CircleDollarSign,
      tone: "brand",
    },
  ];

  // The 8 Super Admin Pages Grid Modules
  const modules = [
    {
      title: "Résidences & Bâtiments",
      route: "/dashboard/ajouter-residence",
      icon: Building2,
      badge: `${list.length} résidences`,
      description: "Création des complexes, plafonds de bâtiments et affectation des administrateurs principaux.",
      meta: `${totalBatiments} bâtiments gérés`,
      color: "bg-orange-50 text-brand border-orange-100",
    },
    {
      title: "Abonnements & Formules",
      route: "/dashboard/abonnements",
      icon: CreditCard,
      badge: `${formules?.length ?? 0} formules`,
      description: "Validation des paiements annuels (1 an standard, flexible), formules Admin et Sous-Admin.",
      meta: `${totalSouscriptions} souscriptions actives`,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Copropriétaires & Résidents",
      route: "/dashboard/residents",
      icon: Users,
      badge: `${residents?.length ?? totalOccupes} résidents`,
      description: "Annuaire global de tous les résidents inscrits, propriétaires, clés temporaires et affectations.",
      meta: `${totalOccupes} logements occupés`,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Personnel & Intervenants",
      route: "/dashboard/personnel",
      icon: UserCog,
      badge: `${personnel?.personnel.length ?? 0} agents`,
      description: "Supervision des gardiens, concierges, techniciens de maintenance et registre des tâches globales.",
      meta: `${personnel?.taches.length ?? 0} tâches assignées`,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Assemblées Générales (AG)",
      route: "/dashboard/assemblees",
      icon: ScrollText,
      badge: "Session 2026",
      description: "Supervision des votes en ligne des copropriétaires, suivi du quorum des tantièmes et certification PV.",
      meta: "Quorum 74.5% tantièmes atteint",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Statistiques & Croissance",
      route: "/dashboard/statistiques",
      icon: ChartLine,
      badge: "+100% rétention",
      description: "Évolution mensuelle du parc, projection de croissance, répartition géographique des résidences.",
      meta: "Chiffre d'affaires & métriques SaaS",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Rapports & Exports SaaS",
      route: "/dashboard/rapports",
      icon: ChartColumn,
      badge: "Exports CSV & Print",
      description: "Téléchargement consolidé des journaux financiers, bilans annuels et registre complet des copropriétaires.",
      meta: "Périodes personnalisables",
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      title: "Équipe Super Admin & Accès",
      route: "/dashboard/profil",
      icon: ShieldPlus,
      badge: `${stats?.totaux.superAdmins ?? 1} Super Admin(s)`,
      description: "Gestion des comptes maîtres plateforme, journaux d'audit de sécurité et clés de chiffrement.",
      meta: "Droits d'accès totaux",
      color: "bg-stone-100 text-stone-700 border-stone-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
              Direction Plateforme SaaS
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE.super_admin}`}>
              {ROLE_LABELS.super_admin}
            </span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-ink">{t.dashboard.superAdminTitle}</h1>
          <p className="mt-1.5 text-sm text-stone-500 max-w-2xl">
            Supervision 360° du parc multi-résidences, des formules d&apos;abonnement annuelles (1 an standard avec paiement flexible),
            des copropriétaires, du personnel et de la comptabilité générale.
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-600">
            Connecté en tant que <span className="font-semibold text-ink">{displayName(account)}</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">Accès maître plateforme actif</span>
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/rapports" className={button("secondary")}>
            <ChartColumn className="h-4 w-4" aria-hidden />
            Rapports Consolidés
          </Link>
          <Link href="/dashboard/abonnements" className={button("secondary")}>
            <CreditCard className="h-4 w-4" aria-hidden />
            Formules & Tarifs
          </Link>
          <Link href="/dashboard/ajouter-residence" className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Résidence
          </Link>
        </div>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      {/* 2. Top 4 Executive KPI Hero Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, alert, tone }) => (
          <div key={label} className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{label}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  alert ? "bg-amber-50 text-amber-600" : tone === "success" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-brand"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{residences ? value : "—"}</p>
            {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
          </div>
        ))}
      </div>

      {/* 3. The 8 Platform Modules Hub (Direct 360° Page View) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{t.dashboard.modulesHubTitle}</h2>
            <p className="text-xs text-stone-500">{t.dashboard.modulesHubSubtitle}</p>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {locale === "ar" ? "8 صفحات نشطة" : locale === "en" ? "8 active pages" : "8 pages actives"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.route}
                href={m.route}
                className={`${card} group flex flex-col justify-between p-5 transition hover:border-brand/40 hover:shadow-xs`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${m.color}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <Pill tone="brand">{tText(m.badge)}</Pill>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-ink group-hover:text-brand transition">{tText(m.title)}</h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">{tText(m.description)}</p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                  <span className="font-semibold text-stone-600">{tText(m.meta)}</span>
                  <span className="flex items-center gap-1 font-semibold text-brand group-hover:translate-x-0.5 transition">
                    {tText("Ouvrir")}
                    <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Detailed Live Workspaces */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Panel 1: Dernières résidences créées */}
        <div className="lg:col-span-2">
          <Panel
            title="Dernières résidences créées & Statut Administrateur"
            badge={
              <Link href="/dashboard/ajouter-residence" className="text-xs font-semibold text-brand hover:underline">
                Tout gérer ({list.length}) →
              </Link>
            }
          >
            {residences && list.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-500">Aucune résidence enregistrée pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="pb-3">Résidence</th>
                      <th className="pb-3">Localisation</th>
                      <th className="pb-3">Bâtiments</th>
                      <th className="pb-3">Administrateur</th>
                      <th className="pb-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {list.slice(0, 6).map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/60 transition">
                        <td className="py-3 font-semibold text-ink">
                          <Link href={`/dashboard/ajouter-residence?id=${r.id}`} className="hover:text-brand">
                            {r.nom}
                          </Link>
                        </td>
                        <td className="py-3 text-stone-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0 text-stone-400" aria-hidden />
                          {r.localisation}
                        </td>
                        <td className="py-3 text-stone-600 font-medium">
                          {r.batiments} bâtiment{r.batiments > 1 ? "s" : ""}
                        </td>
                        <td className="py-3">
                          {r.admin ? (
                            <Pill tone="dark">{`${r.admin.prenom} ${r.admin.nom}`}</Pill>
                          ) : (
                            <Pill tone="warning">Sans admin</Pill>
                          )}
                        </td>
                        <td className="py-3 text-end">
                          <Link
                            href={`/dashboard/ajouter-residence?id=${r.id}`}
                            className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                          >
                            Gérer
                            <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        {/* Panel 2: Formules d'abonnements & Standard 1 an */}
        <div>
          <Panel
            title="Formules d'abonnements (1 an standard)"
            badge={
              <Link href="/dashboard/abonnements" className="text-xs font-semibold text-brand hover:underline">
                Gérer →
              </Link>
            }
          >
            <div className="mb-3 rounded-xl border border-stone-100 bg-stone-50 p-2.5 text-xs text-stone-600">
              <span className="font-semibold text-ink">Standard 1 an :</span> Les contrats d&apos;abonnement durent 12 mois avec paiement flexible (CIB, Edahabia, Virement ou Chèque).
            </div>

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

            <div className="mt-4 border-t border-stone-100 pt-3">
              <Link
                href="/dashboard/abonnements"
                className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand"
              >
                <span>Valider les abonnements en attente ({totalImpayees})</span>
                <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </Panel>
        </div>
      </div>

      {/* 5. Additional Executive Row: Assemblées Générales & Gouvernance Consolidée */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assemblées Panel */}
        <section className={`${card} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <ScrollText className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink">Gouvernance & Assemblées Générales (AG)</h3>
                <p className="text-xs text-stone-500">Suivi des sessions ordinaires & extraordinaires dans les résidences</p>
              </div>
            </div>
            <Link href="/dashboard/assemblees" className="text-xs font-semibold text-brand hover:underline">
              Consulter l&apos;AG →
            </Link>
          </div>

          <div className="my-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Session Actuelle</span>
                <Pill tone="brand">En cours</Pill>
              </div>
              <p className="mt-2 font-bold text-ink">Assemblée Générale Ordinaire Annuelle (2026)</p>
              <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden /> 20 Novembre 2026 · Hall d&apos;Honneur & Salle Polyvalente
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1">
                  <span>Quorum des tantièmes</span>
                  <span className="text-emerald-600">745 / 1000 (74.5%)</span>
                </div>
                <ProgressBar value={74.5} label="Quorum tantièmes" />
              </div>
            </div>

            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Résolutions & Délibérations</span>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  8 résolutions soumises au vote des copropriétaires (approbation des comptes, budget prévisionnel N+1, travaux digicode, fonds de travaux).
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-stone-200/60 pt-3">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  PV d&apos;AG certifié conforme
                </span>
                <Link href="/dashboard/assemblees" className="text-xs font-bold text-brand hover:underline">
                  Mode Vidéoprojection →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Rapports & Exports SaaS Quick Box */}
        <section className={`${card} flex flex-col justify-between p-5`}>
          <div>
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <ChartColumn className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-bold text-ink">Rapports & Exports</h3>
                <p className="text-xs text-stone-500">Extraction comptable consolidée</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-stone-600 leading-relaxed">
              Exportez instantanément les données complètes de la plateforme par période personnalisée : journal des règlements,
              balances financières, effectifs et listing exhaustif des copropriétaires.
            </p>
          </div>

          <div className="mt-4 space-y-2 border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/rapports"
              className="flex w-full items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-ink hover:border-brand/40 hover:bg-stone-50 transition"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" aria-hidden />
                Journal Financier Global (.CSV)
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400 rtl:rotate-180" aria-hidden />
            </Link>
            <Link
              href="/dashboard/rapports"
              className="flex w-full items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-ink hover:border-brand/40 hover:bg-stone-50 transition"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" aria-hidden />
                Registre National des Résidents
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-stone-400 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
