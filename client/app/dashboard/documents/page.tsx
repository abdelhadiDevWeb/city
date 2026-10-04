"use client";

import { Download, FileSignature, FileText, FolderOpen, Upload } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createDocument,
  getDocuments,
  type Contrat,
  type DocumentResidence,
  type DocumentsData,
} from "@/lib/documents-api";
import { formatDZD } from "@/lib/format";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import { DataTable, Field, FormError, Modal, Mono, PageHeader, Pill, Tabs, button, card, describeError, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "contrats" | "documents";

const CONTRAT_TONE: Record<Contrat["statut"], Tone> = { Actif: "success", "Expire bientôt": "warning", Expiré: "danger" };

export default function DocumentsPage() {
  const notify = useToast();
  const [data, setData] = useState<DocumentsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("contrats");
  const [uploading, setUploading] = useState(false);

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

  const contrats = data?.contrats ?? [];
  const documentsResidence = data?.documentsResidence ?? [];

  const tabs: TabItem<TabId>[] = [
    { id: "contrats", label: "Contrats prestataires", icon: FileSignature, count: contrats.length },
    { id: "documents", label: "Documents résidence", icon: FileText, count: documentsResidence.length },
  ];

  function handleDownload(nom: string) {
    notify(`Téléchargement du document « ${nom} » en cours...`);
  }

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
        <button
          type="button"
          onClick={() => handleDownload(c.objet)}
          className={button("secondary", "sm")}
        >
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
        <button
          type="button"
          onClick={() => handleDownload(d.nom)}
          className={button("secondary", "sm")}
        >
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
          <button type="button" onClick={() => setUploading(true)} className={button("primary")}>
            <Upload className="h-4 w-4" aria-hidden />
            Téléverser Document
          </button>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {!data && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : (
        <>
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "contrats" && <DataTable columns={contratColumns} rows={contrats} rowKey={(c) => c.id} empty="Aucun contrat enregistré." />}
          {tab === "documents" && <DataTable columns={documentColumns} rows={documentsResidence} rowKey={(d) => d.id} empty="Aucun document enregistré." />}
        </>
      )}

      {uploading && (
        <NouveauDocumentModal
          onClose={() => setUploading(false)}
          onCreated={() => {
            setUploading(false);
            setVersion((v) => v + 1);
            notify("Document enregistré avec succès.");
          }}
        />
      )}
    </div>
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
  const [typeDoc, setTypeDoc] = useState<"contrat" | "document">("document");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createDocument({
        typeDoc,
        nom: formText(form, "nom"),
        objet: formText(form, "objet"),
        prestataire: formText(form, "prestataire"),
        categorie: formText(form, "categorie") || "Général",
        montantAnnuel: Number(form.get("montantAnnuel") ?? 0),
        debut: formText(form, "debut") || undefined,
        fin: formText(form, "fin") || undefined,
        format: formText(form, "format") || "PDF",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Ajouter un document" description="Ajout d'un contrat ou d'une pièce réglementaire" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <SelectField label="Type de document" value={typeDoc} onChange={(e) => setTypeDoc(e.target.value as "contrat" | "document")}>
          <option value="document">Document réglementaire / PV / Bilan</option>
          <option value="contrat">Contrat prestataire de service</option>
        </SelectField>

        <Field label="Titre / Nom du document" name="nom" required placeholder="Ex: Règlement intérieur, Facture Sonelgaz" autoFocus />

        {typeDoc === "contrat" ? (
          <>
            <Field label="Objet du contrat" name="objet" required placeholder="Ex: Maintenance ascenseurs Otis" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prestataire" name="prestataire" required placeholder="Ex: Otis Algérie" />
              <Field label="Montant annuel (DZD)" name="montantAnnuel" type="number" defaultValue={100000} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date début" name="debut" placeholder="Ex: 01 Jan 2026" />
              <Field label="Date fin" name="fin" placeholder="Ex: 31 Déc 2026" />
            </div>
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Catégorie" name="categorie" defaultValue="Règlement" placeholder="Ex: Règlement, PV, Technique" />
            <Field label="Format" name="format" defaultValue="PDF" placeholder="PDF, DOCX" />
          </div>
        )}

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter le document" onCancel={onClose} />
      </form>
    </Modal>
  );
}
