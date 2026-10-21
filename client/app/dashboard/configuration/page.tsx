"use client";

import { CreditCard, Pencil, Plus, Receipt, SlidersHorizontal, Wrench } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  addChargeType,
  addIncidentType,
  addPaymentMode,
  deleteChargeType,
  deleteIncidentType,
  deletePaymentMode,
  getConfig,
  toggleChargeType,
  toggleIncidentType,
  togglePaymentMode,
  updateChargeType,
  updateIncidentType,
  updatePaymentMode,
  type ConfigData,
  type ModePaiement,
  type TypeCharge,
  type TypeIncident,
} from "@/lib/config-api";
import { formatDZD } from "@/lib/format";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
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

  // Creation modals
  const [addingCharge, setAddingCharge] = useState(false);
  const [addingIncident, setAddingIncident] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);

  // Edit modals
  const [editingCharge, setEditingCharge] = useState<TypeCharge | null>(null);
  const [editingIncident, setEditingIncident] = useState<TypeIncident | null>(null);
  const [editingPayment, setEditingPayment] = useState<ModePaiement | null>(null);

  // Delete modal
  const [deletingItem, setDeletingItem] = useState<{ kind: "charge" | "incident" | "paiement"; id: string; nom: string } | null>(null);

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

  async function handleToggleIncident(i: TypeIncident) {
    try {
      await toggleIncidentType(i.id);
      notify(`Statut de « ${i.nom} » mis à jour.`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  async function handleTogglePayment(m: ModePaiement) {
    try {
      await togglePaymentMode(m.id);
      notify(`Statut de « ${m.nom} » mis à jour.`);
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
            {c.actif ? "Désactiver" : "Activer"}
          </button>
          <ActionGroup
            onEdit={() => setEditingCharge(c)}
            onDelete={() => setDeletingItem({ kind: "charge", id: c.id, nom: c.nom })}
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
    {
      header: "Action",
      align: "right",
      cell: (i) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => void handleToggleIncident(i)}
            className={button("secondary", "sm")}
          >
            {i.actif ? "Désactiver" : "Activer"}
          </button>
          <ActionGroup
            onEdit={() => setEditingIncident(i)}
            onDelete={() => setDeletingItem({ kind: "incident", id: i.id, nom: i.nom })}
          />
        </div>
      ),
    },
  ];

  const paiementColumns: Column<ModePaiement>[] = [
    { header: "Mode de paiement", cell: (m) => <span className="font-semibold text-ink">{m.nom}</span> },
    { header: "Frais", cell: (m) => m.frais },
    { header: "Statut", cell: (m) => <StatusPill actif={m.actif} /> },
    {
      header: "Action",
      align: "right",
      cell: (m) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => void handleTogglePayment(m)}
            className={button("secondary", "sm")}
          >
            {m.actif ? "Désactiver" : "Activer"}
          </button>
          <ActionGroup
            onEdit={() => setEditingPayment(m)}
            onDelete={() => setDeletingItem({ kind: "paiement", id: m.id, nom: m.nom })}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SlidersHorizontal}
        title="Configuration & Types"
        subtitle="Paramètres de la résidence : charges, catégories d'incidents et moyens de paiement acceptés"
        actions={
          <>
            {tab === "charges" && (
              <button type="button" onClick={() => setAddingCharge(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Nouveau Type de Charge
              </button>
            )}
            {tab === "incidents" && (
              <button type="button" onClick={() => setAddingIncident(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Nouveau Type d&apos;Incident
              </button>
            )}
            {tab === "paiements" && (
              <button type="button" onClick={() => setAddingPayment(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Nouveau Mode de Paiement
              </button>
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
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "charges" && <DataTable columns={chargeColumns} rows={typesCharges} rowKey={(c) => c.id} empty="Aucun type de charge configuré." />}
          {tab === "incidents" && <DataTable columns={incidentColumns} rows={typesIncidents} rowKey={(i) => i.id} empty="Aucun type d'incident configuré." />}
          {tab === "paiements" && <DataTable columns={paiementColumns} rows={modesPaiement} rowKey={(m) => m.id} empty="Aucun moyen de paiement configuré." />}
        </>
      )}

      {/* MODALES CHARGES */}
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

      {/* MODALES INCIDENTS */}
      {addingIncident && (
        <NouveauTypeIncidentModal
          onClose={() => setAddingIncident(false)}
          onCreated={() => {
            setAddingIncident(false);
            setVersion((v) => v + 1);
            notify("Type d'incident ajouté avec succès.");
          }}
        />
      )}

      {editingIncident && (
        <EditTypeIncidentModal
          incident={editingIncident}
          onClose={() => setEditingIncident(null)}
          onUpdated={() => {
            setEditingIncident(null);
            setVersion((v) => v + 1);
            notify("Type d'incident modifié avec succès.");
          }}
        />
      )}

      {/* MODALES MODES DE PAIEMENT */}
      {addingPayment && (
        <NouveauModePaiementModal
          onClose={() => setAddingPayment(false)}
          onCreated={() => {
            setAddingPayment(false);
            setVersion((v) => v + 1);
            notify("Moyen de paiement ajouté avec succès.");
          }}
        />
      )}

      {editingPayment && (
        <EditModePaiementModal
          payment={editingPayment}
          onClose={() => setEditingPayment(null)}
          onUpdated={() => {
            setEditingPayment(null);
            setVersion((v) => v + 1);
            notify("Moyen de paiement modifié avec succès.");
          }}
        />
      )}

      {/* SUPPRESSION UNIFIÉE */}
      {deletingItem && (
        <ConfirmModal
          isOpen={true}
          title={`Supprimer ${deletingItem.kind === "charge" ? "le type de charge" : deletingItem.kind === "incident" ? "le type d'incident" : "le mode de paiement"}`}
          message={`Êtes-vous sûr de vouloir supprimer « ${deletingItem.nom} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={async () => {
            try {
              if (deletingItem.kind === "charge") {
                await deleteChargeType(deletingItem.id);
              } else if (deletingItem.kind === "incident") {
                await deleteIncidentType(deletingItem.id);
              } else {
                await deletePaymentMode(deletingItem.id);
              }
              setDeletingItem(null);
              setVersion((v) => v + 1);
              notify("Élément supprimé avec succès.");
            } catch (err) {
              notify(describeError(err).message);
            }
          }}
          onCancel={() => setDeletingItem(null)}
        />
      )}
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
    <Modal title="Nouveau type de charge" description="Définir une charge de copropriété récurrente" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la charge" name="nom" required placeholder="Ex: Charges générales de copropriété" autoFocus />
        <Field label="Montant mensuel (DZD)" name="montantMensuel" type="number" required placeholder="Ex: 3500" min={0} />
        <Field label="Appliqué à" name="appliqueA" required defaultValue="Tous les logements" />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter la charge" onCancel={onClose} />
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
  const [nom, setNom] = useState(charge.nom);
  const [montantMensuel, setMontantMensuel] = useState(charge.montantMensuel);
  const [appliqueA, setAppliqueA] = useState(charge.appliqueA);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateChargeType(charge.id, { nom, montantMensuel: Number(montantMensuel), appliqueA });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le type de charge" description="Mettre à jour le barème de la charge" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la charge" value={nom} onChange={(e) => setNom(e.target.value)} required autoFocus />
        <Field label="Montant mensuel (DZD)" type="number" value={montantMensuel} onChange={(e) => setMontantMensuel(Number(e.target.value))} required min={0} />
        <Field label="Appliqué à" value={appliqueA} onChange={(e) => setAppliqueA(e.target.value)} required />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouveauTypeIncidentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [delai, setDelai] = useState("24h");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await addIncidentType({
        nom: formText(form, "nom"),
        delaiIntervention: delai,
        prestataire: formText(form, "prestataire") || "À désigner",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Nouveau type d'incident" description="Catégoriser les pannes et assigner un délai d'intervention" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Catégorie / Nom de l'incident" name="nom" required placeholder="Ex: Panne d'ascenseur, Fuite plomberie" autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Délai d'intervention cible" value={delai} onChange={(e) => setDelai(e.target.value)}>
            <option value="Urgent (2h)">Urgent (2h)</option>
            <option value="Moyen (24h)">Moyen (24h)</option>
            <option value="Standard (48h)">Standard (48h)</option>
            <option value="Planifié (7j)">Planifié (7j)</option>
          </SelectField>
          <Field label="Prestataire assigné par défaut" name="prestataire" placeholder="Ex: SARL Otis Algérie, Plomberie Express" />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter le type d'incident" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditTypeIncidentModal({
  incident,
  onClose,
  onUpdated,
}: {
  incident: TypeIncident;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(incident.nom);
  const [delaiIntervention, setDelaiIntervention] = useState(incident.delaiIntervention);
  const [prestataire, setPrestataire] = useState(incident.prestataire);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateIncidentType(incident.id, { nom, delaiIntervention, prestataire });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le type d'incident" description="Mettre à jour les paramètres d'intervention" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Catégorie / Nom" value={nom} onChange={(e) => setNom(e.target.value)} required autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Délai cible" value={delaiIntervention} onChange={(e) => setDelaiIntervention(e.target.value)}>
            <option value="Urgent (2h)">Urgent (2h)</option>
            <option value="Moyen (24h)">Moyen (24h)</option>
            <option value="Standard (48h)">Standard (48h)</option>
            <option value="Planifié (7j)">Planifié (7j)</option>
          </SelectField>
          <Field label="Prestataire par défaut" value={prestataire} onChange={(e) => setPrestataire(e.target.value)} />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouveauModePaiementModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState("BaridiMob (Algérie Poste)");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await addPaymentMode({
        nom: formText(form, "nom") || nom,
        frais: formText(form, "frais") || "Gratuit",
      });
      onCreated();
    });
  }

  return (
    <Modal title="Ajouter un mode de paiement" description="Moyens de paiement acceptés pour les charges de copropriété" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <SelectField label="Moyen de paiement prédéfini" value={nom} onChange={(e) => setNom(e.target.value)}>
          <option value="BaridiMob (Algérie Poste)">BaridiMob (Algérie Poste)</option>
          <option value="Carte Edahabia (Algérie Poste)">Carte Edahabia (Algérie Poste)</option>
          <option value="Carte CIB (Banques algériennes)">Carte CIB (Banques algériennes)</option>
          <option value="Virement bancaire / CCP">Virement bancaire / CCP</option>
          <option value="Paiement en espèces au bureau du syndic">Paiement en espèces au bureau du syndic</option>
          <option value="Chèque bancaire">Chèque bancaire</option>
          <option value="Autre mode personnalisé">Autre mode personnalisé...</option>
        </SelectField>
        {nom === "Autre mode personnalisé" && (
          <Field label="Nom personnalisé du moyen de paiement" name="nom" required placeholder="Ex: Mandat postal express" autoFocus />
        )}
        <Field label="Frais applicables" name="frais" required defaultValue="Sans frais" placeholder="Ex: Gratuit, Sans frais, 1.5%..." />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Activer le mode de paiement" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditModePaiementModal({
  payment,
  onClose,
  onUpdated,
}: {
  payment: ModePaiement;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(payment.nom);
  const [frais, setFrais] = useState(payment.frais);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updatePaymentMode(payment.id, { nom, frais });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le mode de paiement" description="Paramètres d'encaissement" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom du moyen de paiement" value={nom} onChange={(e) => setNom(e.target.value)} required autoFocus />
        <Field label="Frais applicables" value={frais} onChange={(e) => setFrais(e.target.value)} required />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
