"use client";

import { BellRing, CalendarDays, Megaphone, Pin, Plus, Send, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createAnnonce,
  deleteAnnonce,
  getAnnonces,
  renvoyerAnnonce,
  updateAnnonce,
  type Annonce,
  type AnnoncesData,
} from "@/lib/annonces-api";
import { ModalActions, formText, useSubmit } from "../forms";
import { ALERT_STYLES, ActionGroup, ConfirmModal, Field, FormError, Modal, PageHeader, Pill, Tabs, button, card, describeError, useToast, type TabItem } from "../ui";

type TabId = "annonces" | "alertes";

export default function AnnoncesPage() {
  const notify = useToast();
  const [data, setData] = useState<AnnoncesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("annonces");
  const [addingAnnonce, setAddingAnnonce] = useState(false);
  const [editingAnnonce, setEditingAnnonce] = useState<Annonce | null>(null);
  const [deletingAnnonce, setDeletingAnnonce] = useState<Annonce | null>(null);

  useEffect(() => {
    let active = true;
    getAnnonces()
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

  const annonces = data?.annonces ?? [];
  const alertes = data?.alertes ?? [];

  const tabs: TabItem<TabId>[] = [
    { id: "annonces", label: "Annonces publiées", icon: Megaphone, count: annonces.length },
    { id: "alertes", label: "Alertes système", icon: BellRing, count: alertes.length },
  ];

  async function handleRenvoyer(a: Annonce) {
    try {
      await renvoyerAnnonce(a.id);
      notify(`Annonce « ${a.titre} » renvoyée aux résidents.`);
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Megaphone}
        title="Annonces & Alertes"
        subtitle="Communication avec les résidents par SMS, application et affichage"
        actions={
          <button type="button" onClick={() => setAddingAnnonce(true)} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Annonce
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

          {tab === "annonces" && (
            <div className="grid gap-4 lg:grid-cols-3">
              {annonces.map((a) => (
                <article key={a.id} className={`${card} flex flex-col p-5 ${a.epinglee ? "ring-1 ring-orange-200" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-ink">{a.titre}</h3>
                      {a.epinglee && (
                        <div className="mt-1">
                          <Pill tone="brand">
                            <Pin className="h-3 w-3" aria-hidden />
                            Épinglée
                          </Pill>
                        </div>
                      )}
                    </div>
                    <ActionGroup
                      editLabel="Modifier l'annonce"
                      deleteLabel="Supprimer l'annonce"
                      onEdit={() => setEditingAnnonce(a)}
                      onDelete={() => setDeletingAnnonce(a)}
                    />
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{a.contenu}</p>
                  <div className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-xs text-stone-500">
                    <p className="flex items-center gap-2">
                      <UsersRound className="h-3.5 w-3.5" aria-hidden />
                      {a.audience}
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                      {a.date}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="flex flex-wrap gap-1.5">
                        {a.canaux.map((c) => (
                          <Pill key={c}>{c}</Pill>
                        ))}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleRenvoyer(a)}
                        className={button("secondary", "sm")}
                      >
                        <Send className="h-3.5 w-3.5" aria-hidden />
                        Renvoyer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === "alertes" && (
            <ul className="space-y-3">
              {alertes.map((a) => {
                const { icon: Icon, className, label } = ALERT_STYLES[a.niveau] ?? ALERT_STYLES.info;
                return (
                  <li key={a.id} className={`${card} flex items-start gap-4 p-4`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-ink">{a.titre}</p>
                        <Pill tone={a.niveau === "critique" ? "danger" : a.niveau === "attention" ? "warning" : "neutral"}>{label}</Pill>
                      </div>
                      <p className="mt-0.5 text-sm text-stone-500">{a.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-stone-400">{a.date}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {addingAnnonce && (
        <NouvelleAnnonceModal
          onClose={() => setAddingAnnonce(false)}
          onCreated={() => {
            setAddingAnnonce(false);
            setVersion((v) => v + 1);
            notify("Annonce publiée avec succès.");
          }}
        />
      )}

      {editingAnnonce && (
        <EditAnnonceModal
          annonce={editingAnnonce}
          onClose={() => setEditingAnnonce(null)}
          onUpdated={() => {
            setEditingAnnonce(null);
            setVersion((v) => v + 1);
            notify("Annonce mise à jour avec succès.");
          }}
        />
      )}

      {deletingAnnonce && (
        <ConfirmModal
          isOpen={true}
          title="Supprimer l'annonce"
          message={`Êtes-vous sûr de vouloir supprimer l'annonce « ${deletingAnnonce.titre} » ?`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setDeletingAnnonce(null)}
          onConfirm={async () => {
            try {
              await deleteAnnonce(deletingAnnonce.id);
              notify(`Annonce « ${deletingAnnonce.titre} » supprimée.`);
              setDeletingAnnonce(null);
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

function EditAnnonceModal({
  annonce,
  onClose,
  onUpdated,
}: {
  annonce: Annonce;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [titre, setTitre] = useState(annonce.titre);
  const [contenu, setContenu] = useState(annonce.contenu);
  const [audience, setAudience] = useState(annonce.audience);
  const [epinglee, setEpinglee] = useState(annonce.epinglee);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateAnnonce(annonce.id, { titre, contenu, audience, epinglee });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier l'Annonce" description="Mettre à jour les informations de l'annonce" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre de l'annonce" value={titre} onChange={(e) => setTitre(e.target.value)} required autoFocus />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Contenu de l&apos;annonce</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm text-ink placeholder:text-stone-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <Field label="Audience ciblée" value={audience} onChange={(e) => setAudience(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={epinglee}
            onChange={(e) => setEpinglee(e.target.checked)}
            className="rounded border-stone-300 text-brand focus:ring-brand"
          />
          <span>Épingler en haut de l&apos;application</span>
        </label>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function NouvelleAnnonceModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [epinglee, setEpinglee] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createAnnonce({
        titre: formText(form, "titre"),
        contenu: formText(form, "contenu"),
        audience: formText(form, "audience") || "Tous les résidents",
        epinglee,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Nouvelle Annonce" description="Diffuser un message aux résidents de la copropriété" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Titre de l'annonce" name="titre" required placeholder="Ex: Travaux d'ascenseur, AG 2026" autoFocus />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Contenu de l&apos;annonce</label>
          <textarea
            name="contenu"
            required
            rows={4}
            className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm text-ink placeholder:text-stone-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Rédigez votre annonce ici..."
          />
        </div>
        <Field label="Audience ciblée" name="audience" defaultValue="Tous les résidents" placeholder="Ex: Tous les résidents, Bloc A" />
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            checked={epinglee}
            onChange={(e) => setEpinglee(e.target.checked)}
            className="rounded border-stone-300 text-brand focus:ring-brand"
          />
          <span>Épingler en haut de l&apos;application</span>
        </label>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Publier l'annonce" onCancel={onClose} />
      </form>
    </Modal>
  );
}
