"use client";

import { CreditCard, Pencil, Plus, Receipt, SlidersHorizontal, Wrench } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  addChargeType,
  deleteChargeType,
  getConfig,
  toggleChargeType,
  updateChargeType,
  type ConfigData,
  type ModePaiement,
  type TypeCharge,
  type TypeIncident,
} from "@/lib/config-api";
import { formatDZD } from "@/lib/format";
import { ModalActions, formText, useSubmit } from "../forms";
import {
  ActionGroup,
  ConfirmModal,
  DataTable,
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
  useToast,
  type Column,
  type TabItem,
} from "../ui";

type TabId = "charges" | "incidents" | "paiements";

function StatusPill({ actif }: { actif: boolean }) {
  return actif ? <Pill tone="success">Actif</Pill> : <Pill tone="neutral">Inactif</Pill>;
}

export default function ConfigurationPage() {
  const notify = useToast();
  const [data, setData] = useState<ConfigData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("charges");
  const [addingCharge, setAddingCharge] = useState(false);
  const [editingCharge, setEditingCharge] = useState<TypeCharge | null>(null);
  const [deletingCharge, setDeletingCharge] = useState<TypeCharge | null>(null);

  useEffect(() => {
    let active = true;
    getConfig()
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

  const typesCharges = data?.typesCharges ?? [];
  const typesIncidents = data?.typesIncidents ?? [];
  const modesPaiement = data?.modesPaiement ?? [];

  const tabs: TabItem<TabId>[] = [
    { id: "charges", label: "Types de charges", icon: Receipt, count: typesCharges.length },
    { id: "incidents", label: "Types d'incidents", icon: Wrench, count: typesIncidents.length },
    { id: "paiements", label: "Modes de paiement", icon: CreditCard, count: modesPaiement.length },
  ];

  async function handleToggleCharge(c: TypeCharge) {
    try {
      await toggleChargeType(c.id);
      notify(`Statut de « ${c.nom} » mis à jour.`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  const chargeColumns: Column<TypeCharge>[] = [
    { header: "Type de charge", cell: (c) => <span className="font-semibold text-ink">{c.nom}</span> },
    { header: "Montant mensuel", cell: (c) => <Mono strong>{formatDZD(c.montantMensuel)}</Mono> },
    { header: "Appliqué à", cell: (c) => c.appliqueA },
    { header: "Statut", cell: (c) => <StatusPill actif={c.actif} /> },
    {
      header: "Action",
      align: "right",
      cell: (c) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => void handleToggleCharge(c)}
            className={button("secondary", "sm")}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            {c.actif ? "Désactiver" : "Activer"}
          </button>
          <ActionGroup
            onEdit={() => setEditingCharge(c)}
            onDelete={() => setDeletingCharge(c)}
          />
        </div>
      ),
    },
  ];

  const incidentColumns: Column<TypeIncident>[] = [
    { header: "Type d'incident", cell: (i) => <span className="font-semibold text-ink">{i.nom}</span> },
    { header: "Délai d'intervention", cell: (i) => <Pill tone="brand">{i.delaiIntervention}</Pill> },
    { header: "Prestataire par défaut", cell: (i) => i.prestataire },
    { header: "Statut", cell: (i) => <StatusPill actif={i.actif} /> },
  ];

  const paiementColumns: Column<ModePaiement>[] = [
    { header: "Mode de paiement", cell: (m) => <span className="font-semibold text-ink">{m.nom}</span> },
    { header: "Frais", cell: (m) => m.frais },
    { header: "Statut", cell: (m) => <StatusPill actif={m.actif} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SlidersHorizontal}
        title="Configuration & Types"
        subtitle="Paramètres de la résidence : charges, catégories d'incidents et moyens de paiement acceptés"
        actions={
          <button type="button" onClick={() => setAddingCharge(true)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouveau Type
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

          {tab === "charges" && <DataTable columns={chargeColumns} rows={typesCharges} rowKey={(c) => c.id} />}
          {tab === "incidents" && <DataTable columns={incidentColumns} rows={typesIncidents} rowKey={(i) => i.id} />}
          {tab === "paiements" && <DataTable columns={paiementColumns} rows={modesPaiement} rowKey={(m) => m.id} />}
        </>
      )}

      {addingCharge && (
        <NouveauTypeChargeModal
          onClose={() => setAddingCharge(false)}
          onCreated={() => {
            setAddingCharge(false);
            setVersion((v) => v + 1);
            notify("Type de charge ajouté avec succès.");
          }}
        />
      )}

      {editingCharge && (
        <EditTypeChargeModal
          charge={editingCharge}
          onClose={() => setEditingCharge(null)}
          onUpdated={() => {
            setEditingCharge(null);
            setVersion((v) => v + 1);
            notify("Type de charge modifié avec succès.");
          }}
        />
      )}

      <ConfirmModal
        open={Boolean(deletingCharge)}
        title="Supprimer le type de charge"
        message={`Êtes-vous sûr de vouloir supprimer le type de charge « ${deletingCharge?.nom} » ?`}
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (!deletingCharge) return;
          await deleteChargeType(deletingCharge.id);
          setDeletingCharge(null);
          setVersion((v) => v + 1);
          notify("Type de charge supprimé avec succès.");
        }}
        onCancel={() => setDeletingCharge(null)}
      />
    </div>
  );
}

function NouveauTypeChargeModal({
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
    void run(async () => {
      await addChargeType({
        nom: formText(form, "nom"),
        montantMensuel: Number(form.get("montantMensuel") ?? 1000),
        appliqueA: formText(form, "appliqueA") || "Tous les logements",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Nouveau Type de Charge" description="Ajouter une ligne de charge pour la résidence" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la charge" name="nom" required placeholder="Ex: Forfait gardiennage, Climatisation" autoFocus />
        <Field label="Montant mensuel (DZD)" name="montantMensuel" type="number" required defaultValue={1000} min={0} />
        <Field label="Appliqué à" name="appliqueA" defaultValue="Tous les logements" placeholder="Ex: Tous les logements, Réservé" />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter le type" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditTypeChargeModal({
  charge,
  onClose,
  onUpdated,
}: {
  charge: TypeCharge;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateChargeType(charge.id, {
        nom: formText(form, "nom"),
        montantMensuel: Number(form.get("montantMensuel") ?? 1000),
        appliqueA: formText(form, "appliqueA"),
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le Type de Charge" description={`Modification de « ${charge.nom} »`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la charge" name="nom" defaultValue={charge.nom} required autoFocus />
        <Field label="Montant mensuel (DZD)" name="montantMensuel" type="number" defaultValue={charge.montantMensuel} required min={0} />
        <Field label="Appliqué à" name="appliqueA" defaultValue={charge.appliqueA} required />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

