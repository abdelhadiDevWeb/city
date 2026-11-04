"use client";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileSignature,
  Receipt,
  Scale,
  ScrollText,
  ShieldAlert,
  Siren,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDZD } from "@/lib/format";

export type SmartAlert = {
  id: string;
  type: "danger" | "warning" | "info" | "success";
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  icon: typeof Siren;
  count?: number;
};

export function SmartActionCenter({
  impayesCount = 0,
  totalImpayes = 0,
  pannesCount = 0,
  pannesSummary = "",
  contratsExpirantCount = 0,
  agDate = "20 Novembre 2026",
  agQuorumPct = 74.5,
}: {
  impayesCount?: number;
  totalImpayes?: number;
  pannesCount?: number;
  pannesSummary?: string;
  contratsExpirantCount?: number;
  agDate?: string;
  agQuorumPct?: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const alerts: SmartAlert[] = [];

  if (impayesCount > 0) {
    alerts.push({
      id: "alert-impayes",
      type: "danger",
      title: `${impayesCount} retard(s) de charges en souffrance (${formatDZD(totalImpayes)})`,
      description: "Des mises en demeure officielles (sommation 15 jours) et relances WhatsApp peuvent être générées immédiatement.",
      actionLabel: "Lancer le recouvrement",
      actionHref: "/dashboard/finances",
      icon: ShieldAlert,
      count: impayesCount,
    });
  }

  if (pannesCount > 0) {
    alerts.push({
      id: "alert-pannes",
      type: "warning",
      title: `${pannesCount} panne(s) d'équipement critique active(s)`,
      description: pannesSummary ? `Équipements concernés : ${pannesSummary}. Prestataires à relancer.` : "Intervention prioritaire requise pour rétablir les équipements communs.",
      actionLabel: "Gérer la maintenance",
      actionHref: "/dashboard/maintenance",
      icon: Siren,
      count: pannesCount,
    });
  }

  if (contratsExpirantCount > 0) {
    alerts.push({
      id: "alert-contrats",
      type: "warning",
      title: `${contratsExpirantCount} contrat(s) prestataire arrivant à échéance`,
      description: "Renouvellement à négocier pour éviter toute interruption de service (ascenseur, nettoyage ou bâche).",
      actionLabel: "Voir les contrats",
      actionHref: "/dashboard/documents",
      icon: FileSignature,
      count: contratsExpirantCount,
    });
  }

  // AG banner
  alerts.push({
    id: "alert-ag",
    type: "info",
    title: `Prochaine Assemblée Générale (AG) planifiée le ${agDate}`,
    description: `Quorum des tantièmes réuni à ${agQuorumPct}% (745/1000 tantièmes). Les résolutions sont prêtes pour le vote.`,
    actionLabel: "Accéder à l'AG & Votes",
    actionHref: "/dashboard/assemblees",
    icon: ScrollText,
  });

  const STYLE_BY_TYPE = {
    danger: {
      badge: "border-red-200 bg-red-50 text-red-700",
      iconBg: "bg-red-100 text-red-700",
      button: "border border-red-300 bg-red-50 text-red-800 hover:bg-red-100",
    },
    warning: {
      badge: "border-amber-200 bg-amber-50 text-amber-800",
      iconBg: "bg-amber-100 text-amber-800",
      button: "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100",
    },
    info: {
      badge: "border-blue-200 bg-blue-50 text-blue-800",
      iconBg: "bg-blue-100 text-blue-700",
      button: "border border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100",
    },
    success: {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
      iconBg: "bg-emerald-100 text-emerald-700",
      button: "border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100",
    },
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
      {/* Strip Header */}
      <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/80 px-5 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-brand">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="font-extrabold uppercase tracking-wide text-ink">
            Ruban d&apos;Alertes Intelligentes du Syndic
          </span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
            {alerts.length} point(s) d&apos;attention
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-stone-500 hover:bg-stone-200/50 hover:text-ink font-medium"
            title={collapsed ? "Déplier le ruban" : "Replier le ruban"}
          >
            <span>{collapsed ? "Déplier" : "Replier"}</span>
            {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200/50 hover:text-ink"
            title="Masquer le ruban pour cette session"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Alerts Content */}
      {!collapsed && (
        <div className="divide-y divide-stone-100 p-2">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            const style = STYLE_BY_TYPE[alert.type];
            return (
              <div
                key={alert.id}
                className="flex flex-col gap-3 p-3 transition sm:flex-row sm:items-center sm:justify-between hover:bg-stone-50/70 rounded-xl"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink text-xs">{alert.title}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-500 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  <Link
                    href={alert.actionHref}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition ${style.button}`}
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

