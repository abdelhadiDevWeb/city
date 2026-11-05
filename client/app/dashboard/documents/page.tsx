"use client";

import { useI18n } from "@/lib/i18n";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Lock,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
  type Contrat,
  type DocumentResidence,
  type DocumentsData,
} from "@/lib/documents-api";
import { formatDZD } from "@/lib/format";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import {
  ActionGroup,
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
import { SkeletonGenericPage } from "../skeletons";

type TabId = "contrats" | "documents";

const CONTRAT_TONE: Record<Contrat["statut"], Tone> = {
  Actif: "success",
  "Expire bientôt": "warning",
  Expiré: "danger",
};

export default function DocumentsPage() {
  const { t, locale, isRTL, tText } = useI18n();
  const notify = useToast();
  const [data, setData] = useState<DocumentsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("contrats");

  // Filters & Period
  const [queryContrats, setQueryContrats] = useState("");
  const [filterContrats, setFilterContrats] = useState<"all" | "actif" | "bientot" | "expire">("all");

  const [queryDocs, setQueryDocs] = useState("");
  const [filterDocs, setFilterDocs] = useState<string>("all");

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);

  // Creation modals
  const [addingContrat, setAddingContrat] = useState(false);
  const [addingDoc, setAddingDoc] = useState(false);

  // Edit modals
  const [editingContrat, setEditingContrat] = useState<Contrat | null>(null);
  const [editingDoc, setEditingDoc] = useState<DocumentResidence | null>(null);

  // Delete modal
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    let active = true;
    getDocuments()
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

  if (!data && !error) {
    return <SkeletonGenericPage titleWidth="w-64" tableColumns={5} />;
  }

  const contrats = data?.contrats ?? [];
  const documentsResidence = data?.documentsResidence ?? [];

  const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
  const totalBudgetContrats = sum(contrats.map((c) => c.montantAnnuel));
  const contratsActifsCount = contrats.filter((c) => c.statut === "Actif").length;
  const contratsExpireBientotCount = contrats.filter((c) => c.statut === "Expire bientôt" || c.statut === "Expiré").length;

  const needleContrats = queryContrats.trim().toLowerCase();
  const filteredContrats = contrats.filter((c) => {
    if (filterContrats === "actif" && c.statut !== "Actif") return false;
    if (filterContrats === "bientot" && c.statut !== "Expire bientôt") return false;
    if (filterContrats === "expire" && c.statut !== "Expiré") return false;
    if (!needleContrats) return true;
    return [c.objet, c.prestataire, c.debut, c.fin].some((v) => v.toLowerCase().includes(needleContrats));
  });

  const needleDocs = queryDocs.trim().toLowerCase();
  const filteredDocs = documentsResidence.filter((d) => {
    if (filterDocs !== "all" && d.categorie.toLowerCase() !== filterDocs.toLowerCase()) return false;
    if (!needleDocs) return true;
    return [d.nom, d.categorie, d.format].some((v) => v.toLowerCase().includes(needleDocs));
  });

  const tabs: TabItem<TabId>[] = [
    { id: "contrats", label: "Contrats prestataires", icon: FileSignature, count: contrats.length },
    { id: "documents", label: "Coffre-fort & Documents", icon: FolderOpen, count: documentsResidence.length },
  ];

  function handleExportCsv() {
    if (tab === "contrats") {
      const rows = filteredContrats.map((c) => ({
        "Objet du contrat": c.objet,
        Prestataire: c.prestataire,
        "Date début": c.debut,
        "Date fin": c.fin,
        Statut: c.statut,
        "Montant annuel (DZD)": c.montantAnnuel,
      }));
      downloadCsv(rows, `contrats-prestataires-${startDate}_${endDate}.csv`);
      notify("Export CSV des contrats prestataires généré.");
    } else {
      const rows = filteredDocs.map((d) => ({
        "Nom du document": d.nom,
        Catégorie: d.categorie,
        Format: d.format,
        Taille: d.taille,
        "Ajouté le": d.ajouteLe,
      }));
      downloadCsv(rows, `coffre-fort-documents-${startDate}_${endDate}.csv`);
      notify("Export CSV du coffre-fort numérique généré.");
    }
  }

  function handleDownload(nom: string, details?: string) {
    try {
      const content = `RÉSIDENCE LES PALMIERS - ARCHIVES DU SYNDIC
================================================
Document : ${nom}
Date d'édition : ${new Date().toLocaleString("fr-FR")}
Statut : Certifié conforme aux registres de la copropriété
${details ? `\nSpécifications :\n${details}\n` : ""}
Ce fichier atteste de la validité légale et comptable du document archivé sous la gestion City.
================================================
`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${nom.toLowerCase().replace(/[^a-z0-9à-ÿ]/gi, "_")}.txt`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notify(`Document « ${nom} » téléchargé.`);
    } catch {
      notify(`Téléchargement de « ${nom} » en cours...`);
    }
  }

  const contratColumns: Column<Contrat>[] = [
    {
      header: "Objet du contrat",
      cell: (c) => (
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-brand">
            <FileSignature className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="font-semibold text-ink">{c.objet}</span>
        </span>
      ),
    },
    { header: "Prestataire", cell: (c) => <span className="font-medium text-stone-700">{c.prestataire}</span> },
    { header: "Date Début", cell: (c) => <span className="text-stone-500">{c.debut}</span> },
    { header: "Date Fin", cell: (c) => <span className="text-stone-500">{c.fin}</span> },
    { header: "Statut", cell: (c) => <Pill tone={CONTRAT_TONE[c.statut]}>{c.statut}</Pill> },
    { header: "Montant annuel", align: "right", cell: (c) => <Mono strong>{formatDZD(c.montantAnnuel)}</Mono> },
    {
      header: "Action",
      align: "right",
      cell: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleDownload(c.objet, `Prestataire: ${c.prestataire} | Montant annuel: ${c.montantAnnuel} DZD | Validité: ${c.debut} au ${c.fin}`)}
            className={button("secondary", "sm")}
          >
            Consulter
          </button>
          <ActionGroup
            onEdit={() => setEditingContrat(c)}
            onDelete={() => setDeletingItem({ id: c.id, name: `le contrat « ${c.objet} »` })}
          />
        </div>
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
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleDownload(d.nom, `Catégorie: ${d.categorie} | Format: ${d.format} | Taille: ${d.taille} | Date dépôt: ${d.ajouteLe}`)}
            className={button("secondary", "sm")}
          >
            <Download className="h-3.5 w-3.5" aria-hidden />
            Télécharger
          </button>
          <ActionGroup
            onEdit={() => setEditingDoc(d)}
            onDelete={() => setDeletingItem({ id: d.id, name: `le document « ${d.nom} »` })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FolderOpen}
        title={t.documents.title}
        subtitle={t.documents.subtitle}
        actions={
          tab === "contrats" ? (
            <button
              type="button"
              onClick={() => setAddingContrat(true)}
              className={button("primary")}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Nouveau Contrat Prestataire
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAddingDoc(true)}
              className={button("primary")}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Déposer Document Résidence
            </button>
          )
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {!data && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : (
        <>
          {/* Executive Document & Vault KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Contrats Actifs</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FileSignature className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">
                {contratsActifsCount} / {contrats.length}
              </p>
              <p className="mt-1 text-xs text-stone-500">Contrats prestataires en vigueur</p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Budget Annuel Engagé</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-brand">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{formatDZD(totalBudgetContrats)}</p>
              <p className="mt-1 text-xs text-stone-500">Engagements contractuels annuels</p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Échéances & Renouvellements</span>
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${contratsExpireBientotCount > 0 ? "bg-amber-50 text-amber-600" : "bg-stone-100 text-stone-600"}`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{contratsExpireBientotCount}</p>
              <p className="mt-1 text-xs text-stone-500">Contrat(s) expirant sous 60 jours ou échus</p>
            </div>

            <div className={`${card} p-5`}>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
                <span>Coffre-fort Numérique</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Lock className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{documentsResidence.length} Pièces</p>
              <p className="mt-1 text-xs text-stone-500">Archives officielles certifiées conformes</p>
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
            title="Période des Contrats"
          />

          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "contrats" && (
            <DataTable
              columns={contratColumns}
              rows={filteredContrats}
              rowKey={(c) => c.id}
              toolbar={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <FacetFilter
                    value={filterContrats}
                    onChange={setFilterContrats}
                    options={[
                      { id: "all", label: "Tous les contrats", count: contrats.length },
                      { id: "actif", label: "Actifs", count: contratsActifsCount },
                      { id: "bientot", label: "Expire bientôt", count: contrats.filter((c) => c.statut === "Expire bientôt").length },
                      { id: "expire", label: "Expirés", count: contrats.filter((c) => c.statut === "Expiré").length },
                    ]}
                  />
                  <div className="relative min-w-[240px]">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={queryContrats}
                      onChange={(e) => setQueryContrats(e.target.value)}
                      placeholder={tText("Rechercher contrat, prestataire...")}
                      className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              }
              empty={tText("Aucun contrat de prestataire ne correspond aux critères sélectionnés.")}
            />
          )}

          {tab === "documents" && (
            <DataTable
              columns={documentColumns}
              rows={filteredDocs}
              rowKey={(d) => d.id}
              toolbar={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <FacetFilter
                    value={filterDocs}
                    onChange={setFilterDocs}
                    options={[
                      { id: "all", label: "Tous les documents", count: documentsResidence.length },
                      { id: "règlement", label: "Règlements", count: documentsResidence.filter((d) => d.categorie.toLowerCase().includes("règlement")).length },
                      { id: "assemblée générale", label: "PV d'AG", count: documentsResidence.filter((d) => d.categorie.toLowerCase().includes("assemblée")).length },
                      { id: "technique", label: "Technique", count: documentsResidence.filter((d) => d.categorie.toLowerCase().includes("technique")).length },
                    ]}
                  />
                  <div className="relative min-w-[240px]">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      value={queryDocs}
                      onChange={(e) => setQueryDocs(e.target.value)}
                      placeholder={tText("Rechercher document, catégorie...")}
                      className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              }
              empty="Aucun document officiel ne correspond aux critères sélectionnés."
            />
          )}
        </>
      )}

      {/* Modal: Nouveau Contrat */}
      {addingContrat && (
        <NouveauContratModal
          onClose={() => setAddingContrat(false)}
          onCreated={() => {
            setAddingContrat(false);
            setVersion((v) => v + 1);
            notify("Nouveau contrat prestataire enregistré avec succès.");
          }}
        />
      )}

      {/* Modal: Déposer Document */}
      {addingDoc && (
        <NouveauDocumentModal
          onClose={() => setAddingDoc(false)}
          onCreated={() => {
            setAddingDoc(false);
            setVersion((v) => v + 1);
            notify("Document de la résidence ajouté avec succès.");
          }}
        />
      )}

      {/* Modal: Modification Contrat */}
      {editingContrat && (
        <EditContratModal
          contrat={editingContrat}
          onClose={() => setEditingContrat(null)}
          onUpdated={() => {
            setEditingContrat(null);
            setVersion((v) => v + 1);
            notify("Contrat mis à jour avec succès.");
          }}
        />
      )}

      {/* Modal: Modification Document */}
      {editingDoc && (
        <EditDocumentModal
          document={editingDoc}
          onClose={() => setEditingDoc(null)}
          onUpdated={() => {
            setEditingDoc(null);
            setVersion((v) => v + 1);
            notify("Document mis à jour avec succès.");
          }}
        />
      )}

      {/* Modal: Suppression */}
      <ConfirmModal
        open={Boolean(deletingItem)}
        title="Confirmer la suppression"
        message={`Êtes-vous certain de vouloir supprimer ${deletingItem?.name} ? Cette action est irréversible.`}
        confirmLabel="Supprimer définitivement"
        onConfirm={async () => {
          if (!deletingItem) return;
          await deleteDocument(deletingItem.id);
          setDeletingItem(null);
          setVersion((v) => v + 1);
          notify("Élément supprimé avec succès.");
        }}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}

function NouveauContratModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const objet = formText(form, "objet");
    const prestataire = formText(form, "prestataire");
    const montantAnnuel = Number(form.get("montantAnnuel") ?? 0);
    const debut = formText(form, "debut") || "01 Janvier 2026";
    const fin = formText(form, "fin") || "31 Décembre 2026";

    void run(async () => {
      await createDocument({
        typeDoc: "contrat",
        nom: objet,
        objet,
        prestataire,
        montantAnnuel,
        debut,
        fin,
        categorie: "Contrat",
        format: "PDF",
        taille: "2.1 Mo",
      });
      onCreated();
    });
  }

  return (
    <Modal
      title="Nouveau Contrat Prestataire"
      description="Enregistrement d'un contrat de maintenance ou de service pour la résidence"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Objet du contrat"
          name="objet"
          required
          placeholder="Ex: Maintenance ascenseurs Schindler & Otis"
          autoFocus
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nom du prestataire / Entreprise"
            name="prestataire"
            required
            placeholder="Ex: Otis Algérie SARL"
          />
          <Field
            label="Montant annuel (DZD)"
            name="montantAnnuel"
            type="number"
            defaultValue={180000}
            min={0}
            step={1000}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Date de prise d'effet (Début)"
            name="debut"
            defaultValue="01 Jan 2026"
            placeholder="Ex: 01 Jan 2026"
            required
          />
          <Field
            label="Date d'échéance (Fin)"
            name="fin"
            defaultValue="31 Déc 2026"
            placeholder="Ex: 31 Déc 2026"
            required
          />
        </div>

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer le contrat" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouveauDocumentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = formText(form, "nom");
    const categorie = formText(form, "categorie") || "Règlement";
    const format = formText(form, "format") || "PDF";
    const taille = formText(form, "taille") || "1.5 Mo";

    void run(async () => {
      await createDocument({
        typeDoc: "document",
        nom,
        categorie,
        format,
        taille,
      });
      onCreated();
    });
  }

  return (
    <Modal
      title="Déposer un Document de la Résidence"
      description="Archivage de procès-verbaux d'AG, règlements de copropriété, diagnostics et bilans"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Titre / Nom du document"
          name="nom"
          required
          placeholder="Ex: Procès-Verbal AG Ordinaire 2025"
          autoFocus
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Catégorie du document" name="categorie" defaultValue="Règlement">
            <option value="Règlement de copropriété">Règlement de copropriété</option>
            <option value="Procès-Verbal AG">Procès-Verbal AG</option>
            <option value="Diagnostic Technique">Diagnostic Technique</option>
            <option value="Assurance Immeuble">Assurance Immeuble</option>
            <option value="Bilan Comptable & Audit">Bilan Comptable & Audit</option>
            <option value="Plans d'architecture">Plans d'architecture</option>
            <option value="Autre">Autre</option>
          </SelectField>

          <SelectField label="Format du fichier" name="format" defaultValue="PDF">
            <option value="PDF">Document PDF (.pdf)</option>
            <option value="DOCX">Document Word (.docx)</option>
            <option value="XLSX">Tableur Excel (.xlsx)</option>
            <option value="JPG/PNG">Scan / Image (.jpg, .png)</option>
          </SelectField>
        </div>

        <Field
          label="Taille estimée du fichier"
          name="taille"
          defaultValue="1.8 Mo"
          placeholder="Ex: 2.4 Mo, 650 Ko"
        />

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Déposer le document" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditContratModal({
  contrat,
  onClose,
  onUpdated,
}: {
  contrat: Contrat;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateDocument(contrat.id, {
        objet: formText(form, "objet"),
        prestataire: formText(form, "prestataire"),
        montantAnnuel: Number(form.get("montantAnnuel") ?? 0),
        statut: (formText(form, "statut") as Contrat["statut"]) || "Actif",
        debut: formText(form, "debut") || undefined,
        fin: formText(form, "fin") || undefined,
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le contrat" description={`Mise à jour des clauses du contrat ${contrat.objet}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Objet du contrat" name="objet" defaultValue={contrat.objet} required autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prestataire" name="prestataire" defaultValue={contrat.prestataire} required />
          <Field label="Montant annuel (DZD)" name="montantAnnuel" type="number" defaultValue={contrat.montantAnnuel} required />
        </div>
        <SelectField label="Statut du contrat" name="statut" defaultValue={contrat.statut}>
          <option value="Actif">Actif</option>
          <option value="Expire bientôt">Expire bientôt</option>
          <option value="Expiré">Expiré</option>
        </SelectField>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date début" name="debut" defaultValue={contrat.debut} placeholder="Ex: 01 Jan 2026" />
          <Field label="Date fin" name="fin" defaultValue={contrat.fin} placeholder="Ex: 31 Déc 2026" />
        </div>

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditDocumentModal({
  document,
  onClose,
  onUpdated,
}: {
  document: DocumentResidence;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateDocument(document.id, {
        nom: formText(form, "nom"),
        categorie: formText(form, "categorie"),
        format: formText(form, "format"),
        taille: formText(form, "taille"),
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le document" description={`Mise à jour de « ${document.nom} »`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre / Nom du document" name="nom" defaultValue={document.nom} required autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Catégorie" name="categorie" defaultValue={document.categorie}>
            <option value="Règlement de copropriété">Règlement de copropriété</option>
            <option value="Procès-Verbal AG">Procès-Verbal AG</option>
            <option value="Diagnostic Technique">Diagnostic Technique</option>
            <option value="Assurance Immeuble">Assurance Immeuble</option>
            <option value="Bilan Comptable & Audit">Bilan Comptable & Audit</option>
            <option value="Plans d'architecture">Plans d'architecture</option>
            <option value="Autre">Autre</option>
          </SelectField>
          <SelectField label="Format" name="format" defaultValue={document.format}>
            <option value="PDF">PDF</option>
            <option value="DOCX">DOCX</option>
            <option value="XLSX">XLSX</option>
            <option value="JPG/PNG">JPG/PNG</option>
          </SelectField>
        </div>
        <Field label="Taille" name="taille" defaultValue={document.taille} placeholder="Ex: 1.5 Mo" />

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
