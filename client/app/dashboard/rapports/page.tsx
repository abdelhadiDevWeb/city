"use client";

import { ChartColumn, Download, FileSpreadsheet, FileText, History, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { exportsRecents, rapports, type ExportRecent } from "@/lib/demo-data";
import { DEMO_NOTICE, DataTable, PageHeader, Pill, Tabs, button, card, useToast, type Column, type TabItem } from "../ui";

type TabId = "rapports" | "exports";

const TABS: TabItem<TabId>[] = [
  { id: "rapports", label: "Rapports disponibles", icon: LayoutGrid, count: rapports.length },
  { id: "exports", label: "Exports récents", icon: History, count: exportsRecents.length },
];

export default function RapportsPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("rapports");

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
        <button type="button" onClick={() => notify(`Télécharger « ${x.rapport} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          <Download className="h-3.5 w-3.5" aria-hidden />
          Télécharger
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={ChartColumn} title="Rapports & Exports" subtitle="Générez les états financiers et opérationnels de la résidence en PDF ou Excel" />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "rapports" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rapports.map((r) => (
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
                    onClick={() => notify(`Génération « ${r.titre} » (${format}) — ${DEMO_NOTICE}`)}
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

      {tab === "exports" && <DataTable columns={exportColumns} rows={exportsRecents} rowKey={(x) => x.id} />}
    </div>
  );
}
