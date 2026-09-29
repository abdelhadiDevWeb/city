"use client";

import { Clock, ListChecks, Phone, Plus, UserCog, UsersRound } from "lucide-react";
import { useState } from "react";
import { personnel, taches, type Employe, type Tache } from "@/lib/demo-data";
import { Avatar, DEMO_NOTICE, DataTable, Mono, PageHeader, Pill, Tabs, button, card, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "taches" | "personnel";

const TABS: TabItem<TabId>[] = [
  { id: "taches", label: "Tâches", icon: ListChecks, count: taches.filter((t) => t.statut !== "Terminée").length },
  { id: "personnel", label: "Personnel", icon: UsersRound, count: personnel.length },
];

const TACHE_TONE: Record<Tache["statut"], Tone> = { "À faire": "neutral", "En cours": "brand", Terminée: "success" };
const EMPLOYE_TONE: Record<Employe["statut"], Tone> = { "En service": "success", Repos: "neutral", Congé: "warning" };

export default function PersonnelPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("taches");

  const tacheColumns: Column<Tache>[] = [
    {
      header: "Tâche",
      cell: (t) => (
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink">{t.titre}</span>
          {t.urgente && <Pill tone="danger">Urgente</Pill>}
        </span>
      ),
    },
    { header: "Assignée à", cell: (t) => t.assigneA },
    { header: "Lieu", cell: (t) => t.lieu },
    { header: "Échéance", cell: (t) => <span className="text-stone-500">{t.echeance}</span> },
    { header: "Statut", cell: (t) => <Pill tone={TACHE_TONE[t.statut]}>{t.statut}</Pill> },
    {
      header: "Action",
      align: "right",
      cell: (t) => (
        <button type="button" onClick={() => notify(`« ${t.titre} » terminée — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          Marquer terminée
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCog}
        title="Personnel & Tâches"
        subtitle="Équipe de la résidence, horaires et suivi des tâches assignées"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Tâche
          </button>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "taches" && <DataTable columns={tacheColumns} rows={taches} rowKey={(t) => t.id} empty="Aucune tâche en cours." />}

      {tab === "personnel" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {personnel.map((e) => (
            <article key={e.id} className={`${card} flex flex-col p-5`}>
              <div className="flex items-start justify-between gap-2">
                <Avatar name={e.nom} size="lg" />
                <Pill tone={EMPLOYE_TONE[e.statut]}>{e.statut}</Pill>
              </div>
              <p className="mt-4 font-bold text-ink">{e.nom}</p>
              <p className="text-xs text-stone-500">{e.poste}</p>
              <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
                <p className="flex items-center gap-2 text-stone-600">
                  <Phone className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                  <Mono>{e.telephone}</Mono>
                </p>
                <p className="flex items-center gap-2 text-stone-600">
                  <Clock className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                  {e.horaire}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
