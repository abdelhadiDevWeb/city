"use client";

import { Clock, ListChecks, Phone, Plus, UserCog, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createPersonnel,
  createTache,
  deletePersonnel,
  deleteTache,
  getPersonnel,
  updatePersonnel,
  updateTache,
  updateTacheStatut,
  type Employe,
  type PersonnelData,
  type Tache,
} from "@/lib/personnel-api";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import { ActionGroup, Avatar, ConfirmModal, DataTable, Field, FormError, Modal, Mono, PageHeader, Pill, Tabs, button, card, describeError, useToast, type Column, type TabItem, type Tone } from "../ui";

type TabId = "taches" | "personnel";

const TACHE_TONE: Record<Tache["statut"], Tone> = { "À faire": "neutral", "En cours": "brand", Terminée: "success" };
const EMPLOYE_TONE: Record<Employe["statut"], Tone> = { "En service": "success", Repos: "neutral", Congé: "warning" };

export default function PersonnelPage() {
  const notify = useToast();
  const [data, setData] = useState<PersonnelData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("taches");
  const [addingTache, setAddingTache] = useState(false);
  const [addingEmploye, setAddingEmploye] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState<Employe | null>(null);
  const [editingTache, setEditingTache] = useState<Tache | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "personnel" | "tache"; id: string; nom: string } | null>(null);

  useEffect(() => {
    let active = true;
    getPersonnel()
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

  const taches = data?.taches ?? [];
  const personnel = data?.personnel ?? [];

  const tabs: TabItem<TabId>[] = [
    { id: "taches", label: "Tâches", icon: ListChecks, count: taches.filter((t) => t.statut !== "Terminée").length },
    { id: "personnel", label: "Personnel", icon: UsersRound, count: personnel.length },
  ];

  async function handleToggleTache(t: Tache) {
    const nextStatut = t.statut === "Terminée" ? "En cours" : "Terminée";
    try {
      await updateTacheStatut(t.id, nextStatut);
      notify(`Tâche « ${t.titre} » marquée comme ${nextStatut}.`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  const tacheColumns: Column<Tache>[] = [
    {
      header: "Tâche",
      cell: (t) => (
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-ink">{t.titre}</span>
          {t.urgente && <Pill tone="danger">Urgente</Pill>}
        </span>
      ),
    },
    { header: "Assignée à", cell: (t) => t.assigneA },
    { header: "Lieu", cell: (t) => t.lieu },
    { header: "Échéance", cell: (t) => <span className="text-stone-500">{t.echeance}</span> },
    { header: "Statut", cell: (t) => <Pill tone={TACHE_TONE[t.statut]}>{t.statut}</Pill> },
    {
      header: "Action",
      align: "right",
      cell: (t) => (
        <span className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleToggleTache(t)}
            className={button("secondary", "sm")}
          >
            {t.statut === "Terminée" ? "Réouvrir" : "Marquer terminée"}
          </button>
          <ActionGroup
            editLabel="Modifier tâche"
            deleteLabel="Supprimer tâche"
            onEdit={() => setEditingTache(t)}
            onDelete={() => setConfirmDelete({ kind: "tache", id: t.id, nom: t.titre })}
          />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCog}
        title="Personnel & Tâches"
        subtitle="Équipe de la résidence, horaires et suivi des tâches assignées"
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => setAddingEmploye(true)} className={button("secondary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Nouvel Employé
            </button>
            <button type="button" onClick={() => setAddingTache(true)} className={button("primary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Nouvelle Tâche
            </button>
          </div>
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

          {tab === "taches" && <DataTable columns={tacheColumns} rows={taches} rowKey={(t) => t.id} empty="Aucune tâche en cours." />}

          {tab === "personnel" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {personnel.map((e) => (
                <article key={e.id} className={`${card} flex flex-col p-5`}>
                  <div className="flex items-start justify-between gap-2">
                    <Avatar name={e.nom} size="lg" />
                    <div className="flex flex-col items-end gap-1.5">
                      <Pill tone={EMPLOYE_TONE[e.statut]}>{e.statut}</Pill>
                      <ActionGroup
                        editLabel="Modifier employé"
                        deleteLabel="Supprimer employé"
                        onEdit={() => setEditingEmploye(e)}
                        onDelete={() => setConfirmDelete({ kind: "personnel", id: e.id, nom: e.nom })}
                      />
                    </div>
                  </div>
                  <p className="mt-4 font-bold text-ink">{e.nom}</p>
                  <p className="text-xs text-stone-500">{e.poste}</p>
                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
                    <a href={`tel:${e.telephone}`} className="flex items-center gap-2 text-stone-600 hover:text-brand">
                      <Phone className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                      <Mono>{e.telephone}</Mono>
                    </a>
                    <p className="flex items-center gap-2 text-stone-600">
                      <Clock className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                      {e.horaire}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {addingTache && (
        <NouvelleTacheModal
          onClose={() => setAddingTache(false)}
          onCreated={() => {
            setAddingTache(false);
            setVersion((v) => v + 1);
            notify("Tâche ajoutée avec succès.");
          }}
        />
      )}

      {addingEmploye && (
        <NouvelEmployeModal
          onClose={() => setAddingEmploye(false)}
          onCreated={() => {
            setAddingEmploye(false);
            setVersion((v) => v + 1);
            notify("Employé ajouté avec succès.");
          }}
        />
      )}

      {editingEmploye && (
        <EditEmployeModal
          employe={editingEmploye}
          onClose={() => setEditingEmploye(null)}
          onUpdated={() => {
            setEditingEmploye(null);
            setVersion((v) => v + 1);
            notify("Employé mis à jour avec succès.");
          }}
        />
      )}

      {editingTache && (
        <EditTacheModal
          tache={editingTache}
          onClose={() => setEditingTache(null)}
          onUpdated={() => {
            setEditingTache(null);
            setVersion((v) => v + 1);
            notify("Tâche mise à jour avec succès.");
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          title={`Supprimer ${confirmDelete.kind === "personnel" ? "l'employé" : "la tâche"}`}
          message={`Êtes-vous sûr de vouloir supprimer « ${confirmDelete.nom} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            try {
              if (confirmDelete.kind === "personnel") {
                await deletePersonnel(confirmDelete.id);
                notify("Employé supprimé.");
              } else {
                await deleteTache(confirmDelete.id);
                notify("Tâche supprimée.");
              }
              setConfirmDelete(null);
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

function NouvelleTacheModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [urgente, setUrgente] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createTache({
        titre: formText(form, "titre"),
        assigneA: formText(form, "assigneA"),
        lieu: formText(form, "lieu"),
        echeance: formText(form, "echeance"),
        urgente,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Nouvelle Tâche" description="Assigner une tâche à l'équipe de la résidence" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Description de la tâche" name="titre" required placeholder="Ex: Nettoyage des escaliers" autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Assignée à" name="assigneA" required placeholder="Ex: Ahmed Meziani" />
          <Field label="Lieu" name="lieu" required placeholder="Ex: Bloc A & B" />
        </div>
        <Field label="Échéance" name="echeance" required placeholder="Ex: Aujourd'hui 17:00" />
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={urgente}
            onChange={(e) => setUrgente(e.target.checked)}
            className="rounded border-stone-300 text-brand focus:ring-brand"
          />
          <span>Tâche urgente</span>
        </label>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer la tâche" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouvelEmployeModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [statut, setStatut] = useState<"En service" | "Repos" | "Congé">("En service");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createPersonnel({
        nom: formText(form, "nom"),
        poste: formText(form, "poste"),
        telephone: formText(form, "telephone"),
        horaire: formText(form, "horaire"),
        statut,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Nouvel Employé" description="Ajouter un membre à l'équipe de la copropriété" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" name="nom" required placeholder="Ex: Karim Hadj" autoFocus />
          <Field label="Poste / Rôle" name="poste" required placeholder="Ex: Agent de sécurité, Agent d'entretien" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" name="telephone" required placeholder="0555123456" />
          <Field label="Horaire de travail" name="horaire" required placeholder="Ex: 08:00 - 16:00" />
        </div>
        <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
          <option value="En service">En service</option>
          <option value="Repos">Repos</option>
          <option value="Congé">Congé</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter l'employé" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditEmployeModal({
  employe,
  onClose,
  onUpdated,
}: {
  employe: Employe;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(employe.nom);
  const [poste, setPoste] = useState(employe.poste);
  const [telephone, setTelephone] = useState(employe.telephone);
  const [horaire, setHoraire] = useState(employe.horaire);
  const [statut, setStatut] = useState(employe.statut);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updatePersonnel(employe.id, { nom, poste, telephone, horaire, statut });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier l'employé" description="Mettre à jour les coordonnées et horaires de l'employé" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required autoFocus />
          <Field label="Poste / Rôle" value={poste} onChange={(e) => setPoste(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
          <Field label="Horaire de travail" value={horaire} onChange={(e) => setHoraire(e.target.value)} required />
        </div>
        <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
          <option value="En service">En service</option>
          <option value="Repos">Repos</option>
          <option value="Congé">Congé</option>
        </SelectField>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditTacheModal({
  tache,
  onClose,
  onUpdated,
}: {
  tache: Tache;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [titre, setTitre] = useState(tache.titre);
  const [assigneA, setAssigneA] = useState(tache.assigneA);
  const [lieu, setLieu] = useState(tache.lieu);
  const [echeance, setEcheance] = useState(tache.echeance);
  const [statut, setStatut] = useState(tache.statut);
  const [urgente, setUrgente] = useState(tache.urgente);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateTache(tache.id, { titre, assigneA, lieu, echeance, statut, urgente });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier la tâche" description="Mettre à jour les détails de la tâche" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Description de la tâche" value={titre} onChange={(e) => setTitre(e.target.value)} required autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Assignée à" value={assigneA} onChange={(e) => setAssigneA(e.target.value)} required />
          <Field label="Lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Échéance" value={echeance} onChange={(e) => setEcheance(e.target.value)} required />
          <SelectField label="Statut" value={statut} onChange={(e) => setStatut(e.target.value as any)}>
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminée">Terminée</option>
          </SelectField>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={urgente}
            onChange={(e) => setUrgente(e.target.checked)}
            className="rounded border-stone-300 text-brand focus:ring-brand"
          />
          <span>Tâche urgente</span>
        </label>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
