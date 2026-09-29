"use client";

import { Download, FileSignature, FileText, FolderOpen, Upload } from "lucide-react";
import { useState } from "react";
import { contrats, documentsResidence, formatDZD, type Contrat, type DocumentResidence } from "@/lib/demo-data";
import { DEMO_NOTICE, DataTable, Mono, PageHeader, Pill, Tabs, button, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "contrats" | "documents";

const TABS: TabItem<TabId>[] = [
  { id: "contrats", label: "Contrats prestataires", icon: FileSignature, count: contrats.length },
  { id: "documents", label: "Documents résidence", icon: FileText, count: documentsResidence.length },
];

const CONTRAT_TONE: Record<Contrat["statut"], Tone> = { Actif: "success", "Expire bientôt": "warning", Expiré: "danger" };

export default function DocumentsPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("contrats");

  const contratColumns: Column<Contrat>[] = [
    { header: "Objet", cell: (c) => <span className="font-semibold text-ink">{c.objet}</span> },
    { header: "Prestataire", cell: (c) => c.prestataire },
    { header: "Début", cell: (c) => <span className="text-stone-500">{c.debut}</span> },
    { header: "Fin", cell: (c) => <span className="text-stone-500">{c.fin}</span> },
    { header: "Statut", cell: (c) => <Pill tone={CONTRAT_TONE[c.statut]}>{c.statut}</Pill> },
    { header: "Montant annuel", align: "right", cell: (c) => <Mono strong>{formatDZD(c.montantAnnuel)}</Mono> },
    {
      header: "Action",
      align: "right",
      cell: (c) => (
        <button type="button" onClick={() => notify(`Contrat « ${c.objet} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          Consulter
        </button>
      ),
    },
  ];

  const documentColumns: Column<DocumentResidence>[] = [
    {
      header: "Document",
      cell: (d) => (
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-semibold text-ink">{d.nom}</span>
        </span>
      ),
    },
    { header: "Catégorie", cell: (d) => <Pill>{d.categorie}</Pill> },
    { header: "Format", cell: (d) => <Mono>{d.format}</Mono> },
    { header: "Taille", cell: (d) => <span className="text-stone-500">{d.taille}</span> },
    { header: "Ajouté le", cell: (d) => <span className="text-stone-500">{d.ajouteLe}</span> },
    {
      header: "Action",
      align: "right",
      cell: (d) => (
        <button type="button" onClick={() => notify(`Télécharger « ${d.nom} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          <Download className="h-3.5 w-3.5" aria-hidden />
          Télécharger
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderOpen}
        title="Documents & Contrats"
        subtitle="Contrats des prestataires, règlement intérieur, procès-verbaux et documents financiers"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <Upload className="h-4 w-4" aria-hidden />
            Téléverser Document
          </button>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "contrats" && <DataTable columns={contratColumns} rows={contrats} rowKey={(c) => c.id} />}
      {tab === "documents" && <DataTable columns={documentColumns} rows={documentsResidence} rowKey={(d) => d.id} />}
    </div>
  );
}
