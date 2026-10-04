"use client";

import { Clock, ListChecks, Phone, Plus, UserCog, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createTache,
  getPersonnel,
  updateTacheStatut,
  type Employe,
  type PersonnelData,
  type Tache,
} from "@/lib/personnel-api";
import { ModalActions, formText, useSubmit } from "../forms";
import { Avatar, DataTable, Field, FormError, Modal, Mono, PageHeader, Pill, Tabs, button, card, describeError, useToast, type Column, type TabItem, type Tone } from "../ui";

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
        <button
          type="button"
          onClick={() => void handleToggleTache(t)}
          className={button("secondary", "sm")}
        >
          {t.statut === "Terminée" ? "Réouvrir" : "Marquer terminée"}
        </button>
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
          <button type="button" onClick={() => setAddingTache(true)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Tâche
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

          {tab === "taches" && <DataTable columns={tacheColumns} rows={taches} rowKey={(t) => t.id} empty="Aucune tâche en cours." />}

          {tab === "personnel" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {personnel.map((e) => (
                <article key={e.id} className={`${card} flex flex-col p-5`}>
                  <div className="flex items-start justify-between gap-2">
                    <Avatar name={e.nom} size="lg" />
                    <Pill tone={EMPLOYE_TONE[e.statut]}>{e.statut}</Pill>
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
