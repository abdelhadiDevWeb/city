"use client";

import { ArrowDownRight, CalendarDays, FileText, NotebookText, Phone, Plus, TriangleAlert, Wallet } from "lucide-react";
import { useState } from "react";
import {
  depenses,
  factures,
  formatDZD,
  impayes,
  paiements,
  recouvrement,
  type Depense,
  type Facture,
  type Impaye,
  type Paiement,
} from "@/lib/demo-data";
import { DEMO_NOTICE, DataTable, Mono, PageHeader, Pill, Tabs, button, card, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "impayes" | "journal" | "depenses" | "factures";

const TABS: TabItem<TabId>[] = [
  { id: "impayes", label: "Impayés & Recouvrement", icon: TriangleAlert, count: impayes.length },
  { id: "journal", label: "Journal des Paiements", icon: NotebookText, count: paiements.length },
  { id: "depenses", label: "Dépenses Résidence", icon: ArrowDownRight, count: depenses.length },
  { id: "factures", label: "Factures Services & Sonelgaz", icon: FileText, count: factures.length },
];

const FACTURE_TONE: Record<Facture["statut"], Tone> = { Payée: "success", "À payer": "warning", "En retard": "danger" };

function monthsTone(months: number): Tone {
  if (months >= 3) return "danger";
  if (months === 2) return "warning";
  return "neutral";
}

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
const currentMonth = recouvrement.periode.split(" ")[0];

export default function FinancesPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("impayes");

  const impayeColumns: Column<Impaye>[] = [
    {
      header: "Logement & Bâtiment",
      cell: (r) => (
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
          {r.logement}
        </span>
      ),
    },
    { header: "Résident", cell: (r) => <span className="font-semibold text-ink">{r.resident}</span> },
    { header: "Contact", cell: (r) => <Mono>{r.telephone}</Mono> },
    { header: "Mois impayés", cell: (r) => <Pill tone={monthsTone(r.moisImpayes)}>{r.moisImpayes} Mois de retard</Pill> },
    { header: "Dernier règlement", cell: (r) => <span className="text-stone-500">{r.dernierReglement}</span> },
    { header: "Total dû", cell: (r) => <Mono strong>{formatDZD(r.totalDu)}</Mono> },
    {
      header: "Action rapide",
      align: "right",
      cell: (r) => (
        <span className="inline-flex gap-2">
          <button type="button" onClick={() => notify(`Encaisser ${formatDZD(r.totalDu)} (${r.logement}) — ${DEMO_NOTICE}`)} className={button("primary", "sm")}>
            Encaisser
          </button>
          <button type="button" onClick={() => notify(`Rappel à ${r.resident} — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
            <Phone className="h-3.5 w-3.5" aria-hidden />
            Rappeler
          </button>
        </span>
      ),
    },
  ];

  const paiementColumns: Column<Paiement>[] = [
    { header: "Date", cell: (p) => <span className="text-stone-500">{p.date}</span> },
    { header: "Logement", cell: (p) => <span className="font-semibold text-ink">{p.logement}</span> },
    { header: "Résident", cell: (p) => p.resident },
    { header: "Mode", cell: (p) => <Pill tone={p.mode === "Edahabia" ? "brand" : "neutral"}>{p.mode}</Pill> },
    { header: "Référence", cell: (p) => <Mono>{p.reference}</Mono> },
    { header: "Montant", align: "right", cell: (p) => <Mono strong>+{formatDZD(p.montant)}</Mono> },
  ];

  const depenseColumns: Column<Depense>[] = [
    { header: "Date", cell: (d) => <span className="text-stone-500">{d.date}</span> },
    { header: "Catégorie", cell: (d) => <Pill>{d.categorie}</Pill> },
    { header: "Fournisseur", cell: (d) => <span className="font-semibold text-ink">{d.fournisseur}</span> },
    { header: "Description", cell: (d) => d.description },
    { header: "Statut", cell: (d) => <Pill tone={d.statut === "Payée" ? "success" : "warning"}>{d.statut}</Pill> },
    { header: "Montant", align: "right", cell: (d) => <Mono strong>{formatDZD(d.montant)}</Mono> },
  ];

  const factureColumns: Column<Facture>[] = [
    {
      header: "Fournisseur",
      cell: (f) => (
        <span>
          <span className="block font-semibold text-ink">{f.fournisseur}</span>
          <span className="block text-xs text-stone-500">{f.service}</span>
        </span>
      ),
    },
    { header: "Période", cell: (f) => f.periode },
    { header: "Échéance", cell: (f) => <span className="text-stone-500">{f.echeance}</span> },
    { header: "Statut", cell: (f) => <Pill tone={FACTURE_TONE[f.statut]}>{f.statut}</Pill> },
    { header: "Montant", cell: (f) => <Mono strong>{formatDZD(f.montant)}</Mono> },
    {
      header: "Action",
      align: "right",
      cell: (f) =>
        f.statut === "Payée" ? (
          <button type="button" onClick={() => notify(`Reçu ${f.fournisseur} — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
            Voir le reçu
          </button>
        ) : (
          <button type="button" onClick={() => notify(`Payer ${formatDZD(f.montant)} à ${f.fournisseur} — ${DEMO_NOTICE}`)} className={button("primary", "sm")}>
            Payer
          </button>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wallet}
        title="Gestion Financière & Recouvrement"
        subtitle="Suivi des charges communes, encaissements Edahabia/CCP, impayés et dépenses de la résidence"
        actions={
          <>
            <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("secondary")}>
              <CalendarDays className="h-4 w-4" aria-hidden />
              Générer Charges {currentMonth}
            </button>
            <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Enregistrer Paiement
            </button>
          </>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "impayes" && (
        <div className="space-y-4">
          <div className={`${card} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-brand">
                <TriangleAlert className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{impayes.length} Logements présentent des retards de paiement</p>
                <p className="mt-0.5 text-xs text-stone-500">Les impayés sont calculés automatiquement en fonction des charges non acquittées.</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Total créances</p>
              <p className="font-mono text-xl font-bold text-ink">{formatDZD(sum(impayes.map((r) => r.totalDu)))}</p>
            </div>
          </div>
          <DataTable columns={impayeColumns} rows={impayes} rowKey={(r) => r.id} empty="Aucun impayé : tous les logements sont à jour." />
        </div>
      )}

      {tab === "journal" && (
        <div className="space-y-4">
          <SummaryStrip label="Total encaissé" value={formatDZD(sum(paiements.map((p) => p.montant)))} hint={`${paiements.length} paiements enregistrés`} />
          <DataTable columns={paiementColumns} rows={paiements} rowKey={(p) => p.id} />
        </div>
      )}

      {tab === "depenses" && (
        <div className="space-y-4">
          <SummaryStrip label="Total dépenses" value={formatDZD(sum(depenses.map((d) => d.montant)))} hint={`${depenses.filter((d) => d.statut === "En attente").length} dépense en attente de règlement`} />
          <DataTable columns={depenseColumns} rows={depenses} rowKey={(d) => d.id} />
        </div>
      )}

      {tab === "factures" && (
        <div className="space-y-4">
          <SummaryStrip
            label="Reste à payer"
            value={formatDZD(sum(factures.filter((f) => f.statut !== "Payée").map((f) => f.montant)))}
            hint={`${factures.filter((f) => f.statut === "En retard").length} facture en retard`}
          />
          <DataTable columns={factureColumns} rows={factures} rowKey={(f) => f.id} />
        </div>
      )}
    </div>
  );
}

function SummaryStrip({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className={`${card} flex flex-wrap items-center justify-between gap-3 px-5 py-4`}>
      <p className="text-xs text-stone-500">{hint}</p>
      <p className="text-right">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-stone-500">{label}</span>
        <span className="font-mono text-lg font-bold text-ink">{value}</span>
      </p>
    </div>
  );
}
