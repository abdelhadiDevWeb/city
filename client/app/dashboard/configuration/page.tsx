"use client";

import { CreditCard, Pencil, Plus, Receipt, SlidersHorizontal, Wrench } from "lucide-react";
import { useState } from "react";
import {
  formatDZD,
  modesPaiement,
  typesCharges,
  typesIncidents,
  type ModePaiement,
  type TypeCharge,
  type TypeIncident,
} from "@/lib/demo-data";
import { DEMO_NOTICE, DataTable, Mono, PageHeader, Pill, Tabs, button, useToast, type Column, type TabItem } from "../ui";

type TabId = "charges" | "incidents" | "paiements";

const TABS: TabItem<TabId>[] = [
  { id: "charges", label: "Types de charges", icon: Receipt, count: typesCharges.length },
  { id: "incidents", label: "Types d'incidents", icon: Wrench, count: typesIncidents.length },
  { id: "paiements", label: "Modes de paiement", icon: CreditCard, count: modesPaiement.length },
];

function StatusPill({ actif }: { actif: boolean }) {
  return actif ? <Pill tone="success">Actif</Pill> : <Pill>Inactif</Pill>;
}

export default function ConfigurationPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("charges");

  function editAction(name: string) {
    return (
      <button type="button" onClick={() => notify(`Modifier « ${name} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
        <Pencil className="h-3.5 w-3.5" aria-hidden />
        Modifier
      </button>
    );
  }

  const chargeColumns: Column<TypeCharge>[] = [
    { header: "Type de charge", cell: (c) => <span className="font-semibold text-ink">{c.nom}</span> },
    { header: "Montant mensuel", cell: (c) => <Mono strong>{formatDZD(c.montantMensuel)}</Mono> },
    { header: "Appliqué à", cell: (c) => c.appliqueA },
    { header: "Statut", cell: (c) => <StatusPill actif={c.actif} /> },
    { header: "Action", align: "right", cell: (c) => editAction(c.nom) },
  ];

  const incidentColumns: Column<TypeIncident>[] = [
    { header: "Type d'incident", cell: (i) => <span className="font-semibold text-ink">{i.nom}</span> },
    { header: "Délai d'intervention", cell: (i) => <Pill tone="brand">{i.delaiIntervention}</Pill> },
    { header: "Prestataire par défaut", cell: (i) => i.prestataire },
    { header: "Statut", cell: (i) => <StatusPill actif={i.actif} /> },
    { header: "Action", align: "right", cell: (i) => editAction(i.nom) },
  ];

  const paiementColumns: Column<ModePaiement>[] = [
    { header: "Mode de paiement", cell: (m) => <span className="font-semibold text-ink">{m.nom}</span> },
    { header: "Frais", cell: (m) => m.frais },
    { header: "Statut", cell: (m) => <StatusPill actif={m.actif} /> },
    { header: "Action", align: "right", cell: (m) => editAction(m.nom) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SlidersHorizontal}
        title="Configuration & Types"
        subtitle="Paramètres de la résidence : charges, catégories d'incidents et moyens de paiement acceptés"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau Type
          </button>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "charges" && <DataTable columns={chargeColumns} rows={typesCharges} rowKey={(c) => c.id} />}
      {tab === "incidents" && <DataTable columns={incidentColumns} rows={typesIncidents} rowKey={(i) => i.id} />}
      {tab === "paiements" && <DataTable columns={paiementColumns} rows={modesPaiement} rowKey={(m) => m.id} />}
    </div>
  );
}
