"use client";

import {
  ChartColumn,
  Download,
  FileSpreadsheet,
  FileText,
  History,
  LayoutGrid,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { displayName, primaryRole } from "@/lib/roles";
import { useSession } from "../session";
import {
  ConfirmModal,
  DataTable,
  PageHeader,
  Pill,
  Tabs,
  button,
  card,
  useToast,
  type Column,
  type TabItem,
} from "../ui";

type TabId = "rapports" | "exports";

export type Rapport = {
  id: string;
  titre: string;
  description: string;
  formats: ("PDF" | "Excel")[];
  categorie: string;
};

export type ExportRecent = {
  id: string;
  rapport: string;
  periode: string;
  format: "PDF" | "Excel";
  genereLe: string;
  par: string;
};

const SUPER_ADMIN_RAPPORTS: Rapport[] = [
  {
    id: "sa1",
    titre: "Audit Global des Résidences & Quotas",
    description: "Inventaire national consolidé de toutes les résidences, quotas bâtiments et admins affectés.",
    formats: ["Excel", "PDF"],
    categorie: "Plateforme",
  },
  {
    id: "sa2",
    titre: "Trésorerie & Abonnements Plateforme",
    description: "Bilan global des souscriptions actives, impayées et revenus encaissés par formule SaaS.",
    formats: ["Excel", "PDF"],
    categorie: "Finances SaaS",
  },
  {
    id: "sa3",
    titre: "Registre National des Résidents",
    description: "Liste consolidée de tous les résidents et copropriétaires de l'ensemble des résidences.",
    formats: ["Excel"],
    categorie: "Résidents",
  },
  {
    id: "sa4",
    titre: "Suivi des Licences Sous-Admins & Blocs",
    description: "Tous les sous-admins par bâtiment et statut de validation de leur abonnement de gestion.",
    formats: ["Excel", "PDF"],
    categorie: "Sous-Admins",
  },
];

const ADMIN_RAPPORTS: Rapport[] = [
  {
    id: "rp1",
    titre: "Recouvrement de la Résidence",
    description: "Charges attendues, encaissées et impayées ventilées par bâtiment.",
    formats: ["PDF", "Excel"],
    categorie: "Finances",
  },
  {
    id: "rp2",
    titre: "État des impayés Résidence",
    description: "Liste des logements en retard de cotisation avec ancienneté de la dette.",
    formats: ["PDF", "Excel"],
    categorie: "Recouvrement",
  },
  {
    id: "rp3",
    titre: "Journal des dépenses & factures",
    description: "Toutes les dépenses de la copropriété par catégorie et par prestataire.",
    formats: ["Excel"],
    categorie: "Comptabilité",
  },
  {
    id: "rp4",
    titre: "Cotisations des Sous-Admins",
    description: "Suivi des abonnements des gestionnaires de bloc de la résidence.",
    formats: ["PDF", "Excel"],
    categorie: "Gestion",
  },
  {
    id: "rp5",
    titre: "Registre des résidents de la résidence",
    description: "Propriétaires, locataires et coordonnées par logement et par bloc.",
    formats: ["Excel"],
    categorie: "Registre",
  },
  {
    id: "rp6",
    titre: "Bilan annuel d'Assemblée Générale",
    description: "Synthèse financière et opérationnelle globale pour la réunion annuelle.",
    formats: ["PDF"],
    categorie: "Bilan",
  },
];

const SUB_ADMIN_RAPPORTS: Rapport[] = [
  {
    id: "sub1",
    titre: "Recouvrement des charges du Bâtiment",
    description: "Charges encaissées et restant dues pour votre bâtiment uniquement.",
    formats: ["PDF", "Excel"],
    categorie: "Finances Bloc",
  },
  {
    id: "sub2",
    titre: "État des impayés du Bâtiment",
    description: "Liste nominative des logements en retard de paiement dans votre bloc.",
    formats: ["PDF", "Excel"],
    categorie: "Recouvrement Bloc",
  },
  {
    id: "sub3",
    titre: "Registre des résidents du Bâtiment",
    description: "Occupants, numéros d'étage et portes de votre bloc assigné.",
    formats: ["Excel"],
    categorie: "Résidents Bloc",
  },
  {
    id: "sub4",
    titre: "Rapport d'incidents & pannes du bloc",
    description: "Historique des pannes signalées, délais d'intervention et travaux du bâtiment.",
    formats: ["PDF"],
    categorie: "Maintenance",
  },
];

function downloadReportFile(titre: string, format: string, auteur: string) {
  const fileName = `${titre.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${new Date().toISOString().slice(0, 10)}.${format === "PDF" ? "pdf" : "csv"}`;
  const now = new Date().toLocaleString("fr-FR");
  const content = format === "PDF"
    ? `%PDF-1.4\n% Rapport : ${titre}\n% Généré le : ${now}\n% Émetteur : ${auteur}\n% Statut : Document certifié conforme CITY SaaS\n`
    : `Rapport,${titre}\nDate d'export,${now}\nÉmetteur,${auteur}\nStatut,Certifié conforme par le portail syndic CITY\n\nN°,Logement,Resident,Telephone,Montant (DZD),Statut\n1,Exemple A01,Résident Exemple,0555000000,3500,Payé\n`;
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
  const { account } = useSession();
  const role = primaryRole(account);
  const isSuperAdmin = role === "super_admin";
  const isSubAdmin = role === "sub_admin";

  const [tab, setTab] = useState<TabId>("rapports");
  const [exportsList, setExportsList] = useState<ExportRecent[]>([]);
  const [deletingExport, setDeletingExport] = useState<ExportRecent | null>(null);

  const rapportsList = isSuperAdmin
    ? SUPER_ADMIN_RAPPORTS
    : isSubAdmin
    ? SUB_ADMIN_RAPPORTS
    : ADMIN_RAPPORTS;

  function handleGenerer(titre: string, format: string) {
    const auteur = `${displayName(account)} (${role})`;
    downloadReportFile(titre, format, auteur);
    setExportsList((prev) => [
      {
        id: `exp_${Date.now()}`,
        rapport: titre,
        periode: "Année 2026",
        format: format as "PDF" | "Excel",
        genereLe: "Aujourd'hui",
        par: displayName(account),
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
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleGenerer(x.rapport, x.format)}
            className={button("secondary", "sm")}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Télécharger
          </button>
          <button
            type="button"
            onClick={() => setDeletingExport(x)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            title="Supprimer cet export"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      ),
    },
  ];

  const tabs: TabItem<TabId>[] = [
    { id: "rapports", label: "Rapports disponibles", icon: LayoutGrid, count: rapportsList.length },
    { id: "exports", label: "Exports récents", icon: History, count: exportsList.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ChartColumn}
        title="Rapports & Exports"
        subtitle={
          isSuperAdmin
            ? "Générez les états consolidés de l'ensemble de la plateforme SaaS en PDF ou Excel."
            : isSubAdmin
            ? "Générez les rapports d'activité, charges et recouvrement de votre bâtiment."
            : "Générez les états financiers, administratifs et opérationnels de votre résidence."
        }
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "rapports" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rapportsList.map((r) => (
            <article key={r.id} className={`${card} flex flex-col p-5`}>
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand">
                  {r.formats.includes("Excel") && !r.formats.includes("PDF") ? (
                    <FileSpreadsheet className="h-5 w-5" aria-hidden />
                  ) : (
                    <FileText className="h-5 w-5" aria-hidden />
                  )}
                </span>
                <Pill tone="neutral">{r.categorie}</Pill>
              </div>
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

      {tab === "exports" && (
        <DataTable
          columns={exportColumns}
          rows={exportsList}
          rowKey={(x) => x.id}
          empty="Aucun export récent dans cette session."
        />
      )}

      <ConfirmModal
        open={Boolean(deletingExport)}
        title="Supprimer l'export"
        message={`Êtes-vous sûr de vouloir retirer le rapport « ${deletingExport?.rapport} » de l'historique récent ?`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (!deletingExport) return;
          setExportsList((prev) => prev.filter((item) => item.id !== deletingExport.id));
          setDeletingExport(null);
          notify("Export retiré de l'historique.");
        }}
        onCancel={() => setDeletingExport(null)}
      />
    </div>
  );
}
