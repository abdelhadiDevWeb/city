"use client";

import { Droplets, History, Siren, TriangleAlert, Wrench } from "lucide-react";
import { useState } from "react";
import {
  equipements,
  formatDZD,
  historiqueInterventions,
  incidents,
  pannesEquipement,
  type Incident,
  type InterventionPassee,
  type PanneEquipement,
  type Priorite,
} from "@/lib/demo-data";
import { DEMO_NOTICE, DataTable, Mono, PageHeader, Pill, Tabs, button, card, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "incidents" | "pannes" | "historique";

const TABS: TabItem<TabId>[] = [
  { id: "incidents", label: "Incidents actifs", icon: Droplets, count: incidents.length },
  { id: "pannes", label: "Pannes d'équipement", icon: Siren, count: pannesEquipement.length },
  { id: "historique", label: "Historique", icon: History, count: historiqueInterventions.length },
];

const PRIORITE_TONE: Record<Priorite, Tone> = { Haute: "danger", Moyenne: "warning", Basse: "neutral" };

export default function MaintenancePage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("incidents");

  const incidentColumns: Column<Incident>[] = [
    {
      header: "Incident",
      cell: (i) => (
        <span>
          <span className="block font-semibold text-ink">{i.titre}</span>
          <span className="block text-xs text-stone-500">Signalé par {i.signalePar}</span>
        </span>
      ),
    },
    { header: "Localisation", cell: (i) => i.lieu },
    { header: "Signalé le", cell: (i) => <span className="text-stone-500">{i.signaleLe}</span> },
    { header: "Priorité", cell: (i) => <Pill tone={PRIORITE_TONE[i.priorite]}>{i.priorite}</Pill> },
    { header: "Prestataire", cell: (i) => i.prestataire },
    { header: "Statut", cell: (i) => <Pill tone="brand">{i.statut}</Pill> },
    {
      header: "Action",
      align: "right",
      cell: (i) => (
        <button type="button" onClick={() => notify(`Suivi « ${i.titre} » — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          Suivre
        </button>
      ),
    },
  ];

  const panneColumns: Column<PanneEquipement>[] = [
    { header: "Équipement", cell: (p) => <span className="font-semibold text-ink">{p.equipement}</span> },
    { header: "Localisation", cell: (p) => p.lieu },
    { header: "En panne depuis", cell: (p) => <span className="text-stone-500">{p.depuis}</span> },
    { header: "Prestataire", cell: (p) => p.prestataire },
    { header: "Statut", cell: (p) => <Pill tone="danger">{p.statut}</Pill> },
    {
      header: "Action",
      align: "right",
      cell: (p) => (
        <button type="button" onClick={() => notify(`Relance ${p.prestataire} — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          Relancer
        </button>
      ),
    },
  ];

  const historiqueColumns: Column<InterventionPassee>[] = [
    { header: "Intervention", cell: (h) => <span className="font-semibold text-ink">{h.titre}</span> },
    { header: "Localisation", cell: (h) => h.lieu },
    { header: "Clôturée le", cell: (h) => <span className="text-stone-500">{h.clotureLe}</span> },
    { header: "Prestataire", cell: (h) => h.prestataire },
    { header: "Coût", align: "right", cell: (h) => <Mono strong>{formatDZD(h.cout)}</Mono> },
  ];

  const stats = [
    { label: "Incidents actifs", value: String(incidents.length) },
    { label: "Ascenseurs opérationnels", value: `${equipements.ascenseurs.operationnels} / ${equipements.ascenseurs.total}` },
    { label: "Pompes & surpresseurs", value: `${equipements.pompes.operationnels} / ${equipements.pompes.total}` },
    { label: "Groupe électrogène", value: equipements.groupeElectrogene },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title="Maintenance & Pannes"
        subtitle="Incidents signalés, pannes d'équipement et suivi des interventions des prestataires"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <TriangleAlert className="h-4 w-4" aria-hidden />
            Signaler Incident
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${card} p-4`}>
            <p className="text-xs font-semibold text-stone-500">{stat.label}</p>
            <p className="mt-1 text-xl font-bold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "incidents" && <DataTable columns={incidentColumns} rows={incidents} rowKey={(i) => i.id} empty="Aucun incident actif." />}
      {tab === "pannes" && <DataTable columns={panneColumns} rows={pannesEquipement} rowKey={(p) => p.id} empty="Tous les équipements sont opérationnels." />}
      {tab === "historique" && <DataTable columns={historiqueColumns} rows={historiqueInterventions} rowKey={(h) => h.id} />}
    </div>
  );
}
