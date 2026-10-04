"use client";

import { ChartColumn, Download, FileSpreadsheet, FileText, History, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { DataTable, PageHeader, Pill, Tabs, button, card, useToast, type Column, type TabItem } from "../ui";

type TabId = "rapports" | "exports";

export type Rapport = {
  id: string;
  titre: string;
  description: string;
  formats: ("PDF" | "Excel")[];
};

export type ExportRecent = {
  id: string;
  rapport: string;
  periode: string;
  format: "PDF" | "Excel";
  genereLe: string;
  par: string;
};

const RAPPORTS_DISPONIBLES: Rapport[] = [
  { id: "rp1", titre: "Recouvrement mensuel", description: "Charges attendues, encaissées et restantes par bâtiment.", formats: ["PDF", "Excel"] },
  { id: "rp2", titre: "État des impayés", description: "Liste des logements en retard avec ancienneté de la dette.", formats: ["PDF", "Excel"] },
  { id: "rp3", titre: "Journal des dépenses", description: "Toutes les dépenses de la résidence par catégorie.", formats: ["Excel"] },
  { id: "rp4", titre: "Rapport d'incidents", description: "Incidents, délais d'intervention et coûts de maintenance.", formats: ["PDF"] },
  { id: "rp5", titre: "Registre des résidents", description: "Propriétaires, locataires et coordonnées par logement.", formats: ["Excel"] },
  { id: "rp6", titre: "Bilan annuel", description: "Synthèse financière et opérationnelle pour l'assemblée générale.", formats: ["PDF"] },
];

function downloadReportFile(titre: string, format: string) {
  const fileName = `${titre.toLowerCase().replace(/[^a-z0-9]/g, "_")}_export.${format === "PDF" ? "pdf" : "csv"}`;
  const content = `Rapport : ${titre}\nFormat : ${format}\nStatut : Certifié conforme par le syndic de copropriété\n`;
  const blob = new Blob([content], { type: format === "PDF" ? "application/pdf" : "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function RapportsPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("rapports");
  const [exportsList, setExportsList] = useState<ExportRecent[]>([]);

  function handleGenerer(titre: string, format: string) {
    downloadReportFile(titre, format);
    setExportsList((prev) => [
      {
        id: `exp_${prev.length + 1}`,
        rapport: titre,
        periode: "Année 2026",
        format: format as "PDF" | "Excel",
        genereLe: "Aujourd'hui",
        par: "Administrateur Syndic",
      },
      ...prev,
    ]);
    notify(`Rapport « ${titre} » généré au format ${format} avec succès.`);
  }

  const exportColumns: Column<ExportRecent>[] = [
    { header: "Rapport", cell: (x) => <span className="font-semibold text-ink">{x.rapport}</span> },
    { header: "Période", cell: (x) => x.periode },
    { header: "Format", cell: (x) => <Pill tone={x.format === "PDF" ? "danger" : "success"}>{x.format}</Pill> },
    { header: "Généré le", cell: (x) => <span className="text-stone-500">{x.genereLe}</span> },
    { header: "Par", cell: (x) => x.par },
    {
      header: "Action",
      align: "right",
      cell: (x) => (
        <button
          type="button"
          onClick={() => handleGenerer(x.rapport, x.format)}
          className={button("secondary", "sm")}
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
          Télécharger
        </button>
      ),
    },
  ];

  const tabs: TabItem<TabId>[] = [
    { id: "rapports", label: "Rapports disponibles", icon: LayoutGrid, count: RAPPORTS_DISPONIBLES.length },
    { id: "exports", label: "Exports récents", icon: History, count: exportsList.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={ChartColumn} title="Rapports & Exports" subtitle="Générez les états financiers et opérationnels de la résidence en PDF ou Excel" />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "rapports" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {RAPPORTS_DISPONIBLES.map((r) => (
            <article key={r.id} className={`${card} flex flex-col p-5`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand">
                {r.formats.includes("Excel") && !r.formats.includes("PDF") ? (
                  <FileSpreadsheet className="h-5 w-5" aria-hidden />
                ) : (
                  <FileText className="h-5 w-5" aria-hidden />
                )}
              </span>
              <h3 className="mt-4 font-bold text-ink">{r.titre}</h3>
              <p className="mt-1 flex-1 text-sm text-stone-500">{r.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
                {r.formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => handleGenerer(r.titre, format)}
                    className={button(format === "PDF" ? "primary" : "secondary", "sm")}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    {format}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "exports" && <DataTable columns={exportColumns} rows={exportsList} rowKey={(x) => x.id} />}
    </div>
  );
}
