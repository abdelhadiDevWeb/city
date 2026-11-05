"use client";

import { useI18n } from "@/lib/i18n";
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
  const { tText, locale, formatCurrency } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const alerts: SmartAlert[] = [];

  if (impayesCount > 0) {
    alerts.push({
      id: "alert-impayes",
      type: "danger",
      title: locale === "ar"
        ? `${impayesCount} متأخرات اشتراكات معلقة (${formatCurrency(totalImpayes)})`
        : locale === "en"
        ? `${impayesCount} overdue charge(s) pending (${formatCurrency(totalImpayes)})`
        : `${impayesCount} retard(s) de charges en souffrance (${formatCurrency(totalImpayes)})`,
      description: locale === "ar"
        ? "يمكنك الآن إصدار إعذارات رسمية (15 يوماً) وإرسال تذكيرات عبر واتساب فوراً."
        : locale === "en"
        ? "Official formal notices (15 days) and WhatsApp reminders can be generated immediately."
        : "Des mises en demeure officielles (sommation 15 jours) et relances WhatsApp peuvent être générées immédiatement.",
      actionLabel: locale === "ar" ? "بدء التحصيل" : locale === "en" ? "Start recovery" : "Lancer le recouvrement",
      actionHref: "/dashboard/finances",
      icon: ShieldAlert,
      count: impayesCount,
    });
  }

  if (pannesCount > 0) {
    alerts.push({
      id: "alert-pannes",
      type: "warning",
      title: locale === "ar"
        ? `${pannesCount} عطل في التجهيزات قيد المتابعة`
        : locale === "en"
        ? `${pannesCount} active critical equipment failure(s)`
        : `${pannesCount} panne(s) d'équipement critique active(s)`,
      description: pannesSummary
        ? `${locale === "ar" ? "التجهيزات المعنية :" : locale === "en" ? "Equipments concerned:" : "Équipements concernés :"} ${pannesSummary}.`
        : locale === "ar" ? "تدخل عاجل مطلوب لإصلاح التجهيزات المشتركة." : locale === "en" ? "Priority maintenance required to restore common facilities." : "Intervention prioritaire requise pour rétablir les équipements communs.",
      actionLabel: locale === "ar" ? "إدارة الصيانة" : locale === "en" ? "Manage maintenance" : "Gérer la maintenance",
      actionHref: "/dashboard/maintenance",
      icon: Siren,
      count: pannesCount,
    });
  }

  if (contratsExpirantCount > 0) {
    alerts.push({
      id: "alert-contrats",
      type: "warning",
      title: locale === "ar"
        ? `${contratsExpirantCount} عقود صيانة تشارف على الانتهاء`
        : locale === "en"
        ? `${contratsExpirantCount} contractor contract(s) expiring soon`
        : `${contratsExpirantCount} contrat(s) prestataire arrivant à échéance`,
      description: locale === "ar"
        ? "تجديد العقود لتفادي أي انقطاع في الخدمات المشتركة (المصاعد، النظافة، خزان المياه)."
        : locale === "en"
        ? "Renewal required to avoid service disruption (elevators, cleaning, water tanks)."
        : "Renouvellement à négocier pour éviter toute interruption de service (ascenseur, nettoyage ou bâche).",
      actionLabel: locale === "ar" ? "عرض العقود" : locale === "en" ? "View contracts" : "Voir les contrats",
      actionHref: "/dashboard/documents",
      icon: FileSignature,
      count: contratsExpirantCount,
    });
  }

  // AG banner
  alerts.push({
    id: "alert-ag",
    type: "info",
    title: locale === "ar"
      ? `الجمعية العامة القادمة مبرمجة بتاريخ ${agDate}`
      : locale === "en"
      ? `Next General Assembly (GA) scheduled for ${agDate}`
      : `Prochaine Assemblée Générale (AG) planifiée le ${agDate}`,
    description: locale === "ar"
      ? `اكتمل نصاب الحصص بنسبة ${agQuorumPct}% (745/1000 حصة). القرارات جاهزة للتصويت.`
      : locale === "en"
      ? `Quorum reached at ${agQuorumPct}% (745/1000 shares). Resolutions are ready for voting.`
      : `Quorum des tantièmes réuni à ${agQuorumPct}% (745/1000 tantièmes). Les résolutions sont prêtes pour le vote.`,
    actionLabel: locale === "ar" ? "الانتقال إلى الجمعية العامة والتصويت" : locale === "en" ? "Access GA & Votes" : "Accéder à l'AG & Votes",
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
            {tText("RUBAN D'ALERTES INTELLIGENTES DU SYNDIC")}
          </span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
            {alerts.length} {tText("point(s) d'attention")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-stone-500 hover:bg-stone-200/50 hover:text-ink font-medium"
            title={collapsed ? tText("Déplier") : tText("Replier")}
          >
            <span>{collapsed ? tText("Déplier") : tText("Replier")}</span>
            {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200/50 hover:text-ink"
            title={tText("Masquer le ruban pour cette session")}
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
                    <span>{tText(alert.actionLabel)}</span>
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
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

