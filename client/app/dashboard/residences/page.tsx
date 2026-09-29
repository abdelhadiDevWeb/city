"use client";

import { Building2, ChevronRight, DoorOpen, Layers, MapPin, Plus, UsersRound } from "lucide-react";
import { useState } from "react";
import {
  appartements,
  batiments,
  formatDZD,
  gestionnairesBatiment,
  residences,
  type Appartement,
  type AscenseurEtat,
  type GestionnaireBatiment,
} from "@/lib/demo-data";
import { ROLE_LABELS } from "@/lib/roles";
import {
  Avatar,
  DEMO_NOTICE,
  DataTable,
  Mono,
  PageHeader,
  Pill,
  ProgressBar,
  StatLine,
  Tabs,
  button,
  card,
  useToast,
  type Column,
  type TabItem,
  type Tone,
} from "../ui";

type TabId = "batiments" | "gestionnaires" | "appartements" | "portfolio";

const TABS: TabItem<TabId>[] = [
  { id: "batiments", label: "Bâtiments & Blocs", icon: Building2, count: batiments.length },
  { id: "gestionnaires", label: "Gestionnaires de Bâtiment", icon: UsersRound, count: gestionnairesBatiment.length },
  { id: "appartements", label: "Appartements", icon: DoorOpen, count: appartements.length },
  { id: "portfolio", label: "Portfolio Résidences", icon: Layers, count: residences.length },
];

const ASCENSEUR: Record<AscenseurEtat, { label: string; tone: Tone }> = {
  ok: { label: "Ascenseur OK", tone: "neutral" },
  bruit: { label: "Ascenseur Bruit", tone: "warning" },
  panne: { label: "Ascenseur En Panne", tone: "danger" },
};

export default function ResidencesPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("batiments");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");

  function showApartments(batiment: string) {
    setBuildingFilter(batiment);
    setTab("appartements");
  }

  const gestionnaireColumns: Column<GestionnaireBatiment>[] = [
    {
      header: "Gestionnaire",
      cell: (g) => (
        <span className="flex items-center gap-3">
          <Avatar name={g.nom} />
          <span>
            <span className="block font-semibold text-ink">{g.nom}</span>
            <span className="block text-xs text-stone-500">{g.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Bâtiment", cell: (g) => g.batiment },
    { header: "Téléphone", cell: (g) => <Mono>{g.telephone}</Mono> },
    { header: "Rôle", cell: () => <Pill>{ROLE_LABELS.sub_admin}</Pill> },
    { header: "Depuis", cell: (g) => <span className="text-stone-500">{g.depuis}</span> },
    {
      header: "Action",
      align: "right",
      cell: (g) => (
        <button type="button" onClick={() => notify(`Contacter ${g.nom} — ${DEMO_NOTICE}`)} className={button("secondary", "sm")}>
          Contacter
        </button>
      ),
    },
  ];

  const appartementColumns: Column<Appartement>[] = [
    { header: "Logement", cell: (a) => <span className="font-semibold text-ink">{a.numero}</span> },
    { header: "Bâtiment", cell: (a) => a.batiment },
    { header: "Étage", cell: (a) => a.etage },
    { header: "Type", cell: (a) => <Pill>{a.type}</Pill> },
    { header: "Occupant", cell: (a) => (a.occupant ? <span className="font-medium text-ink">{a.occupant}</span> : <span className="text-stone-400">—</span>) },
    { header: "Statut", cell: (a) => (a.occupant ? <Pill tone="success">Occupé</Pill> : <Pill>Vacant</Pill>) },
    {
      header: "Solde dû",
      align: "right",
      cell: (a) => (a.solde > 0 ? <Mono strong>{formatDZD(a.solde)}</Mono> : <Pill tone="success">À jour</Pill>),
    },
  ];

  const filteredApartments = buildingFilter === "all" ? appartements : appartements.filter((a) => a.batiment === buildingFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Patrimoine, Bâtiments & Gestionnaires"
        subtitle="Structure organisationnelle : Résidence → Bâtiments → Gestionnaires de bâtiment → Appartements"
        actions={
          <button type="button" onClick={() => notify(DEMO_NOTICE)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau Bâtiment (Bloc)
          </button>
        }
      />

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "batiments" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {batiments.map((b) => (
            <article key={b.id} className={`${card} flex flex-col p-5`}>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-ink">{b.nom}</h3>
                <Pill tone={ASCENSEUR[b.ascenseur].tone}>{ASCENSEUR[b.ascenseur].label}</Pill>
              </div>
              <p className="mt-3 text-xl font-bold tracking-tight text-ink">{b.appartements} Appartements</p>
              <p className="text-xs text-stone-500">{b.etages} Étages avec ascenseur Otis</p>

              <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Gestionnaire du bâtiment</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className={`truncate text-sm font-semibold ${b.gestionnaire ? "text-ink" : "text-stone-400"}`}>
                    {b.gestionnaire?.nom ?? "Non affecté"}
                  </span>
                  {b.gestionnaire && <Mono>{b.gestionnaire.telephone}</Mono>}
                </div>
              </div>

              <div className="mt-3">
                <StatLine label="Occupation :" value={`${b.occupes} / ${b.appartements}`} />
                <StatLine label="Taux recouvrement :" value={`${b.tauxRecouvrement}%`} />
                <StatLine label="Impayés du bloc :" value={<Mono strong>{formatDZD(b.impayes)}</Mono>} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4 text-xs">
                <span className={b.pannesActives ? "font-medium text-amber-700" : "text-stone-500"}>
                  {b.pannesActives ? `${b.pannesActives} panne active` : "Aucun incident"}
                </span>
                <button type="button" onClick={() => showApartments(b.nom)} className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand">
                  Voir Logements
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "gestionnaires" && <DataTable columns={gestionnaireColumns} rows={gestionnairesBatiment} rowKey={(g) => g.id} />}

      {tab === "appartements" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par bâtiment">
            {["all", ...batiments.map((b) => b.nom)].map((value) => {
              const selected = buildingFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setBuildingFilter(value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    selected ? "bg-brand text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                  }`}
                >
                  {value === "all" ? "Tous les bâtiments" : value}
                </button>
              );
            })}
          </div>
          <DataTable columns={appartementColumns} rows={filteredApartments} rowKey={(a) => a.id} empty="Aucun appartement pour ce bâtiment." />
        </div>
      )}

      {tab === "portfolio" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {residences.map((r) => (
            <article key={r.id} className={`${card} p-5`}>
              <h3 className="text-base font-bold text-ink">{r.nom}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {r.baladia}, {r.daira} · {r.wilaya}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Logements</p>
                  <p className="mt-0.5 text-lg font-bold text-ink">{r.logements}</p>
                </div>
                <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Bâtiments</p>
                  <p className="mt-0.5 text-lg font-bold text-ink">{r.batiments}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-stone-500">Taux de recouvrement</span>
                  <span className="font-semibold text-ink">{r.tauxRecouvrement}%</span>
                </div>
                <ProgressBar value={r.tauxRecouvrement} label={`Taux de recouvrement ${r.nom}`} />
              </div>
              <div className="mt-4 border-t border-stone-100 pt-3">
                <StatLine label={`Gestionnaire (${ROLE_LABELS.admin})`} value={r.gestionnaire} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
