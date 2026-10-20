"use client";

import { AlertTriangle, BellRing, CalendarDays, Megaphone, Pin, Plus, Send, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createAlerte,
  createAnnonce,
  deleteAlerte,
  deleteAnnonce,
  getAnnonces,
  renvoyerAlerte,
  renvoyerAnnonce,
  updateAlerte,
  updateAnnonce,
  type Alerte,
  type Annonce,
  type AnnoncesData,
} from "@/lib/annonces-api";
import { ModalActions, formText, useSubmit } from "../forms";
import {
  ALERT_STYLES,
  ActionGroup,
  ConfirmModal,
  Field,
  FormError,
  Modal,
  PageHeader,
  Pill,
  Tabs,
  button,
  card,
  describeError,
  useToast,
  type TabItem,
} from "../ui";

type TabId = "annonces" | "alertes";

export default function AnnoncesPage() {
  const notify = useToast();
  const [data, setData] = useState<AnnoncesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("annonces");

  // Annonces states
  const [addingAnnonce, setAddingAnnonce] = useState(false);
  const [editingAnnonce, setEditingAnnonce] = useState<Annonce | null>(null);
  const [deletingAnnonce, setDeletingAnnonce] = useState<Annonce | null>(null);

  // Alertes states
  const [addingAlerte, setAddingAlerte] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState<Alerte | null>(null);
  const [deletingAlerte, setDeletingAlerte] = useState<Alerte | null>(null);

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
    { id: "alertes", label: "Alertes d'urgence", icon: BellRing, count: alertes.length },
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

  async function handleRenvoyerAlerte(a: Alerte) {
    try {
      await renvoyerAlerte(a.id);
      notify(`Alerte « ${a.titre} » renvoyée en priorité aux résidents.`);
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
        subtitle="Communication en direct avec les résidents par notification push, application et affichage"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAddingAnnonce(true)}
              className={button("secondary")}
            >
              <Megaphone className="h-4 w-4" aria-hidden />
              Nouvelle Annonce
            </button>
            <button
              type="button"
              onClick={() => setAddingAlerte(true)}
              className={button("primary")}
            >
              <AlertTriangle className="h-4 w-4 text-amber-200" aria-hidden />
              Créer une Alerte
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

          {tab === "annonces" && (
            <div className="space-y-4">
              {annonces.length === 0 ? (
                <div className={`${card} flex flex-col items-center justify-center p-12 text-center`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                    <Megaphone className="h-6 w-6" aria-hidden />
                  </div>
                  <h4 className="mt-3 font-semibold text-ink">Aucune annonce publiée</h4>
                  <p className="mt-1 max-w-sm text-sm text-stone-500">
                    Partagez des informations générales, dates d&apos;AG ou avis avec les résidents.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddingAnnonce(true)}
                    className={`${button("primary", "sm")} mt-4`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    Publier la première annonce
                  </button>
                </div>
              ) : (
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
            </div>
          )}

          {tab === "alertes" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <BellRing className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-red-950">Diffusion prioritaire d&apos;urgence</p>
                    <p className="text-xs text-red-700">
                      Les alertes sont diffusées en push haute priorité avec sonnerie et bandeau d&apos;urgence visible sur l&apos;application.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddingAlerte(true)}
                  className={button("primary", "sm")}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  Nouvelle Alerte
                </button>
              </div>

              {alertes.length === 0 ? (
                <div className={`${card} flex flex-col items-center justify-center p-12 text-center`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                    <BellRing className="h-6 w-6" aria-hidden />
                  </div>
                  <h4 className="mt-3 font-semibold text-ink">Aucune alerte enregistrée</h4>
                  <p className="mt-1 max-w-sm text-sm text-stone-500">
                    Diffusez une consigne immédiate ou signalez une urgence (coupure d&apos;eau, panne, sécurité) à toute la copropriété.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddingAlerte(true)}
                    className={`${button("primary", "sm")} mt-4`}
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    Créer la première alerte
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {alertes.map((a) => {
                    const { icon: Icon, className, label } = ALERT_STYLES[a.niveau] ?? ALERT_STYLES.info;
                    return (
                      <li key={a.id} className={`${card} flex items-start gap-4 p-5`}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${className}`}>
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold text-ink">{a.titre}</p>
                              <Pill tone={a.niveau === "critique" ? "danger" : a.niveau === "attention" ? "warning" : "neutral"}>
                                {label}
                              </Pill>
                            </div>
                            <ActionGroup
                              editLabel="Modifier l'alerte"
                              deleteLabel="Supprimer l'alerte"
                              onEdit={() => setEditingAlerte(a)}
                              onDelete={() => setDeletingAlerte(a)}
                            />
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{a.detail}</p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-xs text-stone-500">
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="flex items-center gap-1.5">
                                <UsersRound className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                                {a.audience || "Tous les résidents"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                                {a.date}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => void handleRenvoyerAlerte(a)}
                              className={button("secondary", "sm")}
                            >
                              <Send className="h-3.5 w-3.5" aria-hidden />
                              Renvoyer l&apos;alerte
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {/* Annonce Modals */}
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

      {/* Alerte Modals */}
      {addingAlerte && (
        <NouvelleAlerteModal
          onClose={() => setAddingAlerte(false)}
          onCreated={() => {
            setAddingAlerte(false);
            setVersion((v) => v + 1);
            notify("Alerte diffusée en priorité avec succès.");
          }}
        />
      )}

      {editingAlerte && (
        <EditAlerteModal
          alerte={editingAlerte}
          onClose={() => setEditingAlerte(null)}
          onUpdated={() => {
            setEditingAlerte(null);
            setVersion((v) => v + 1);
            notify("Alerte mise à jour avec succès.");
          }}
        />
      )}

      {deletingAlerte && (
        <ConfirmModal
          isOpen={true}
          title="Supprimer l'alerte"
          message={`Êtes-vous sûr de vouloir supprimer l'alerte d'urgence « ${deletingAlerte.titre} » ?`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setDeletingAlerte(null)}
          onConfirm={async () => {
            try {
              await deleteAlerte(deletingAlerte.id);
              notify(`Alerte « ${deletingAlerte.titre} » supprimée.`);
              setDeletingAlerte(null);
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

function NouvelleAlerteModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [niveau, setNiveau] = useState<"critique" | "attention" | "info">("critique");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await createAlerte({
        titre: formText(form, "titre"),
        detail: formText(form, "detail"),
        niveau,
        audience: formText(form, "audience") || "Tous les résidents",
      });
      onCreated();
    });
  }

  return (
    <Modal
      title="Créer une Alerte d'Urgence"
      description="Diffuser immédiatement une alerte prioritaire avec notification push et bandeau en direct"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Urgency Level Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Niveau d&apos;urgence</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "critique" as const, label: "🚨 Critique", desc: "Urgence immédiate (coupure, panne, danger)" },
              { id: "attention" as const, label: "⚠️ Attention", desc: "Perturbation importante" },
              { id: "info" as const, label: "ℹ️ Information", desc: "Consigne générale" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setNiveau(lvl.id)}
                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                  niveau === lvl.id
                    ? lvl.id === "critique"
                      ? "border-red-500 bg-red-50 text-red-900 ring-2 ring-red-500/20"
                      : lvl.id === "attention"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <span className="text-xs font-bold">{lvl.label}</span>
                <span className="mt-0.5 text-[11px] text-stone-500 line-clamp-2 leading-tight">{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Titre de l'alerte"
          name="titre"
          required
          placeholder="Ex: Coupure d'eau générale, Fuite de gaz, Panne ascenseur"
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Détails et consignes pour les résidents</label>
          <textarea
            name="detail"
            required
            rows={4}
            className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm text-ink placeholder:text-stone-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="Expliquez la situation, la conduite à tenir et la durée estimée de résolution..."
          />
        </div>

        <Field
          label="Audience ciblée"
          name="audience"
          defaultValue="Tous les résidents"
          placeholder="Ex: Tous les résidents, Bâtiment B, Étages 1 à 4"
        />

        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
          <p className="font-semibold">⚡ Diffusion instantanée</p>
          <p className="mt-0.5 text-amber-700">
            Cette alerte sera envoyée en notification push prioritaire sur les téléphones mobiles de tous les résidents et apparaîtra en haut du tableau de bord.
          </p>
        </div>

        <FormError error={error} />
        <ModalActions
          submitting={submitting}
          label="Diffuser l'alerte immédiatement"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}

function EditAlerteModal({
  alerte,
  onClose,
  onUpdated,
}: {
  alerte: Alerte;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [titre, setTitre] = useState(alerte.titre);
  const [detail, setDetail] = useState(alerte.detail);
  const [niveau, setNiveau] = useState<"critique" | "attention" | "info">(alerte.niveau);
  const [audience, setAudience] = useState(alerte.audience || "Tous les résidents");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateAlerte(alerte.id, { titre, detail, niveau, audience });
      onUpdated();
    });
  }

  return (
    <Modal
      title="Modifier l'Alerte"
      description="Mettre à jour les informations et consignes de l'alerte"
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Niveau d&apos;urgence</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "critique" as const, label: "🚨 Critique" },
              { id: "attention" as const, label: "⚠️ Attention" },
              { id: "info" as const, label: "ℹ️ Information" },
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setNiveau(lvl.id)}
                className={`rounded-xl border p-2 text-center text-xs font-bold transition ${
                  niveau === lvl.id
                    ? lvl.id === "critique"
                      ? "border-red-500 bg-red-50 text-red-900"
                      : lvl.id === "attention"
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Titre de l'alerte"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink">Détails et consignes</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
            rows={4}
            className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm text-ink placeholder:text-stone-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <Field
          label="Audience ciblée"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <FormError error={error} />
        <ModalActions
          submitting={submitting}
          label="Enregistrer les modifications"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
}
