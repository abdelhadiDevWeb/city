"use client";

import { BellRing, CalendarDays, Megaphone, Pin, Plus, Send, UsersRound } from "lucide-react";
import { useState } from "react";
import { alertes, annonces } from "@/lib/demo-data";
import { ALERT_STYLES, DEMO_NOTICE, PageHeader, Pill, Tabs, button, card, useToast, type TabItem } from "../ui";

type TabId = "annonces" | "alertes";

const TABS: TabItem<TabId>[] = [
  { id: "annonces", label: "Annonces publiées", icon: Megaphone, count: annonces.length },
  { id: "alertes", label: "Alertes système", icon: BellRing, count: alertes.length },
];

export default function AnnoncesPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("annonces");

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Megaphone}
        title="Annonces & Alertes"
        subtitle="Communication avec les résidents par SMS, application et affichage"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Annonce
          </button>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "annonces" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {annonces.map((a) => (
            <article key={a.id} className={`${card} flex flex-col p-5 ${a.epinglee ? "ring-1 ring-orange-200" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-ink">{a.titre}</h3>
                {a.epinglee && (
                  <Pill tone="brand">
                    <Pin className="h-3 w-3" aria-hidden />
                    Épinglée
                  </Pill>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{a.contenu}</p>
              <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
                <p className="flex items-center gap-2">
                  <UsersRound className="h-3.5 w-3.5" aria-hidden />
                  {a.audience}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {a.date}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="flex flex-wrap gap-1.5">
                    {a.canaux.map((c) => (
                      <Pill key={c}>{c}</Pill>
                    ))}
                  </span>
                  <button type="button" onClick={() => notify(`Renvoyer « ${a.titre} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Renvoyer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "alertes" && (
        <ul className="space-y-3">
          {alertes.map((a) => {
            const { icon: Icon, className, label } = ALERT_STYLES[a.niveau];
            return (
              <li key={a.id} className={`${card} flex items-start gap-4 p-4`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{a.titre}</p>
                    <Pill tone={a.niveau === "critique" ? "danger" : a.niveau === "attention" ? "warning" : "neutral"}>{label}</Pill>
                  </div>
                  <p className="mt-0.5 text-sm text-stone-500">{a.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-stone-400">{a.date}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
