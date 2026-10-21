"use client";

import { Droplets, History, Plus, Siren, TriangleAlert, Wrench } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createIncident,
  deleteIncident,
  getMaintenance,
  updateIncident,
  updateIncidentStatut,
  type Incident,
  type InterventionPassee,
  type MaintenanceData,
  type PanneEquipement,
  type Priorite,
} from "@/lib/maintenance-api";
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
  type Tone,
} from "../ui";

type TabId = "incidents" | "pannes" | "historique";

const PRIORITE_TONE: Record<Priorite, Tone> = { Haute: "danger", Moyenne: "warning", Basse: "neutral" };

export default function MaintenancePage() {
  const notify = useToast();
  const [data, setData] = useState<MaintenanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("incidents");

  // Creation modals
  const [reporting, setReporting] = useState(false);
  const [addingPanne, setAddingPanne] = useState(false);
  const [addingIntervention, setAddingIntervention] = useState(false);

  // Edit / Close modals
  const [cloturantIncident, setCloturantIncident] = useState<{ id: string; titre: string; prestataire: string } | null>(null);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [deletingIncident, setDeletingIncident] = useState<{ id: string; titre?: string } | null>(null);

  useEffect(() => {
    let active = true;
    getMaintenance()
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

  const incidents = data?.incidents ?? [];
  const pannesEquipement = data?.pannesEquipement ?? [];
  const historiqueInterventions = data?.historiqueInterventions ?? [];

  const tabs: TabItem<TabId>[] = [
    { id: "incidents", label: "Incidents actifs", icon: Droplets, count: incidents.length },
    { id: "pannes", label: "Pannes d'équipement", icon: Siren, count: pannesEquipement.length },
    { id: "historique", label: "Historique", icon: History, count: historiqueInterventions.length },
  ];

  async function handlePrendreEnCharge(i: Incident) {
    try {
      await updateIncidentStatut(i.id, "En cours");
      notify(`Incident « ${i.titre} » pris en charge (En cours).`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

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
    { header: "Statut", cell: (i) => <Pill tone={i.statut === "En cours" ? "warning" : "brand"}>{i.statut}</Pill> },
    {
      header: "Action",
      align: "right",
      cell: (i) => (
        <span className="inline-flex items-center gap-2">
          {i.statut === "Nouveau" ? (
            <button
              type="button"
              onClick={() => void handlePrendreEnCharge(i)}
              className={button("secondary", "sm")}
            >
              Prendre en charge
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCloturantIncident({ id: i.id, titre: i.titre, prestataire: i.prestataire })}
              className={button("primary", "sm")}
            >
              Clôturer
            </button>
          )}
          <ActionGroup
            editLabel="Modifier incident"
            deleteLabel="Supprimer incident"
            onEdit={() => setEditingIncident(i)}
            onDelete={() => setDeletingIncident({ id: i.id, titre: i.titre })}
          />
        </span>
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
        <span className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => notify(`Notification de relance envoyée au prestataire ${p.prestataire}.`)}
            className={button("secondary", "sm")}
          >
            Relancer
          </button>
          <button
            type="button"
            onClick={() => setCloturantIncident({ id: p.id, titre: p.equipement, prestataire: p.prestataire })}
            className={button("primary", "sm")}
          >
            Réparé
          </button>
          <ActionGroup
            editLabel="Modifier panne"
            deleteLabel="Supprimer panne"
            onEdit={() =>
              setEditingIncident({
                id: p.id,
                titre: p.equipement,
                lieu: p.lieu,
                signaleLe: p.depuis,
                priorite: "Haute",
                prestataire: p.prestataire,
                statut: p.statut,
                signalePar: "Système",
              })
            }
            onDelete={() => setDeletingIncident({ id: p.id, titre: p.equipement })}
          />
        </span>
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
    { label: "Pannes d'équipement", value: String(pannesEquipement.length) },
    { label: "Interventions clôturées", value: String(historiqueInterventions.length) },
    { label: "Disponibilité équipements", value: "98.5%" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title="Maintenance & Pannes"
        subtitle="Incidents signalés, pannes d'équipement et suivi des interventions des prestataires"
        actions={
          <>
            {tab === "incidents" && (
              <button type="button" onClick={() => setReporting(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Signaler Incident
              </button>
            )}
            {tab === "pannes" && (
              <button type="button" onClick={() => setAddingPanne(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Déclarer Panne d&apos;Équipement
              </button>
            )}
            {tab === "historique" && (
              <button type="button" onClick={() => setAddingIntervention(true)} className={button("primary")}>
                <Plus className="h-4 w-4" aria-hidden />
                Consigner Intervention Réalisée
              </button>
            )}
          </>
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

      {error && <FormError error={{ message: error, details: [] }} />}

      {!data && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : (
        <>
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "incidents" && <DataTable columns={incidentColumns} rows={incidents} rowKey={(i) => i.id} empty="Aucun incident actif." />}
          {tab === "pannes" && <DataTable columns={panneColumns} rows={pannesEquipement} rowKey={(p) => p.id} empty="Tous les équipements sont opérationnels." />}
          {tab === "historique" && <DataTable columns={historiqueColumns} rows={historiqueInterventions} rowKey={(h) => h.id} empty="Aucune intervention consignée." />}
        </>
      )}

      {/* MODALE SIGNALER INCIDENT */}
      {reporting && (
        <SignalerIncidentModal
          onClose={() => setReporting(false)}
          onCreated={() => {
            setReporting(false);
            setVersion((v) => v + 1);
            notify("Incident enregistré et notifié aux résidents.");
          }}
        />
      )}

      {/* MODALE DÉCLARER PANNE ÉQUIPEMENT */}
      {addingPanne && (
        <DeclarerPanneModal
          onClose={() => setAddingPanne(false)}
          onCreated={() => {
            setAddingPanne(false);
            setVersion((v) => v + 1);
            notify("Panne d'équipement déclarée et notifiée aux résidents.");
          }}
        />
      )}

      {/* MODALE CONSIGNER INTERVENTION RÉALISÉE */}
      {addingIntervention && (
        <ConsignerInterventionModal
          onClose={() => setAddingIntervention(false)}
          onCreated={() => {
            setAddingIntervention(false);
            setVersion((v) => v + 1);
            notify("Intervention archivée dans l'historique.");
          }}
        />
      )}

      {/* MODALE CLÔTURER AVEC COÛT */}
      {cloturantIncident && (
        <CloturerIncidentModal
          incident={cloturantIncident}
          onClose={() => setCloturantIncident(null)}
          onClosed={() => {
            setCloturantIncident(null);
            setVersion((v) => v + 1);
            notify("Incident clôturé avec succès et basculé dans l'historique.");
          }}
        />
      )}

      {/* MODALE ÉDITER */}
      {editingIncident && (
        <EditIncidentModal
          incident={editingIncident}
          onClose={() => setEditingIncident(null)}
          onUpdated={() => {
            setEditingIncident(null);
            setVersion((v) => v + 1);
            notify("Incident mis à jour avec succès.");
          }}
        />
      )}

      {/* MODALE SUPPRIMER */}
      {deletingIncident && (
        <ConfirmModal
          isOpen={true}
          title="Supprimer l'incident"
          message={`Êtes-vous sûr de vouloir supprimer ${deletingIncident.titre ? `« ${deletingIncident.titre} »` : "cet incident"} ?`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setDeletingIncident(null)}
          onConfirm={async () => {
            try {
              await deleteIncident(deletingIncident.id);
              notify("Incident supprimé.");
              setDeletingIncident(null);
              setVersion((v) => v + 1);
            } catch (err) {
              notify(describeError(err).message);
            }
          }}
        />
      )}
    </div>
  );
}

function SignalerIncidentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [priorite, setPriorite] = useState<Priorite>("Moyenne");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createIncident({
        titre: formText(form, "titre"),
        lieu: formText(form, "lieu"),
        signalePar: formText(form, "signalePar"),
        prestataire: formText(form, "prestataire") || "À désigner",
        priorite,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Signaler un incident" description="Enregistrement d'un incident ou d'une anomalie générale" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre de l'incident" name="titre" required placeholder="Ex: Fuite d'eau colonne générale, ampoules grillées" autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Localisation" name="lieu" required placeholder="Ex: Bloc A · 2e étage" />
          <Field label="Signalé par" name="signalePar" required defaultValue="Syndic / Gardien" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Priorité" value={priorite} onChange={(e) => setPriorite(e.target.value as Priorite)}>
            <option value="Haute">Haute (Urgent)</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </SelectField>
          <Field label="Prestataire assigné" name="prestataire" placeholder="Ex: Plomberie Express (facultatif)" />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer l'incident" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function DeclarerPanneModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [equipement, setEquipement] = useState("Ascenseur Bloc A");
  const [priorite, setPriorite] = useState<Priorite>("Haute");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const equipementNom = formText(form, "equipementCustom") || equipement;
    void run(async () => {
      await createIncident({
        titre: `Panne ${equipementNom}`,
        equipement: equipementNom,
        isPanneEquipement: true,
        lieu: formText(form, "lieu"),
        signalePar: "Système / Syndic",
        prestataire: formText(form, "prestataire") || "Prestataire sous contrat",
        priorite,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Déclarer une panne d'équipement" description="Équipements communs sous contrat ou lourds de la résidence" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <SelectField label="Équipement en panne" value={equipement} onChange={(e) => setEquipement(e.target.value)}>
          <option value="Ascenseur Bloc A">Ascenseur Bloc A</option>
          <option value="Ascenseur Bloc B">Ascenseur Bloc B</option>
          <option value="Bâche à eau & Pompe de relevage">Bâche à eau & Pompe de relevage</option>
          <option value="Groupe électrogène de secours">Groupe électrogène de secours</option>
          <option value="Barrière automatique de parking">Barrière automatique de parking</option>
          <option value="Interphone & Digicode entrée">Interphone & Digicode entrée</option>
          <option value="Autre équipement">Autre équipement...</option>
        </SelectField>
        {equipement === "Autre équipement" && (
          <Field label="Nom de l'équipement" name="equipementCustom" required placeholder="Ex: Porte automatique garage" autoFocus />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Localisation" name="lieu" required placeholder="Ex: Sous-sol, Hall d'entrée" />
          <Field label="Prestataire contractuel" name="prestataire" placeholder="Ex: SARL Otis Algérie, SARL Énergie" />
        </div>
        <SelectField label="Niveau d'urgence" value={priorite} onChange={(e) => setPriorite(e.target.value as Priorite)}>
          <option value="Haute">Haute (Bloquant / Intervention sous 2h)</option>
          <option value="Moyenne">Moyenne (Sous 24h)</option>
          <option value="Basse">Basse</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Déclarer la panne" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function ConsignerInterventionModal({
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
      await createIncident({
        titre: formText(form, "titre"),
        lieu: formText(form, "lieu"),
        prestataire: formText(form, "prestataire") || "Prestataire",
        signalePar: "Syndic",
        priorite: "Moyenne",
        statut: "Résolu",
        cout: Number(formText(form, "cout")),
        clotureLe: formText(form, "clotureLe") || new Date().toLocaleDateString("fr-FR"),
      });
      onCreated();
    });
  }

  return (
    <Modal title="Consigner une intervention réalisée" description="Archiver des travaux ou une réparation effectuée avec coût" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Objet des travaux / réparation" name="titre" required placeholder="Ex: Remplacement vanne générale d'arrivée d'eau" autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Localisation" name="lieu" required placeholder="Ex: Bloc A · Local technique" />
          <Field label="Prestataire ayant intervenu" name="prestataire" required placeholder="Ex: Plomberie Express" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Coût de l'intervention (DZD)" name="cout" type="number" required placeholder="Ex: 18500" min={0} />
          <Field label="Date d'achèvement" name="clotureLe" required defaultValue={new Date().toLocaleDateString("fr-FR")} />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer dans l'historique" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function CloturerIncidentModal({
  incident,
  onClose,
  onClosed,
}: {
  incident: { id: string; titre: string; prestataire: string };
  onClose: () => void;
  onClosed: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateIncident(incident.id, {
        statut: "Résolu",
        prestataire: formText(form, "prestataire") || incident.prestataire,
        cout: Number(formText(form, "cout") || 0),
        clotureLe: new Date().toLocaleDateString("fr-FR"),
      });
      onClosed();
    });
  }

  return (
    <Modal title={`Clôturer « ${incident.titre} »`} description="Valider la fin des réparations et enregistrer le coût" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Prestataire ayant effectué la réparation" name="prestataire" defaultValue={incident.prestataire} required />
        <Field label="Coût final de l'intervention (DZD)" name="cout" type="number" required defaultValue="0" min={0} autoFocus />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Valider et clôturer" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditIncidentModal({
  incident,
  onClose,
  onUpdated,
}: {
  incident: Incident;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [titre, setTitre] = useState(incident.titre);
  const [lieu, setLieu] = useState(incident.lieu);
  const [priorite, setPriorite] = useState<Priorite>(incident.priorite);
  const [prestataire, setPrestataire] = useState(incident.prestataire);
  const [statut, setStatut] = useState(incident.statut);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateIncident(incident.id, { titre, lieu, priorite, prestataire, statut });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier l'incident / panne" description="Mettre à jour les informations d'intervention" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre / Équipement" value={titre} onChange={(e) => setTitre(e.target.value)} required autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Localisation" value={lieu} onChange={(e) => setLieu(e.target.value)} required />
          <Field label="Prestataire assigné" value={prestataire} onChange={(e) => setPrestataire(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Priorité" value={priorite} onChange={(e) => setPriorite(e.target.value as Priorite)}>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </SelectField>
          <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="Nouveau">Nouveau</option>
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
            <option value="Planifié">Planifié</option>
          </SelectField>
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
