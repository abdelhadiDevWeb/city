"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileText,
  NotebookText,
  Phone,
  Plus,
  Receipt,
  Search,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createDepense,
  createPaiement,
  deleteCharge,
  deleteDepense,
  encaisserCharge,
  genererCharges,
  getFinances,
  payerFacture,
  updateCharge,
  updateDepense,
  type Depense,
  type Facture,
  type FinancesData,
  type Impaye,
  type Paiement,
} from "@/lib/finances-api";
import { formatDZD } from "@/lib/format";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import {
  ActionGroup,
  Avatar,
  ConfirmModal,
  DataTable,
  ExportPeriodToolbar,
  FacetFilter,
  Field,
  FormError,
  Modal,
  Mono,
  PageHeader,
  Pill,
  QuittanceModal,
  Tabs,
  button,
  card,
  describeError,
  downloadCsv,
  useToast,
  type Column,
  type TabItem,
  type Tone,
} from "../ui";

type TabId = "impayes" | "journal" | "depenses" | "factures";

const FACTURE_TONE: Record<Facture["statut"], Tone> = { Payée: "success", "À payer": "warning", "En retard": "danger" };

function monthsTone(months: number): Tone {
  if (months >= 3) return "danger";
  if (months === 2) return "warning";
  return "neutral";
}

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

