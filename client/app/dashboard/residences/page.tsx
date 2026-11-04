"use client";

import {
  Building2,
  ChevronRight,
  CreditCard,
  DoorOpen,
  Layers,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  UserCheck,
  UserPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { formatDZD } from "@/lib/format";
import {
  createFormule,
  createSouscription,
  listFormules,
  listSousAdminsAbonnes,
  setStatutPaiement,
  type Formule,
  type SousAdminAbonne,
  type Souscription,
} from "@/lib/platform-api";
import {
  createAccount,
  createBatiment,
  deleteAccount,
  deleteBatiment,
  etageLabel,
  getMonEspace,
  updateAccount,
  updateBatiment,
  updateResidence,
  type BatimentDetail,
  type MonEspace,
  type Responsable,
} from "@/lib/residences-api";
import { ROLE_LABELS } from "@/lib/roles";
import { ModalActions, PasswordField, SelectField, formText, useSubmit } from "../forms";
import { useSession } from "../session";
import {
  ActionGroup,
  Avatar,
  ConfirmModal,
  DataTable,
  Field,
  FormError,
  Modal,
  Mono,
  PageHeader,
  Pill,
  ProgressBar,
  StatLine,
  Tabs,
  button,
  card,
  describeError,
  useToast,
  type Column,
  type TabItem,
} from "../ui";

type TabId = "batiments" | "gestionnaires" | "abonnements_sous_admins" | "appartements" | "residence";

type AppartementRow = {
  id: string;
  nom: string;
  batimentNom: string;
  batimentId: string;
  etage: number;
  proprietaire: { id: string; prenom: string; nom: string; email: string; telephone: string } | null;
};

type GestionnaireRow = Responsable & { batimentNom: string; batimentId: string };

const fullName = (p: { prenom: string; nom: string }) => `${p.prenom} ${p.nom}`;
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" });

export default function ResidencesPage() {
  const notify = useToast();
  const { account } = useSession();
  const isAdmin = (account.type === "Admin" && account.role === "admin") || account.roles?.includes("admin");
  const [espace, setEspace] = useState<MonEspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("batiments");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [addingBatiment, setAddingBatiment] = useState(false);
  const [editingBatiment, setEditingBatiment] = useState<{ id: string; nom: string; etages: number; maxAppartements?: number } | null>(null);
  const [editingGestionnaire, setEditingGestionnaire] = useState<GestionnaireRow | null>(null);
  const [editingResidence, setEditingResidence] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ type: "batiment" | "gestionnaire"; id: string; name: string } | null>(null);

  // Sous-admin creation modal (null = closed, object = open with optional pre-selected building)
  const [creatingSubAdminBatiment, setCreatingSubAdminBatiment] = useState<{ id: string; nom: string } | null>(null);

  // Sous-admin subscriptions
  const [sousAdminsAbonnes, setSousAdminsAbonnes] = useState<SousAdminAbonne[] | null>(null);
  const [formules, setFormules] = useState<Formule[] | null>(null);
  const [assigningPlanTarget, setAssigningPlanTarget] = useState<SousAdminAbonne | null>(null);
  const [busySubId, setBusySubId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMonEspace()
      .then((data) => {
        if (!active) return;
        setEspace(data);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    Promise.all([listSousAdminsAbonnes(), listFormules("sub_admin")])
      .then(([subList, formList]) => {
        if (!active) return;
        setSousAdminsAbonnes(subList);
        setFormules(formList);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [version, isAdmin, tab]);

  const batiments = espace?.batiments ?? [];
  const residence = espace?.residence;
  const maxBatiments = residence?.maxBatiments ?? 5;
  const quotaAtteint = batiments.length >= maxBatiments;

  const allAppartements: AppartementRow[] = batiments.flatMap((b) =>
    b.appartements.map((a) => ({
      id: a.id,
      nom: a.nom,
      batimentNom: b.nom,
      batimentId: b.id,
      etage: a.etage,
      proprietaire: a.proprietaire,
    })),
  );

  const allGestionnaires: GestionnaireRow[] = batiments.flatMap((b) =>
    b.sousAdmin ? [{ ...b.sousAdmin, batimentNom: b.nom, batimentId: b.id }] : [],
  );

  const tabs: TabItem<TabId>[] = [
    { id: "batiments", label: "Bâtiments & Blocs", icon: Building2, count: batiments.length },
    { id: "gestionnaires", label: "Sous-Admins (Gestionnaires)", icon: UsersRound, count: allGestionnaires.length },
    ...(isAdmin
      ? [
          {
            id: "abonnements_sous_admins" as TabId,
            label: "Abonnements Sous-Admins",
            icon: CreditCard,
            count: sousAdminsAbonnes?.filter((s) => !s.aJour).length || undefined,
          },
        ]
      : []),
    { id: "appartements", label: "Appartements", icon: DoorOpen, count: allAppartements.length },
    { id: "residence", label: "Ma Résidence", icon: Layers },
  ];

  function showApartments(batimentNom: string) {
    setBuildingFilter(batimentNom);
    setTab("appartements");
  }

  async function handleTogglePaiement(s: Souscription) {
    setBusySubId(s.id);
    try {
      await setStatutPaiement(s.id, !s.statutPaiement);
      notify(s.statutPaiement ? "Abonnement marqué comme non payé." : "Paiement validé avec succès.");
      setVersion((v) => v + 1);
    } catch (err) {
      notify(describeError(err).message);
    } finally {
      setBusySubId(null);
    }
  }

  const gestionnaireColumns: Column<GestionnaireRow>[] = [
    {
      header: "Gestionnaire",
      cell: (g) => (
        <span className="flex items-center gap-3">
          <Avatar name={fullName(g)} />
          <span>
            <span className="block font-semibold text-ink">{fullName(g)}</span>
            <span className="block text-xs text-stone-500">{g.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Bâtiment", cell: (g) => <span className="font-semibold text-ink">{g.batimentNom}</span> },
    { header: "Téléphone", cell: (g) => <Mono>{g.telephone}</Mono> },
    { header: "Rôle", cell: () => <Pill>{ROLE_LABELS.sub_admin}</Pill> },
    {
      header: "Statut",
      cell: (g) => (g.actif ? <Pill tone="success">Actif</Pill> : <Pill tone="danger">Inactif</Pill>),
    },
    {
      header: "Actions",
      align: "right",
      cell: (g) => (
        <div className="flex items-center justify-end gap-1.5">
          <a href={`tel:${g.telephone}`} title={`Appeler ${fullName(g)}`} className={button("secondary", "sm")}>
            <Phone className="h-3.5 w-3.5" aria-hidden />
            Appeler
          </a>
          <a href={`mailto:${g.email}`} title={`Envoyer un email à ${fullName(g)}`} className={button("secondary", "sm")}>
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Email
          </a>
          {isAdmin && (
            <ActionGroup
              onEdit={() => setEditingGestionnaire(g)}
              onDelete={() => setDeletingItem({ type: "gestionnaire", id: g.id, name: fullName(g) })}
            />
          )}
        </div>
      ),
    },
  ];

  const sousAdminAbonneColumns: Column<SousAdminAbonne>[] = [
    {
      header: "Sous-Admin",
      cell: (s) => (
        <span className="flex items-center gap-3">
          <Avatar name={fullName(s)} />
          <span>
            <span className="block font-semibold text-ink">{fullName(s)}</span>
            <span className="block text-xs text-stone-500">{s.email}</span>
          </span>
        </span>
      ),
    },
    { header: "Bâtiment", cell: (s) => <span className="font-semibold text-ink">{s.batiment?.nom ?? "Non assigné"}</span> },
    { header: "Téléphone", cell: (s) => <Mono>{s.telephone}</Mono> },
    {
      header: "Abonnement",
      cell: (s) => {
        const sub = s.souscriptions[0];
        if (!sub?.abonnement) return <span className="text-xs text-stone-400">Aucune formule</span>;
        return (
          <div className="text-xs">
            <span className="font-semibold text-ink">{sub.abonnement.nom}</span>
            <span className="block text-stone-500">
              {formatDZD(sub.abonnement.prix)} · {formatDate(sub.debut)} - {formatDate(sub.fin)}
            </span>
          </div>
        );
      },
    },
    {
      header: "Paiement",
      cell: (s) => {
        const sub = s.souscriptions[0];
        if (!sub) return <Pill tone="neutral">Sans formule</Pill>;
        return sub.statutPaiement ? <Pill tone="success">À jour (Payé)</Pill> : <Pill tone="danger">Non payé</Pill>;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (s) => {
        const sub = s.souscriptions[0];
        const isBusy = sub && busySubId === sub.id;
        return (
          <div className="flex items-center justify-end gap-2">
            {sub && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => handleTogglePaiement(sub)}
                className={button(sub.statutPaiement ? "secondary" : "primary", "sm")}
              >
                {sub.statutPaiement ? "Marquer impayé" : "Valider le paiement"}
              </button>
            )}
            <button type="button" onClick={() => setAssigningPlanTarget(s)} className={button("secondary", "sm")}>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {sub ? "Renouveler" : "Attribuer formule"}
            </button>
          </div>
        );
      },
    },
  ];

  const appartementColumns: Column<AppartementRow>[] = [
    { header: "Logement", cell: (a) => <span className="font-semibold text-ink">{a.nom}</span> },
    { header: "Bâtiment", cell: (a) => a.batimentNom },
    { header: "Étage", cell: (a) => etageLabel(a.etage) },
    {
      header: "Occupant / Propriétaire",
      cell: (a) =>
        a.proprietaire ? (
          <div>
            <span className="block font-medium text-ink">{fullName(a.proprietaire)}</span>
            <span className="block text-xs text-stone-500">{a.proprietaire.telephone}</span>
          </div>
        ) : (
          <span className="text-xs text-stone-400">Logement vacant</span>
        ),
    },
  ];

  const filteredAppartements =
    buildingFilter === "all" ? allAppartements : allAppartements.filter((a) => a.batimentNom === buildingFilter);

  const totalAppartements = allAppartements.length;
  const totalOccupes = allAppartements.filter((a) => a.proprietaire).length;
  const tauxOccupation = totalAppartements > 0 ? Math.round((totalOccupes / totalAppartements) * 100) : 0;

  // Sous-admin KPIs
  const totalSubAdmins = sousAdminsAbonnes?.length ?? 0;
  const subAdminsPayes = sousAdminsAbonnes?.filter((s) => s.aJour).length ?? 0;
  const subAdminsImpayes = totalSubAdmins - subAdminsPayes;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Patrimoine, Bâtiments & Gestionnaires"
        subtitle={
          residence
            ? `${residence.nom} (${residence.localisation}) — Résidence → Bâtiments (${batiments.length}/${maxBatiments}) → Gestionnaires → Appartements`
            : "Structure organisationnelle : Résidence → Bâtiments → Gestionnaires → Appartements"
        }
        actions={
          isAdmin && residence ? (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                className={button("primary")}
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                Nouveau Sous-Admin
              </button>
              {quotaAtteint ? (
                <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Quota atteint ({maxBatiments} max)
                </span>
              ) : (
                <button type="button" onClick={() => setAddingBatiment(true)} className={button("secondary")}>
                  <Plus className="h-4 w-4" aria-hidden />
                  Nouveau Bâtiment (Bloc)
                </button>
              )}
            </div>
          ) : null
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {!espace && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : !residence ? (
        <section className={`${card} p-12 text-center text-sm text-stone-500`}>
          Aucune résidence ne vous est encore attribuée. Contactez le Super Admin.
        </section>
      ) : (
        <>
          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "batiments" &&
            (batiments.length === 0 ? (
              <section className={`${card} p-12 text-center text-sm text-stone-500`}>
                Aucun bâtiment n&apos;a encore été créé dans cette résidence.
                {isAdmin && (
                  <div className="mt-4">
                    <button type="button" onClick={() => setAddingBatiment(true)} className={button("primary")}>
                      <Plus className="h-4 w-4" aria-hidden />
                      Ajouter le premier bâtiment
                    </button>
                  </div>
                )}
              </section>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {batiments.map((b) => {
                  const nbAppart = b.appartements.length;
                  const nbOccupes = b.appartements.filter((a) => a.proprietaire).length;
                  const taux = nbAppart > 0 ? Math.round((nbOccupes / nbAppart) * 100) : 0;
                  return (
                    <article key={b.id} className={`${card} flex flex-col p-5`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink">Bâtiment {b.nom}</h3>
                          <p className="text-xs text-stone-500">
                            {b.etages} Étages ({etageLabel(b.etages)})
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Pill tone={taux > 50 ? "success" : "neutral"}>{taux}% occupé</Pill>
                          {isAdmin && (
                            <ActionGroup
                              onEdit={() => setEditingBatiment({ id: b.id, nom: b.nom, etages: b.etages, maxAppartements: b.maxAppartements })}
                              onDelete={() => setDeletingItem({ type: "batiment", id: b.id, name: `le bâtiment « ${b.nom} »` })}
                            />
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
                        {nbAppart} / {b.maxAppartements ?? 50} Appartements
                      </p>

                      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Gestionnaire du bâtiment</p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className={`truncate text-sm font-semibold ${b.sousAdmin ? "text-ink" : "text-stone-400"}`}>
                            {b.sousAdmin ? fullName(b.sousAdmin) : "Non affecté"}
                          </span>
                          {b.sousAdmin && <Mono>{b.sousAdmin.telephone}</Mono>}
                        </div>
                        {isAdmin && !b.sousAdmin && (
                          <button
                            type="button"
                            onClick={() => setCreatingSubAdminBatiment({ id: b.id, nom: b.nom })}
                            className={`${button("secondary", "sm")} mt-2.5 w-full`}
                          >
                            <UserPlus className="h-3.5 w-3.5" aria-hidden />
                            Attribuer un sous-admin
                          </button>
                        )}
                      </div>

                      <div className="mt-3">
                        <StatLine label="Occupés / Total :" value={`${nbOccupes} / ${nbAppart}`} />
                        <StatLine label="Logements vacants :" value={`${nbAppart - nbOccupes}`} />
                      </div>

                      <div className="mt-4 flex items-center justify-end border-t border-stone-100 pt-4 text-xs">
                        <button
                          type="button"
                          onClick={() => showApartments(b.nom)}
                          className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand"
                        >
                          Voir Logements
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}

          {tab === "gestionnaires" && (
            <div className="space-y-4">
              {isAdmin && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-ink">Gestionnaires de Bâtiments (Sous-Admins)</h3>
                    <p className="text-xs text-stone-500">
                      Vous pouvez créer et attribuer un sous-admin pour chaque bâtiment de votre résidence.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                    className={button("primary", "sm")}
                  >
                    <UserPlus className="h-3.5 w-3.5" aria-hidden />
                    Nouveau Sous-Admin
                  </button>
                </div>
              )}
              <DataTable
                columns={gestionnaireColumns}
                rows={allGestionnaires}
                rowKey={(g) => `${g.batimentId}-${g.id}`}
                empty={
                  isAdmin ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-stone-500">Aucun gestionnaire de bâtiment affecté pour le moment.</p>
                      <button
                        type="button"
                        onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                        className={`${button("primary", "sm")} mt-4`}
                      >
                        <UserPlus className="h-3.5 w-3.5" aria-hidden />
                        Créer le premier Sous-Admin
                      </button>
                    </div>
                  ) : (
                    "Aucun gestionnaire de bâtiment affecté pour le moment."
                  )
                }
              />
            </div>
          )}

          {tab === "abonnements_sous_admins" && isAdmin && (
            <div className="space-y-6">
              {/* Top Banner with Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-stone-500">
                  Suivez les abonnements des sous-admins et validez leurs cotisations de bâtiment.
                </p>
                <button
                  type="button"
                  onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                  className={button("secondary", "sm")}
                >
                  <UserPlus className="h-3.5 w-3.5" aria-hidden />
                  Nouveau Sous-Admin
                </button>
              </div>

              {/* KPI Header Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Sous-Admins</span>
                    <UsersRound className="h-5 w-5 text-stone-400" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-ink">{totalSubAdmins}</p>
                  <p className="mt-1 text-xs text-stone-400">Responsables de blocs dans votre résidence</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Abonnements à jour</span>
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-emerald-950">{subAdminsPayes}</p>
                  <p className="mt-1 text-xs text-emerald-700">Cotisations validées et actives</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">En attente / Impayés</span>
                    <XCircle className="h-5 w-5 text-amber-600" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold text-amber-950">{subAdminsImpayes}</p>
                  <p className="mt-1 text-xs text-amber-700">À régulariser par l&apos;administrateur</p>
                </div>
              </div>

              {/* Table */}
              <DataTable
                columns={sousAdminAbonneColumns}
                rows={sousAdminsAbonnes ?? []}
                rowKey={(s) => s.id}
                empty="Aucun sous-admin assigné dans cette résidence."
              />
            </div>
          )}

          {tab === "appartements" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par bâtiment">
                {["all", ...batiments.map((b) => b.nom)].map((value) => {
                  const selected = buildingFilter === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setBuildingFilter(value)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        selected ? "bg-brand text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      {value === "all" ? "Tous les bâtiments" : `Bâtiment ${value}`}
                    </button>
                  );
                })}
              </div>
              <DataTable columns={appartementColumns} rows={filteredAppartements} rowKey={(a) => a.id} empty="Aucun appartement trouvé." />
            </div>
          )}

          {tab === "residence" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <article className={`${card} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-ink">{residence.nom}</h3>
                    <p className="mt-1 text-sm text-stone-500">{residence.localisation}</p>
                  </div>
                  {isAdmin && (
                    <button type="button" onClick={() => setEditingResidence(true)} className={button("secondary", "sm")}>
                      Modifier
                    </button>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Bâtiments (Quota)</p>
                    <p className="mt-0.5 text-xl font-bold text-ink">
                      {batiments.length} / {maxBatiments}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Appartements</p>
                    <p className="mt-0.5 text-xl font-bold text-ink">{totalAppartements}</p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-stone-500">Taux d&apos;occupation</span>
                    <span className="font-semibold text-ink">{tauxOccupation}%</span>
                  </div>
                  <ProgressBar value={tauxOccupation} label={`Taux d'occupation ${residence.nom}`} />
                </div>

                <div className="mt-5 space-y-2 border-t border-stone-100 pt-4 text-sm">
                  <StatLine label="Administrateur Responsable" value={espace.admin ? fullName(espace.admin) : "Non affecté"} />
                  {espace.admin && <StatLine label="Contact Admin" value={<Mono>{espace.admin.telephone}</Mono>} />}
                  <StatLine
                    label="Abonnement Résidence"
                    value={
                      espace.abonnement ? (
                        <Pill tone="success">{espace.abonnement.nom ?? "Actif"}</Pill>
                      ) : (
                        <Pill tone="neutral">Standard</Pill>
                      )
                    }
                  />
                </div>
              </article>

              <article className={`${card} p-6 space-y-4`}>
                <h4 className="text-sm font-bold uppercase tracking-wide text-stone-500">Répartition par Bâtiment</h4>
                <div className="space-y-3">
                  {batiments.map((b) => (
                    <div key={b.id} className="rounded-xl border border-stone-100 bg-stone-50/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-ink">Bâtiment {b.nom}</span>
                        <span className="text-xs text-stone-500">{b.etages} étages</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                        <span>
                          {b.appartements.length} / {b.maxAppartements ?? 50} appartements
                        </span>
                        <span>{b.sousAdmin ? `Sous-admin : ${fullName(b.sousAdmin)}` : "Pas de sous-admin"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}
        </>
      )}

      {addingBatiment && residence && (
        <BatimentModal
          residenceId={residence.id}
          residenceNom={residence.nom}
          onClose={() => setAddingBatiment(false)}
          onCreated={(nom) => {
            setAddingBatiment(false);
            setVersion((v) => v + 1);
            notify(`Bâtiment « ${nom} » ajouté avec succès.`);
          }}
        />
      )}

      {editingBatiment && residence && (
        <EditBatimentModal
          batiment={editingBatiment}
          residenceId={residence.id}
          onClose={() => setEditingBatiment(null)}
          onUpdated={() => {
            setEditingBatiment(null);
            setVersion((v) => v + 1);
            notify("Bâtiment modifié avec succès.");
          }}
        />
      )}

      {editingGestionnaire && (
        <EditGestionnaireModal
          gestionnaire={editingGestionnaire}
          onClose={() => setEditingGestionnaire(null)}
          onUpdated={() => {
            setEditingGestionnaire(null);
            setVersion((v) => v + 1);
            notify("Gestionnaire modifié avec succès.");
          }}
        />
      )}

      {creatingSubAdminBatiment && (
        <SubAdminModal
          preselectedBatiment={creatingSubAdminBatiment.id ? creatingSubAdminBatiment : null}
          batiments={batiments}
          onClose={() => setCreatingSubAdminBatiment(null)}
          onCreated={(email) => {
            setCreatingSubAdminBatiment(null);
            setVersion((v) => v + 1);
            notify(`Compte Sous-Admin créé avec succès pour ${email}.`);
          }}
        />
      )}

      {assigningPlanTarget && formules && (
        <AttribuerPlanModal
          target={assigningPlanTarget}
          formules={formules}
          onClose={() => setAssigningPlanTarget(null)}
          onAssigned={() => {
            setAssigningPlanTarget(null);
            setVersion((v) => v + 1);
            notify("Abonnement attribué avec succès.");
          }}
        />
      )}

      {editingResidence && residence && (
        <EditResidenceModal
          residence={residence}
          onClose={() => setEditingResidence(false)}
          onUpdated={() => {
            setEditingResidence(false);
            setVersion((v) => v + 1);
            notify("Résidence mise à jour.");
          }}
        />
      )}

      <ConfirmModal
        open={Boolean(deletingItem)}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer ${deletingItem?.name} ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (!deletingItem || !residence) return;
          if (deletingItem.type === "batiment") {
            await deleteBatiment(residence.id, deletingItem.id);
          } else {
            await deleteAccount(deletingItem.id);
          }
          setDeletingItem(null);
          setVersion((v) => v + 1);
          notify("Élément supprimé avec succès.");
        }}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}

function BatimentModal({
  residenceId,
  residenceNom,
  onClose,
  onCreated,
}: {
  residenceId: string;
  residenceNom: string;
  onClose: () => void;
  onCreated: (nom: string) => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = formText(form, "nom");
    const etages = Number(form.get("etages") ?? 0);
    const maxAppartements = Number(form.get("maxAppartements") || 50);

    void run(async () => {
      await createBatiment(residenceId, { nom, etages, maxAppartements });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouveau Bâtiment (Bloc)" description={`Ajout d'un bloc dans « ${residenceNom} ».`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom ou lettre du bâtiment" name="nom" required placeholder="ex: Bloc B ou Tour 03" autoFocus />
        <Field label="Nombre d'étages" name="etages" type="number" required min={0} max={200} placeholder="ex: 9" />
        <Field label="Capacité max d'appartements" name="maxAppartements" type="number" defaultValue="50" min={1} max={2000} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer le bâtiment" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditBatimentModal({
  batiment,
  residenceId,
  onClose,
  onUpdated,
}: {
  batiment: { id: string; nom: string; etages: number; maxAppartements?: number };
  residenceId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateBatiment(residenceId, batiment.id, {
        nom: formText(form, "nom"),
        etages: Number(form.get("etages")),
        maxAppartements: Number(form.get("maxAppartements")),
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le Bâtiment" description={`Modification de « ${batiment.nom} »`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom ou lettre du bâtiment" name="nom" defaultValue={batiment.nom} required autoFocus />
        <Field label="Nombre d'étages" name="etages" type="number" defaultValue={batiment.etages} required min={0} max={200} />
        <Field label="Capacité max d'appartements" name="maxAppartements" type="number" defaultValue={batiment.maxAppartements ?? 50} required min={1} max={2000} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function SubAdminModal({
  preselectedBatiment,
  batiments,
  onClose,
  onCreated,
}: {
  preselectedBatiment?: { id: string; nom: string } | null;
  batiments: BatimentDetail[];
  onClose: () => void;
  onCreated: (email: string) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const defaultBatimentId = preselectedBatiment?.id || batiments.find((b) => !b.sousAdmin)?.id || batiments[0]?.id || "";
  const [selectedBatimentId, setSelectedBatimentId] = useState(defaultBatimentId);
  const [password, setPassword] = useState("");

  const selectedBuilding = batiments.find((b) => b.id === selectedBatimentId);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!selectedBatimentId) {
      alert("Veuillez sélectionner un bâtiment.");
      return;
    }

    void run(async () => {
      await createAccount({
        role: "sub_admin",
        idBatiment: selectedBatimentId,
        prenom: formText(form, "prenom"),
        nom: formText(form, "nom"),
        email: formText(form, "email"),
        telephone: formText(form, "telephone"),
        wilaya: formText(form, "wilaya"),
        daira: formText(form, "daira"),
        baladia: formText(form, "baladia"),
        password: password || "City@2026!",
      });
      onCreated(formText(form, "email"));
    });
  }

  return (
    <Modal
      title="Nouveau Sous-Admin"
      description={selectedBuilding ? `Assigné au bâtiment « ${selectedBuilding.nom} »` : "Nommez un gestionnaire de bâtiment."}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {batiments.length === 0 ? (
          <p className="text-sm text-stone-500">Aucun bâtiment disponible. Créez d&apos;abord un bâtiment dans la résidence.</p>
        ) : (
          <SelectField
            label="Bâtiment assigné"
            value={selectedBatimentId}
            onChange={(e) => setSelectedBatimentId(e.target.value)}
            required
          >
            {batiments.map((b) => (
              <option key={b.id} value={b.id}>
                Bâtiment {b.nom} {b.sousAdmin ? `(Sous-admin actuel : ${fullName(b.sousAdmin)})` : "(Disponible)"}
              </option>
            ))}
          </SelectField>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="prenom" required maxLength={60} autoFocus />
          <Field label="Nom" name="nom" required maxLength={60} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" required maxLength={254} />
          <Field label="Téléphone" name="telephone" type="tel" required pattern="\+?[0-9]{8,15}" placeholder="0555123456" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Wilaya" name="wilaya" required maxLength={80} />
          <Field label="Daïra" name="daira" required maxLength={80} />
          <Field label="Baladia" name="baladia" required maxLength={80} />
        </div>
        <PasswordField value={password} onChange={setPassword} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer le sous-admin" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function AttribuerPlanModal({
  target,
  formules,
  onClose,
  onAssigned,
}: {
  target: SousAdminAbonne;
  formules: Formule[];
  onClose: () => void;
  onAssigned: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [formuleId, setFormuleId] = useState(formules[0]?.id ?? "");
  const [debut, setDebut] = useState(new Date().toISOString().split("T")[0]);
  const [paye, setPaye] = useState(true);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await createSouscription({
        idAdmin: target.id,
        idAbonnement: formuleId,
        debut,
        statutPaiement: paye,
      });
      onAssigned();
    });
  }

  return (
    <Modal
      title="Attribuer un Abonnement"
      description={`Souscription pour ${fullName(target)} (${target.batiment?.nom ? `Bâtiment ${target.batiment.nom}` : "Bâtiment"}).`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {formules.length === 0 ? (
          <p className="text-sm text-stone-500">Aucune formule disponible pour le moment. Contactez le Super Admin.</p>
        ) : (
          <SelectField label="Formule" value={formuleId} onChange={(e) => setFormuleId(e.target.value)}>
            {formules.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom} — {formatDZD(f.prix)} ({f.duree} mois)
              </option>
            ))}
          </SelectField>
        )}
        <Field label="Date de début" type="date" value={debut} onChange={(e) => setDebut(e.target.value)} required />
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer pt-1">
          <input type="checkbox" checked={paye} onChange={(e) => setPaye(e.target.checked)} className="rounded text-brand" />
          <span>Marquer comme payé immédiatement</span>
        </label>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Valider l'abonnement" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditGestionnaireModal({
  gestionnaire,
  onClose,
  onUpdated,
}: {
  gestionnaire: GestionnaireRow;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateAccount(gestionnaire.id, {
        prenom: formText(form, "prenom"),
        nom: formText(form, "nom"),
        email: formText(form, "email"),
        telephone: formText(form, "telephone"),
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier le Gestionnaire" description={`Modification du compte de ${fullName(gestionnaire)}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="prenom" defaultValue={gestionnaire.prenom} required autoFocus />
          <Field label="Nom" name="nom" defaultValue={gestionnaire.nom} required />
        </div>
        <Field label="Email" name="email" type="email" defaultValue={gestionnaire.email} required />
        <Field label="Téléphone" name="telephone" type="tel" defaultValue={gestionnaire.telephone} required />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditResidenceModal({
  residence,
  onClose,
  onUpdated,
}: {
  residence: { id: string; nom: string; localisation: string };
  onClose: () => void;
  onUpdated: () => void;
}) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await updateResidence(residence.id, {
        nom: formText(form, "nom"),
        localisation: formText(form, "localisation"),
      });
      onUpdated();
    });
  }

  return (
    <Modal title="Modifier la Résidence" description={`Modification de « ${residence.nom} »`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la résidence" name="nom" defaultValue={residence.nom} required autoFocus />
        <Field label="Localisation" name="localisation" defaultValue={residence.localisation} required />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
