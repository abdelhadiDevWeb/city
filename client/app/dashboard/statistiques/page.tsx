"use client";

import { BadgeCheck, Building, Building2, ChartLine, CircleDollarSign, KeyRound, RefreshCw, Receipt, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDZD } from "@/lib/demo-data";
import { getStats, type Stats } from "@/lib/platform-api";
import { BarList, ColumnChart, DonutChart, LineChart } from "../charts";
import { FormError, PageHeader, Panel, button, card, describeError } from "../ui";

const COLORS = { brand: "#f97316", ink: "#1c1917", stone: "#a8a29e", emerald: "#10b981", red: "#ef4444" };

const monthLabel = (mois: string) => {
  const [year, month] = mois.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, 1)).toLocaleDateString("fr-FR", { month: "short", year: "2-digit", timeZone: "UTC" });
};

function cumulative(start: number, values: number[]): number[] {
  let total = start;
  return values.map((v) => (total += v));
}

function Kpi({ icon: Icon, label, value, hint }: { icon: LucideIcon; label: string; value: string | number; hint?: string }) {
  return (
    <div className={`${card} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export default function StatistiquesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    getStats()
      .then((s) => {
        if (!active) return;
        setStats(s);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ChartLine}
        title="Statistiques"
        subtitle="Vue d'ensemble de la plateforme, calculée en temps réel depuis la base de données."
        actions={
          <button type="button" onClick={() => setVersion((v) => v + 1)} className={button("secondary")}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Actualiser
          </button>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {!stats && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : stats ? (
        <StatsView stats={stats} />
      ) : null}
    </div>
  );
}

function StatsView({ stats }: { stats: Stats }) {
  const { totaux, revenus, baseline, mensuel } = stats;
  const labels = mensuel.map((m) => monthLabel(m.mois));
  const comptes = totaux.admins + totaux.sousAdmins;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Building2} label="Résidences" value={totaux.residences} />
        <Kpi icon={Building} label="Bâtiments" value={totaux.batiments} />
        <Kpi icon={KeyRound} label="Appartements" value={totaux.appartements} hint={`${totaux.appartementsAvecProprietaire} avec propriétaire`} />
        <Kpi icon={ShieldCheck} label="Admins & Sub Admins" value={comptes} hint={`${totaux.admins} admins · ${totaux.sousAdmins} sub admins`} />
        <Kpi icon={Users} label="Utilisateurs" value={totaux.users} />
        <Kpi icon={BadgeCheck} label="Abonnements actifs" value={totaux.souscriptionsActives} hint={`${totaux.souscriptions} au total · ${totaux.formules} formules`} />
        <Kpi icon={CircleDollarSign} label="Revenus encaissés" value={formatDZD(revenus.encaisse)} />
        <Kpi icon={Receipt} label="En attente de paiement" value={formatDZD(revenus.enAttente)} hint={`${totaux.souscriptionsImpayees} abonnement(s) non payé(s)`} />
      </div>

      <Panel title="Croissance de la plateforme (12 derniers mois, cumul)">
        <LineChart
          labels={labels}
          series={[
            { name: "Résidences", color: COLORS.brand, values: cumulative(baseline.residences, mensuel.map((m) => m.residences)) },
            { name: "Bâtiments", color: COLORS.ink, values: cumulative(baseline.batiments, mensuel.map((m) => m.batiments)) },
            { name: "Comptes Admin / Sub Admin", color: COLORS.stone, values: cumulative(baseline.comptes, mensuel.map((m) => m.comptes)) },
          ]}
        />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Revenus des abonnements payés, par mois de début (DZD)">
          <LineChart labels={labels} area unit=" DZD" series={[{ name: "Revenus encaissés", color: COLORS.brand, values: mensuel.map((m) => m.revenus) }]} />
        </Panel>
        <Panel title="Abonnements par mois de début">
          <ColumnChart labels={labels} values={mensuel.map((m) => m.souscriptions)} color={COLORS.ink} name="Nouveaux abonnements" />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Statut de paiement des abonnements">
          <DonutChart
            centerLabel="abonnements"
            segments={[
              { label: "Payés", value: totaux.souscriptionsPayees, color: COLORS.emerald },
              { label: "Non payés", value: totaux.souscriptionsImpayees, color: COLORS.red },
            ]}
          />
        </Panel>
        <Panel title="Comptes par rôle">
          <DonutChart
            centerLabel="comptes"
            segments={[
              { label: "Super Admins", value: totaux.superAdmins, color: COLORS.brand },
              { label: "Admins", value: totaux.admins, color: COLORS.ink },
              { label: "Sub Admins", value: totaux.sousAdmins, color: COLORS.stone },
            ]}
          />
        </Panel>
        <Panel title="Occupation des appartements">
          <DonutChart
            centerLabel="appartements"
            segments={[
              { label: "Avec propriétaire", value: totaux.appartementsAvecProprietaire, color: COLORS.brand },
              { label: "Sans propriétaire", value: totaux.appartements - totaux.appartementsAvecProprietaire, color: COLORS.stone },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Bâtiments par résidence">
          <BarList items={stats.batimentsParResidence.map((r) => ({ label: r.nom, value: r.batiments }))} empty="Aucune résidence pour le moment." />
        </Panel>
        <Panel title="Abonnements par formule">
          <BarList items={stats.abonnementsParFormule.map((f) => ({ label: f.nom, value: f.souscriptions }))} empty="Aucune formule d'abonnement pour le moment." />
        </Panel>
      </div>
    </>
  );
}