export default function FinancesPage() {
  const notify = useToast();
  const [data, setData] = useState<FinancesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("impayes");

  const [encaissantCharge, setEncaissantCharge] = useState<Impaye | null>(null);
  const [addingPaiement, setAddingPaiement] = useState(false);
  const [addingDepense, setAddingDepense] = useState(false);
  const [addingFacture, setAddingFacture] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingCharge, setEditingCharge] = useState<Impaye | null>(null);
  const [editingDepense, setEditingDepense] = useState<Depense | null>(null);
  const [editingFacture, setEditingFacture] = useState<Facture | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "charge" | "depense" | "facture"; id: string; nom: string } | null>(null);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  const [quittancePaiement, setQuittancePaiement] = useState<Paiement | null>(null);

  const [queryImpayes, setQueryImpayes] = useState("");
  const [filterImpayes, setFilterImpayes] = useState<"all" | "critique" | "recent">("all");

  const [queryPaiements, setQueryPaiements] = useState("");
  const [filterPaiements, setFilterPaiements] = useState<"all" | "edahabia" | "especes">("all");

  const [filterFactures, setFilterFactures] = useState<"all" | "attente" | "payee">("all");

  useEffect(() => {
    let active = true;
    getFinances()
      .then((res) => {
        if (!active) return;
        setData(res);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  const impayes = data?.impayes ?? [];
  const paiements = data?.paiements ?? [];
  const depenses = data?.depenses ?? [];
  const factures = data?.factures ?? [];

  const totalEncaisse = sum(paiements.map((p) => p.montant));
  const totalImpayes = sum(impayes.map((r) => r.totalDu));
  const totalDepenses = sum(depenses.map((d) => d.montant));
  const totalFacturesReste = sum(factures.filter((f) => f.statut !== "Payée").map((f) => f.montant));
  const soldeTresorerie = totalEncaisse - totalDepenses;
  const totalChargesAppelees = totalEncaisse + totalImpayes;
  const tauxRecouvrement = totalChargesAppelees > 0 ? Math.round((totalEncaisse / totalChargesAppelees) * 100) : 100;

  const impayesCritiquesCount = impayes.filter((r) => r.moisImpayes >= 3).length;
  const impayesRecentsCount = impayes.filter((r) => r.moisImpayes < 3).length;
  const needleImpayes = queryImpayes.trim().toLowerCase();
  const filteredImpayes = impayes.filter((r) => {
    if (filterImpayes === "critique" && r.moisImpayes < 3) return false;
    if (filterImpayes === "recent" && r.moisImpayes >= 3) return false;
    if (!needleImpayes) return true;
    return [r.logement, r.resident, r.telephone].some((v) => v.toLowerCase().includes(needleImpayes));
  });

  const edahabiaCount = paiements.filter((p) => p.mode === "Edahabia").length;
  const especesCount = paiements.filter((p) => p.mode !== "Edahabia").length;
  const needlePaiements = queryPaiements.trim().toLowerCase();
  const filteredPaiements = paiements.filter((p) => {
    if (filterPaiements === "edahabia" && p.mode !== "Edahabia") return false;
    if (filterPaiements === "especes" && p.mode === "Edahabia") return false;
    if (!needlePaiements) return true;
    return [p.logement, p.resident, p.reference, p.mode].some((v) => v.toLowerCase().includes(needlePaiements));
  });

  const facturesAttenteCount = factures.filter((f) => f.statut !== "Payée").length;
  const facturesPayeesCount = factures.filter((f) => f.statut === "Payée").length;
  const filteredFactures = factures.filter((f) => {
    if (filterFactures === "attente" && f.statut === "Payée") return false;
    if (filterFactures === "payee" && f.statut !== "Payée") return false;
    return true;
  });

  const tabs: TabItem<TabId>[] = [
    { id: "impayes", label: "Impayés & Recouvrement", icon: TriangleAlert, count: impayes.length },
    { id: "journal", label: "Journal des Paiements", icon: NotebookText, count: paiements.length },
    { id: "depenses", label: "Dépenses Résidence", icon: ArrowDownRight, count: depenses.length },
    { id: "factures", label: "Factures Services & Sonelgaz", icon: FileText, count: factures.length },
  ];

  async function handleEncaisser(charge: Impaye, modePaiement: string) {
    try {
      await encaisserCharge(charge.id, { modePaiement });
      notify(`Paiement de ${formatDZD(charge.totalDu)} enregistré pour ${charge.logement}.`);
      setEncaissantCharge(null);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  async function handlePayerFacture(facture: Facture) {
    try {
      await payerFacture(facture.id);
      notify(`Facture de ${formatDZD(facture.montant)} pour ${facture.fournisseur} marquée comme payée.`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  async function handleGenererCharges() {
    setGenerating(true);
    try {
      const res = await genererCharges("Octobre 2026");
      notify(`Charges générées avec succès (${res.generated} créances).`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    } finally {
      setGenerating(false);
    }
  }

  function handleExportCsv() {
    if (tab === "journal") {
      const rows = filteredPaiements.map((p) => ({
        Date: p.date,
        Résident: p.resident,
        Logement: p.logement,
        "Montant (DZD)": p.montant,
        Mode: p.mode,
        Référence: p.reference,
        "Encaissé par": p.encaissePar || "Syndic",
      }));
      downloadCsv(rows, `journal-paiements-${startDate}_${endDate}.csv`);
      notify("Export CSV du journal des paiements généré.");
    } else if (tab === "impayes") {
      const rows = filteredImpayes.map((r) => ({
        Logement: r.logement,
        Résident: r.resident,
        Téléphone: r.telephone,
        "Mois impayés": r.moisImpayes,
        "Dernier règlement": r.dernierReglement,
        "Total dû (DZD)": r.totalDu,
      }));
      downloadCsv(rows, `impayes-recouvrement-${startDate}_${endDate}.csv`);
      notify("Export CSV des impayés généré.");
    } else if (tab === "depenses") {
      const rows = depenses.map((d) => ({
        Date: d.date,
        Fournisseur: d.fournisseur,
        Catégorie: d.categorie,
        Description: d.description,
        Statut: d.statut,
        "Montant (DZD)": d.montant,
      }));
      downloadCsv(rows, `depenses-residence-${startDate}_${endDate}.csv`);
      notify("Export CSV des dépenses généré.");
    } else {
      const rows = filteredFactures.map((f) => ({
        Fournisseur: f.fournisseur,
        Service: f.service,
        Période: f.periode,
        Échéance: f.echeance,
        Statut: f.statut,
        "Montant (DZD)": f.montant,
      }));
      downloadCsv(rows, `factures-services-${startDate}_${endDate}.csv`);
      notify("Export CSV des factures généré.");
    }
  }

  const impayeColumns: Column<Impaye>[] = [
    {
      header: "Logement & Bâtiment",
      cell: (r) => (
        <span className="flex items-center gap-2 font-bold text-ink">
          <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
          {r.logement}
        </span>
      ),
    },
    {
      header: "Résident",
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={r.resident} size="md" />
          <div>
            <span className="block font-semibold text-ink">{r.resident}</span>
            <span className="block text-xs text-stone-500">{r.telephone}</span>
          </div>
        </div>
      ),
    },
    { header: "Mois impayés", cell: (r) => <Pill tone={monthsTone(r.moisImpayes)}>{r.moisImpayes} Mois de retard</Pill> },
    { header: "Dernier règlement", cell: (r) => <span className="text-stone-500">{r.dernierReglement}</span> },
    { header: "Total dû", cell: (r) => <Mono strong className="font-bold text-red-600">{formatDZD(r.totalDu)}</Mono> },
    {
      header: "Action rapide",
      align: "right",
      cell: (r) => (
        <span className="inline-flex items-center gap-2">
          <button type="button" onClick={() => setEncaissantCharge(r)} className={button("primary", "sm")}>
            Encaisser
          </button>
          <a href={`tel:${r.telephone}`} className={button("secondary", "sm")} title={`Appeler ${r.resident}`}>
            <Phone className="h-3.5 w-3.5" aria-hidden />
            Appeler
          </a>
          <ActionGroup
            editLabel="Modifier créance"
            deleteLabel="Supprimer créance"
            onEdit={() => setEditingCharge(r)}
            onDelete={() => setConfirmDelete({ kind: "charge", id: r.id, nom: `Charge ${r.logement}` })}
          />
        </span>
      ),
    },
  ];

  const paiementColumns: Column<Paiement>[] = [
    { header: "Date", cell: (p) => <span className="text-stone-500">{p.date}</span> },
    { header: "Logement", cell: (p) => <span className="font-bold text-ink">{p.logement}</span> },
    {
      header: "Résident",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Avatar name={p.resident} size="md" />
          <div>
            <span className="block font-medium text-ink">{p.resident}</span>
            <span className="block text-[10px] text-stone-400">Encaissé par : {p.encaissePar || "Syndic"}</span>
          </div>
        </div>
      ),
    },
    { header: "Mode", cell: (p) => <Pill tone={p.mode === "Edahabia" ? "brand" : "neutral"}>{p.mode}</Pill> },
    { header: "Référence", cell: (p) => <Mono>{p.reference}</Mono> },
    { header: "Montant", align: "right", cell: (p) => <Mono strong className="text-emerald-700 font-bold">+{formatDZD(p.montant)}</Mono> },
    {
      header: "Actions",
      align: "right",
      cell: (p) => (
        <span className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQuittancePaiement(p)}
            className={button("secondary", "sm")}
            title="Générer la quittance officielle"
          >
            <Receipt className="h-3.5 w-3.5 text-stone-500" aria-hidden />
            Quittance
          </button>
          <ActionGroup
            deleteLabel="Supprimer paiement"
            onDelete={() => setConfirmDelete({ kind: "charge", id: p.id, nom: `Paiement ${p.resident} (${p.logement})` })}
          />
        </span>
      ),
    },
  ];

  const depenseColumns: Column<Depense>[] = [
    { header: "Date", cell: (d) => <span className="text-stone-500">{d.date}</span> },
    { header: "Catégorie", cell: (d) => <Pill>{d.categorie}</Pill> },
    { header: "Fournisseur", cell: (d) => <span className="font-semibold text-ink">{d.fournisseur}</span> },
    { header: "Description", cell: (d) => d.description },
    { header: "Statut", cell: (d) => <Pill tone={d.statut === "Payée" ? "success" : "warning"}>{d.statut}</Pill> },
    { header: "Montant", align: "right", cell: (d) => <Mono strong>{formatDZD(d.montant)}</Mono> },
    {
      header: "Actions",
      align: "right",
      cell: (d) => (
        <ActionGroup
          editLabel="Modifier dépense"
          deleteLabel="Supprimer dépense"
          onEdit={() => setEditingDepense(d)}
          onDelete={() => setConfirmDelete({ kind: "depense", id: d.id, nom: d.description || d.categorie })}
        />
      ),
    },
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
      cell: (f) => (
        <span className="inline-flex items-center gap-2">
          {f.statut === "Payée" ? (
            <span className="text-xs font-semibold text-emerald-600">Acquittée</span>
          ) : (
            <button type="button" onClick={() => void handlePayerFacture(f)} className={button("primary", "sm")}>
              Payer
            </button>
          )}
          <ActionGroup
            editLabel="Modifier facture"
            deleteLabel="Supprimer facture"
            onEdit={() => setEditingFacture(f)}
            onDelete={() => setConfirmDelete({ kind: "facture", id: f.id, nom: `Facture ${f.fournisseur}` })}
          />
        </span>
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
            {tab === "depenses" ? (
              <button type="button" onClick={() => setAddingDepense(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Nouvelle Dépense
              </button>
            ) : tab === "factures" ? (
              <button type="button" onClick={() => setAddingFacture(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Nouvelle Facture
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={generating}
                  onClick={() => void handleGenererCharges()}
                  className={button("secondary")}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  {generating ? "Génération en cours..." : "Générer Charges"}
                </button>
                <button type="button" onClick={() => setAddingPaiement(true)} className={button("primary")}>
                  <Plus className="h-4 w-4" aria-hidden />
                  Enregistrer Paiement
                </button>
              </>
            )}
          </>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {!data && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : (
        <>
          {/* Executive Financial Health Strip */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Trésorerie Disponible</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Wallet className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{formatDZD(soldeTresorerie)}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
                <span>Encaissé : {formatDZD(totalEncaisse)}</span>
                <span className="font-semibold text-emerald-600">Solde actif</span>
              </div>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Taux de Recouvrement</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-brand">
                  <Receipt className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{tauxRecouvrement}%</p>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
                <span>Appels : {formatDZD(totalChargesAppelees)}</span>
                <span className={tauxRecouvrement >= 80 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                  {tauxRecouvrement >= 80 ? "Bon niveau" : "À surveiller"}
                </span>
              </div>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Total Créances & Impayés</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <TriangleAlert className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-red-700">{formatDZD(totalImpayes)}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
                <span>{impayes.length} retards constatés</span>
                <span className="font-semibold text-red-600">{impayesCritiquesCount} critiques</span>
              </div>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Dépenses Résidence</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
                  <FileText className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{formatDZD(totalDepenses)}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
                <span>{facturesAttenteCount} factures à payer</span>
                <span className="font-mono text-stone-700">{formatDZD(totalFacturesReste)}</span>
              </div>
            </div>
          </div>

          <ExportPeriodToolbar
            startDate={startDate}
            endDate={endDate}
            onPeriodChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onExportCsv={handleExportCsv}
            onPrint={() => window.print()}
            title="Période comptable"
          />

          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "impayes" && (
            <div className="space-y-4">
              <DataTable
                columns={impayeColumns}
                rows={filteredImpayes}
                rowKey={(r) => r.id}
                toolbar={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <FacetFilter
                      value={filterImpayes}
                      onChange={setFilterImpayes}
                      options={[
                        { id: "all", label: "Tous les impayés", count: impayes.length },
                        { id: "critique", label: "Critique (3+ mois)", count: impayesCritiquesCount },
                        { id: "recent", label: "Récent (1-2 mois)", count: impayesRecentsCount },
                      ]}
                    />
                    <div className="relative min-w-[240px]">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={queryImpayes}
                        onChange={(e) => setQueryImpayes(e.target.value)}
                        placeholder="Rechercher résident, logement..."
                        className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                }
                empty="Aucun impayé : tous les logements sont à jour de leurs cotisations."
              />
            </div>
          )}

          {tab === "journal" && (
            <div className="space-y-4">
              <DataTable
                columns={paiementColumns}
                rows={filteredPaiements}
                rowKey={(p) => p.id}
                toolbar={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <FacetFilter
                      value={filterPaiements}
                      onChange={setFilterPaiements}
                      options={[
                        { id: "all", label: "Tous les paiements", count: paiements.length },
                        { id: "edahabia", label: "Edahabia / CIB", count: edahabiaCount },
                        { id: "especes", label: "Espèces / CCP / Chèque", count: especesCount },
                      ]}
                    />
                    <div className="relative min-w-[240px]">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={queryPaiements}
                        onChange={(e) => setQueryPaiements(e.target.value)}
                        placeholder="Rechercher paiement, référence..."
                        className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                }
                empty="Aucun paiement ne correspond aux critères de recherche."
              />
            </div>
          )}

          {tab === "depenses" && (
            <div className="space-y-4">
              <SummaryStrip label="Total dépenses" value={formatDZD(sum(depenses.map((d) => d.montant)))} hint={`${depenses.filter((d) => d.statut === "En attente").length} dépense(s) en attente de règlement`} />
              <DataTable columns={depenseColumns} rows={depenses} rowKey={(d) => d.id} empty="Aucune dépense enregistrée." />
            </div>
          )}

          {tab === "factures" && (
            <div className="space-y-4">
              <DataTable
                columns={factureColumns}
                rows={filteredFactures}
                rowKey={(f) => f.id}
                toolbar={
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <FacetFilter
                      value={filterFactures}
                      onChange={setFilterFactures}
                      options={[
                        { id: "all", label: "Toutes les factures", count: factures.length },
                        { id: "attente", label: "À payer / En retard", count: facturesAttenteCount },
                        { id: "payee", label: "Acquittées", count: facturesPayeesCount },
                      ]}
                    />
                    <span className="text-xs font-semibold text-stone-500">
                      Reste à régler : <span className="font-mono font-bold text-ink">{formatDZD(totalFacturesReste)}</span>
                    </span>
                  </div>
                }
                empty="Aucune facture ne correspond aux critères sélectionnés."
              />
            </div>
          )}
        </>
      )}

      {encaissantCharge && (
        <EncaisserModal
          charge={encaissantCharge}
          onClose={() => setEncaissantCharge(null)}
          onConfirm={(mode) => void handleEncaisser(encaissantCharge, mode)}
        />
      )}

      {addingPaiement && (
        <NouveauPaiementModal
          onClose={() => setAddingPaiement(false)}
          onCreated={() => {
            setAddingPaiement(false);
            setVersion((v) => v + 1);
            notify("Paiement enregistré avec succès.");
          }}
        />
      )}

      {addingDepense && (
        <NouvelleDepenseModal
          onClose={() => setAddingDepense(false)}
          onCreated={() => {
            setAddingDepense(false);
            setVersion((v) => v + 1);
            notify("Dépense enregistrée avec succès.");
          }}
        />
      )}

      {addingFacture && (
        <NouvelleFactureModal
          onClose={() => setAddingFacture(false)}
          onCreated={() => {
            setAddingFacture(false);
            setVersion((v) => v + 1);
            notify("Facture enregistrée avec succès.");
          }}
        />
      )}

      {editingCharge && (
        <EditChargeModal
          charge={editingCharge}
          onClose={() => setEditingCharge(null)}
          onUpdated={() => {
            setEditingCharge(null);
            setVersion((v) => v + 1);
            notify("Charge mise à jour avec succès.");
          }}
        />
      )}

      {editingDepense && (
        <EditDepenseModal
          depense={editingDepense}
          onClose={() => setEditingDepense(null)}
          onUpdated={() => {
            setEditingDepense(null);
            setVersion((v) => v + 1);
            notify("Dépense mise à jour avec succès.");
          }}
        />
      )}

      {editingFacture && (
        <EditFactureModal
          facture={editingFacture}
          onClose={() => setEditingFacture(null)}
          onUpdated={() => {
            setEditingFacture(null);
            setVersion((v) => v + 1);
            notify("Facture mise à jour avec succès.");
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          title={`Supprimer ${confirmDelete.nom.startsWith("Paiement") ? "le paiement" : confirmDelete.kind === "charge" ? "la créance" : confirmDelete.kind === "depense" ? "la dépense" : "la facture"}`}
          message={`Êtes-vous sûr de vouloir supprimer « ${confirmDelete.nom} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            try {
              if (confirmDelete.kind === "charge") {
                await deleteCharge(confirmDelete.id);
                notify(confirmDelete.nom.startsWith("Paiement") ? "Paiement supprimé." : "Créance supprimée.");
              } else {
                await deleteDepense(confirmDelete.id);
                notify("Dépense/Facture supprimée.");
              }
              setConfirmDelete(null);
              setVersion((v) => v + 1);
            } catch (err) {
              notify(describeError(err).message);
            }
          }}
        />
      )}

      {quittancePaiement && (
        <QuittanceModal
          paiement={quittancePaiement}
          onClose={() => setQuittancePaiement(null)}
        />
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

function EncaisserModal({
  charge,
  onClose,
  onConfirm,
}: {
  charge: Impaye;
  onClose: () => void;
  onConfirm: (mode: string) => void;
}) {
  const [mode, setMode] = useState("Espèces");

  return (
    <Modal
      title={`Encaisser ${formatDZD(charge.totalDu)}`}
      description={`Règlement des charges pour ${charge.logement} (${charge.resident})`}
      onClose={onClose}
    >
      <div className="space-y-4">
        <SelectField label="Mode de paiement" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="Espèces">Espèces au bureau syndic</option>
          <option value="Edahabia">Carte Edahabia</option>
          <option value="CIB">Carte CIB</option>
          <option value="Virement CCP">Virement CCP / Bancaire</option>
          <option value="Chèque">Chèque bancaire</option>
        </SelectField>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={button("secondary")}>
            Annuler
          </button>
          <button type="button" onClick={() => onConfirm(mode)} className={button("primary")}>
            Valider l&apos;encaissement
          </button>
        </div>
      </div>
    </Modal>
  );
}

function NouveauPaiementModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [mode, setMode] = useState("Espèces");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createPaiement({
        logement: formText(form, "logement"),
        resident: formText(form, "resident"),
        telephone: formText(form, "telephone"),
        montant: Number(form.get("montant") ?? 3500),
        modePaiement: mode,
        reference: formText(form, "reference"),
      });
      onCreated();
    });
  }

  return (
    <Modal title="Enregistrer un paiement" description="Enregistrement d'un règlement de charges" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Logement" name="logement" required placeholder="Logement A12" autoFocus />
          <Field label="Résident" name="resident" required placeholder="Nom du résident" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" name="telephone" required placeholder="0555123456" />
          <Field label="Montant (DZD)" name="montant" type="number" required defaultValue={3500} min={100} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Mode de paiement" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="Espèces">Espèces</option>
            <option value="Edahabia">Carte Edahabia</option>
            <option value="CIB">Carte CIB</option>
            <option value="Virement CCP">Virement CCP</option>
            <option value="Chèque">Chèque</option>
          </SelectField>
          <Field label="Référence reçu / chèque" name="reference" placeholder="Optionnel" />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer le paiement" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditChargeModal({
  charge,
  onClose,
  onUpdated,
}: {
  charge: Impaye;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [montant, setMontant] = useState(charge.totalDu);
  const [statut, setStatut] = useState<"Payée" | "À payer" | "En retard">("À payer");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateCharge(charge.id, { montant: Number(montant), statut });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier la créance" description={`${charge.logement} · ${charge.resident}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Montant total dû (DZD)" type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} required min={0} />
        <SelectField label="Statut de la créance" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
          <option value="À payer">À payer</option>
          <option value="En retard">En retard</option>
          <option value="Payée">Payée</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditDepenseModal({
  depense,
  onClose,
  onUpdated,
}: {
  depense: Depense;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [categorie, setCategorie] = useState(depense.categorie);
  const [fournisseur, setFournisseur] = useState(depense.fournisseur);
  const [description, setDescription] = useState(depense.description);
  const [montant, setMontant] = useState(depense.montant);
  const [statut, setStatut] = useState(depense.statut);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateDepense(depense.id, { categorie, fournisseur, description, montant: Number(montant), statut });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier la dépense" description="Mettre à jour les détails de la dépense" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} required />
        <Field label="Fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} required />
        <Field label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Field label="Montant (DZD)" type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} required min={0} />
        <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
          <option value="Payée">Payée</option>
          <option value="À payer">À payer</option>
          <option value="En retard">En retard</option>
          <option value="En attente">En attente</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditFactureModal({
  facture,
  onClose,
  onUpdated,
}: {
  facture: Facture;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [fournisseur, setFournisseur] = useState(facture.fournisseur);
  const [service, setService] = useState(facture.service);
  const [montant, setMontant] = useState(facture.montant);
  const [statut, setStatut] = useState(facture.statut);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateDepense(facture.id, { fournisseur, description: service, montant: Number(montant), statut });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier la facture" description="Détails du service ou fournisseur d'énergie" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)} required />
        <Field label="Service" value={service} onChange={(e) => setService(e.target.value)} required />
        <Field label="Montant (DZD)" type="number" value={montant} onChange={(e) => setMontant(Number(e.target.value))} required min={0} />
        <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
          <option value="Payée">Payée</option>
          <option value="À payer">À payer</option>
          <option value="En retard">En retard</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouvelleDepenseModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [categorie, setCategorie] = useState("Entretien & Réparations");
  const [statut, setStatut] = useState<"Payée" | "À payer" | "En attente">("Payée");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createDepense({
        categorie,
        fournisseur: formText(form, "fournisseur"),
        description: formText(form, "description"),
        montant: Number(formText(form, "montant")),
        statut,
        typeDepense: "depense",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Enregistrer une dépense résidence" description="Achats, travaux, prestataires et charges opérationnelles" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            <option value="Entretien & Réparations">Entretien & Réparations</option>
            <option value="Nettoyage & Hygiène">Nettoyage & Hygiène</option>
            <option value="Sécurité & Gardiennage">Sécurité & Gardiennage</option>
            <option value="Maintenance Ascenseur">Maintenance Ascenseur</option>
            <option value="Espaces Verts">Espaces Verts</option>
            <option value="Fournitures & Petit matériel">Fournitures & Petit matériel</option>
          </SelectField>
          <Field label="Fournisseur / Prestataire" name="fournisseur" required placeholder="Ex: Plomberie Express, SARL Net" />
        </div>
        <Field label="Description de la dépense" name="description" required placeholder="Ex: Remplacement lampe hall et serrures portail" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Montant (DZD)" name="montant" type="number" required placeholder="Ex: 8500" min={0} />
          <SelectField label="Statut du règlement" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
            <option value="Payée">Payée (Décaissée)</option>
            <option value="À payer">À payer</option>
            <option value="En attente">En attente de devis/facture</option>
          </SelectField>
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer la dépense" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouvelleFactureModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [fournisseur, setFournisseur] = useState("Sonelgaz (Électricité & Gaz)");
  const [statut, setStatut] = useState<"À payer" | "Payée" | "En retard">("À payer");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createDepense({
        categorie: "Utilités & Services",
        fournisseur,
        service: formText(form, "service"),
        description: formText(form, "service"),
        periode: formText(form, "periode"),
        echeance: formText(form, "echeance"),
        montant: Number(formText(form, "montant")),
        statut,
        typeDepense: "facture",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Ajouter une facture service ou Sonelgaz" description="Factures d'énergie, d'eau, télécoms ou contrats réguliers" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Organisme / Fournisseur" value={fournisseur} onChange={(e) => setFournisseur(e.target.value)}>
            <option value="Sonelgaz (Électricité & Gaz)">Sonelgaz (Électricité & Gaz)</option>
            <option value="SEAAL / ADE (Eau)">SEAAL / ADE (Eau)</option>
            <option value="Maintenance Ascenseur (Contrat)">Maintenance Ascenseur (Contrat)</option>
            <option value="Algérie Télécom (Fibre/Internet)">Algérie Télécom (Fibre/Internet)</option>
            <option value="Autre Service">Autre Service</option>
          </SelectField>
          <Field label="Service / Réf. Facture" name="service" required placeholder="Ex: Éclairage parties communes" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Période couverte" name="periode" required placeholder="Ex: 3e Trimestre 2026" />
          <Field label="Date d'échéance" name="echeance" required placeholder="Ex: 15/11/2026" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Montant à payer (DZD)" name="montant" type="number" required placeholder="Ex: 24500" min={0} />
          <SelectField label="Statut de la facture" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
            <option value="À payer">À payer</option>
            <option value="Payée">Payée (Acquittée)</option>
            <option value="En retard">En retard</option>
          </SelectField>
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter la facture" onCancel={onClose} />
      </form>
    </Modal>
  );
}
