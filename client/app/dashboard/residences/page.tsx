"use client";

import { useI18n } from "@/lib/i18n";
import {
  Building2,
  ChevronRight,
  CreditCard,
  DoorOpen,
  Layers,
  Mail,
  Phone,
  Plus,
  Search,
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
  Breadcrumbs,
  ConfirmModal,
  DataTable,
  EmptyState,
  FacetFilter,
  Field,
  FormError,
  Modal,
  Mono,
  PageHeader,
  PasswordGeneratorInput,
  Pill,
  ProgressBar,
  QuotaProgress,
  StatLine,
  Tabs,
  button,
  card,
  describeError,
  inputClass,
  useToast,
  type Column,
  type TabItem,
} from "../ui";
import { SkeletonResidencesPage } from "../skeletons";

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
  const { t, tText, locale, isRTL, formatCurrency } = useI18n();
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
  const [subAdminFilter, setSubAdminFilter] = useState<"all" | "paye" | "impaye">("all");
  const [queryGestionnaires, setQueryGestionnaires] = useState("");
  const [queryBatiments, setQueryBatiments] = useState("");
  const [occupancyFilter, setOccupancyFilter] = useState<"all" | "occupes" | "vacants">("all");

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

  if (!espace && !error) {
    return <SkeletonResidencesPage />;
  }

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

  const batimentColumns: Column<BatimentDetail>[] = [
    {
      header: "Bâtiment / Bloc",
      cell: (b) => (
        <span className="flex items-center gap-2.5 font-bold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand font-black text-xs">
            {b.nom.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <span className="block text-sm font-bold text-ink">{tText("Bâtiment")} {b.nom}</span>
            <span className="block text-xs font-normal text-stone-500">{b.etages} {tText("étages")} ({etageLabel(b.etages)})</span>
          </div>
        </span>
      ),
    },
    {
      header: "Capacité Logements",
      cell: (b) => {
        const nbAppart = b.appartements.length;
        const max = b.maxAppartements ?? 50;
        return (
          <div>
            <span className="font-semibold text-ink">{nbAppart}</span>
            <span className="text-xs text-stone-400"> / {max} {tText("max")}</span>
          </div>
        );
      },
    },
    {
      header: "Taux d'occupation",
      cell: (b) => {
        const nbAppart = b.appartements.length;
        const nbOccupes = b.appartements.filter((a) => a.proprietaire).length;
        const taux = nbAppart > 0 ? Math.round((nbOccupes / nbAppart) * 100) : 0;
        return (
          <div className="min-w-[130px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-stone-600">{nbOccupes} {tText("occupés")}</span>
              <span className="font-bold text-ink">{taux}%</span>
            </div>
            <ProgressBar value={taux} label={`Occupation Bâtiment ${b.nom}`} />
          </div>
        );
      },
    },
    {
      header: "Sous-Admin Responsable",
      cell: (b) =>
        b.sousAdmin ? (
          <div className="flex items-center gap-2">
            <Avatar name={fullName(b.sousAdmin)} size="md" />
            <div>
              <span className="block font-semibold text-ink text-xs">{fullName(b.sousAdmin)}</span>
              <span className="block text-[11px] text-stone-500">{b.sousAdmin.telephone}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 italic">{tText("Non assigné")}</span>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setCreatingSubAdminBatiment({ id: b.id, nom: b.nom })}
                className={button("secondary", "sm")}
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden />
                {tText("Nommer")}
              </button>
            )}
          </div>
        ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => showApartments(b.nom)}
            className={button("secondary", "sm")}
            title={tText("Consulter les appartements de ce bâtiment")}
          >
            <DoorOpen className="h-3.5 w-3.5" aria-hidden />
            {tText("Appartements")} ({b.appartements.length})
          </button>
          {isAdmin && (
            <ActionGroup
              editLabel="Modifier Bâtiment"
              deleteLabel="Supprimer Bâtiment"
              onEdit={() => setEditingBatiment({ id: b.id, nom: b.nom, etages: b.etages, maxAppartements: b.maxAppartements })}
              onDelete={() => setDeletingItem({ type: "batiment", id: b.id, name: b.nom })}
            />
          )}
        </div>
      ),
    },
  ];

  const repartitionColumns: Column<BatimentDetail>[] = [
    {
      header: "Bâtiment / Bloc",
      cell: (b) => (
        <span className="flex items-center gap-2 font-bold text-ink">
          <Building2 className="h-4 w-4 text-brand" />
          Bâtiment {b.nom}
        </span>
      ),
    },
    {
      header: "Étages",
      cell: (b) => <span className="text-stone-600">{b.etages} étages ({etageLabel(b.etages)})</span>,
    },
    {
      header: "Logements créés",
      cell: (b) => (
        <span className="font-semibold text-ink">
          {b.appartements.length} <span className="text-xs text-stone-400 font-normal">/ {b.maxAppartements ?? 50} max</span>
        </span>
      ),
    },
    {
      header: "Occupation",
      cell: (b) => {
        const nbAppart = b.appartements.length;
        const nbOccupes = b.appartements.filter((a) => a.proprietaire).length;
        const taux = nbAppart > 0 ? Math.round((nbOccupes / nbAppart) * 100) : 0;
        return (
          <div className="flex items-center gap-2">
            <Pill tone={taux > 50 ? "success" : "neutral"}>{taux}%</Pill>
            <span className="text-xs text-stone-500">{nbOccupes} occupés ({nbAppart - nbOccupes} vacants)</span>
          </div>
        );
      },
    },
    {
      header: "Sous-Admin Responsable",
      cell: (b) =>
        b.sousAdmin ? (
          <div>
            <span className="block font-semibold text-ink text-xs">{fullName(b.sousAdmin)}</span>
            <span className="block text-[11px] text-stone-400">{b.sousAdmin.telephone}</span>
          </div>
        ) : (
          <span className="text-xs text-stone-400 italic">Aucun sous-admin</span>
        ),
    },
    {
      header: "Détails",
      align: "right",
      cell: (b) => (
        <button
          type="button"
          onClick={() => showApartments(b.nom)}
          className={button("secondary", "sm")}
        >
          <DoorOpen className="h-3.5 w-3.5" aria-hidden />
          Appartements ({b.appartements.length})
        </button>
      ),
    },
  ];

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
  const filteredSousAdmins = (sousAdminsAbonnes ?? []).filter((s) => {
    if (subAdminFilter === "paye") return s.aJour;
    if (subAdminFilter === "impaye") return !s.aJour;
    return true;
  });

  const needleGest = queryGestionnaires.trim().toLowerCase();
  const filteredGestionnaires = allGestionnaires.filter((g) => {
    if (!needleGest) return true;
    return [fullName(g), g.email, g.telephone, g.batimentNom].some((v) => v.toLowerCase().includes(needleGest));
  });

  const needleBat = queryBatiments.trim().toLowerCase();
  const filteredBatiments = batiments.filter((b) => {
    if (!needleBat) return true;
    return (
      b.nom.toLowerCase().includes(needleBat) ||
      (b.sousAdmin && [fullName(b.sousAdmin), b.sousAdmin.email, b.sousAdmin.telephone].some((v) => v.toLowerCase().includes(needleBat)))
    );
  });

  const finalAppartements = filteredAppartements.filter((a) => {
    if (occupancyFilter === "occupes") return !!a.proprietaire;
    if (occupancyFilter === "vacants") return !a.proprietaire;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title={t.residences.title}
        subtitle={
          residence
            ? `${residence.nom} (${residence.localisation}) — ${tText("Résidence")} → ${tText("Bâtiments")} (${batiments.length}/${maxBatiments}) → ${tText("Gestionnaires")} → ${tText("Appartements")}`
            : tText("Structure organisationnelle : Résidence → Bâtiments → Gestionnaires → Appartements")
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
                {t.residences.nommerSousAdmin}
              </button>
              {quotaAtteint ? (
                <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  Quota atteint ({maxBatiments} max)
                </span>
              ) : (
                <button type="button" onClick={() => setAddingBatiment(true)} className={button("secondary")}>
                  <Plus className="h-4 w-4" aria-hidden />
                  {t.residences.ajouterBatiment}
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
          {tText("Aucune résidence ne vous est encore attribuée. Contactez le Super Admin.")}
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
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <QuotaProgress
                    current={batiments.length}
                    max={maxBatiments}
                    label={`${tText("Capacité des blocs dans")} « ${residence.nom} »`}
                    unit={tText("bâtiments")}
                  />
                  <QuotaProgress
                    current={totalOccupes}
                    max={residence.maxResidents || 100}
                    label={`${tText("Capacité des résidents")} (« ${residence.nom} »)`}
                    unit={tText("résidents")}
                  />
                </div>

                <DataTable
                  columns={batimentColumns}
                  rows={filteredBatiments}
                  rowKey={(b) => b.id}
                  toolbar={
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="relative min-w-[260px]">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={queryBatiments}
                          onChange={(e) => setQueryBatiments(e.target.value)}
                          placeholder={tText("Rechercher un bâtiment ou sous-admin...")}
                          className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                        />
                      </div>
                      <span className="text-xs font-semibold text-stone-500">
                        {filteredBatiments.length} {tText("bâtiments")}
                      </span>
                    </div>
                  }
                  empty={tText("Aucun bâtiment ne correspond à votre recherche.")}
                />
              </div>
            ))}

          {tab === "gestionnaires" && (
            <div className="space-y-4">
              {isAdmin && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-ink">{tText("Gestionnaires de Bâtiments (Sous-Admins)")}</h3>
                    <p className="text-xs text-stone-500">
                      {tText("Vous pouvez créer et attribuer un sous-admin pour chaque bâtiment de votre résidence.")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                    className={button("primary", "sm")}
                  >
                    <UserPlus className="h-3.5 w-3.5" aria-hidden />
                    {tText("Nouveau Sous-Admin")}
                  </button>
                </div>
              )}
              <DataTable
                columns={gestionnaireColumns}
                rows={filteredGestionnaires}
                rowKey={(g) => `${g.batimentId}-${g.id}`}
                toolbar={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold text-stone-600">
                      {filteredGestionnaires.length} {tText(filteredGestionnaires.length > 1 ? "gestionnaires enregistrés" : "gestionnaire enregistré")}
                    </span>
                    <div className="relative min-w-[240px]">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        value={queryGestionnaires}
                        onChange={(e) => setQueryGestionnaires(e.target.value)}
                        placeholder="Rechercher nom, bloc..."
                        className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                  </div>
                }
                empty={
                  isAdmin ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-stone-500">Aucun gestionnaire ne correspond aux critères.</p>
                      <button
                        type="button"
                        onClick={() => setCreatingSubAdminBatiment({ id: "", nom: "" })}
                        className={`${button("primary", "sm")} mt-4`}
                      >
                        <UserPlus className="h-3.5 w-3.5" aria-hidden />
                        Créer un Sous-Admin
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
                rows={filteredSousAdmins}
                rowKey={(s) => s.id}
                toolbar={
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <FacetFilter
                      value={subAdminFilter}
                      onChange={setSubAdminFilter}
                      options={[
                        { id: "all", label: "Tous les sous-admins", count: totalSubAdmins },
                        { id: "paye", label: "À jour (Payés)", count: subAdminsPayes },
                        { id: "impaye", label: "Impayés / En attente", count: subAdminsImpayes },
                      ]}
                    />
                    <span className="text-xs font-semibold text-stone-500">
                      {filteredSousAdmins.length} {filteredSousAdmins.length > 1 ? "gestionnaires affichés" : "gestionnaire affiché"}
                    </span>
                  </div>
                }
                empty="Aucun sous-admin ne correspond aux critères sélectionnés."
              />
            </div>
          )}

          {tab === "appartements" && (
            <div className="space-y-4">
              <DataTable
                columns={appartementColumns}
                rows={finalAppartements}
                rowKey={(a) => a.id}
                toolbar={
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <FacetFilter
                      value={occupancyFilter}
                      onChange={setOccupancyFilter}
                      options={[
                        { id: "all", label: "Tous", count: filteredAppartements.length },
                        { id: "occupes", label: "Occupés", count: filteredAppartements.filter((a) => a.proprietaire).length },
                        { id: "vacants", label: "Vacants", count: filteredAppartements.filter((a) => !a.proprietaire).length },
                      ]}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-stone-500">{tText("Bâtiment :")}</span>
                      <select
                        value={buildingFilter}
                        onChange={(e) => setBuildingFilter(e.target.value)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink"
                      >
                        <option value="all">{tText("Tous les bâtiments")} ({allAppartements.length})</option>
                        {batiments.map((b) => (
                          <option key={b.id} value={b.nom}>
                            {tText("Bâtiment")} {b.nom} ({b.appartements.length})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                }
                empty={tText("Aucun appartement ne correspond aux critères sélectionnés.")}
              />
            </div>
          )}

          {tab === "residence" && (
            <div className="space-y-6">
              {/* Tableau 1 : Fiche des Paramètres & Caractéristiques de la Résidence */}
              <div className={`${card} overflow-hidden`}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 bg-stone-50/75 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-brand">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-ink">{residence.nom}</h3>
                      <p className="text-xs text-stone-500">{residence.localisation}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button type="button" onClick={() => setEditingResidence(true)} className={button("secondary", "sm")}>
                      Modifier la résidence
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-start text-sm">
                    <tbody className="divide-y divide-stone-100">
                      <tr className="hover:bg-stone-50/50">
                        <td className="w-1/3 px-6 py-3.5 font-bold text-stone-600">Nom de la résidence</td>
                        <td className="px-6 py-3.5 font-semibold text-ink">{residence.nom}</td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Emplacement & Adresse</td>
                        <td className="px-6 py-3.5 text-ink">{residence.localisation}</td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Capacité Bâtiments (Quota)</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-2">
                            <span className="font-bold text-ink">{batiments.length} / {maxBatiments} blocs créés</span>
                            {quotaAtteint ? (
                              <Pill tone="warning">Quota atteint</Pill>
                            ) : (
                              <Pill tone="success">{maxBatiments - batiments.length} disponibles</Pill>
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Capacité Logements & Résidents</td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-1.5 max-w-md">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-ink">{totalOccupes} occupés / {totalAppartements} logements créés</span>
                              <span className="font-bold text-brand">{tauxOccupation}%</span>
                            </div>
                            <ProgressBar value={tauxOccupation} label="Occupation" />
                            <span className="text-[11px] text-stone-400">Limite autorisée : {residence.maxResidents || 100} résidents max</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Administrateur Responsable</td>
                        <td className="px-6 py-3.5">
                          {espace.admin ? (
                            <div className="flex items-center gap-3">
                              <Avatar name={fullName(espace.admin)} size="md" />
                              <div>
                                <span className="block font-semibold text-ink">{fullName(espace.admin)}</span>
                                <span className="block text-xs text-stone-500">{espace.admin.email} · <Mono>{espace.admin.telephone}</Mono></span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400 italic">Non affecté</span>
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Formule d&apos;Abonnement Résidence</td>
                        <td className="px-6 py-3.5">
                          {espace.abonnement ? (
                            <div className="inline-flex items-center gap-2">
                              <Pill tone="success">{espace.abonnement.nom ?? "Actif"}</Pill>
                              <span className="text-xs text-stone-500 font-medium">Standard 12 mois</span>
                            </div>
                          ) : (
                            <Pill tone="neutral">Standard</Pill>
                          )}
                        </td>
                      </tr>
                      <tr className="hover:bg-stone-50/50">
                        <td className="px-6 py-3.5 font-bold text-stone-600">Date d&apos;enregistrement</td>
                        <td className="px-6 py-3.5 text-stone-600">{residence.createdAt ? formatDate(residence.createdAt) : "01/01/2026"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tableau 2 : Répartition Détaillée par Bâtiment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-ink">Répartition Détaillée par Bâtiment</h4>
                    <p className="text-xs text-stone-500">Statistiques d&apos;occupation, étages et sous-administrateurs de chaque bloc</p>
                  </div>
                  <span className="text-xs font-semibold text-stone-500">{batiments.length} blocs au total</span>
                </div>

                <DataTable
                  columns={repartitionColumns}
                  rows={batiments}
                  rowKey={(b) => b.id}
                  empty="Aucun bâtiment dans cette résidence."
                />
              </div>
            </div>
          )}
        </>
      )}

      {addingBatiment && residence && (
        <BatimentModal
          residenceId={residence.id}
          residenceNom={residence.nom}
          currentBatiments={batiments.length}
          maxBatiments={maxBatiments}
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
        message={deletingItem?.type === "batiment" ? tText(`Êtes-vous sûr de vouloir supprimer le bâtiment « ${deletingItem.name} » ? Cette action est irréversible.`) : tText(`Êtes-vous sûr de vouloir supprimer « ${deletingItem?.name} » ? Cette action est irréversible.`)}
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
  currentBatiments,
  maxBatiments,
  onClose,
  onCreated,
}: {
  residenceId: string;
  residenceNom: string;
  currentBatiments?: number;
  maxBatiments?: number;
  onClose: () => void;
  onCreated: (nom: string) => void;
}) {
  const { tText } = useI18n();
  const { submitting, error, run } = useSubmit();
  const [etages, setEtages] = useState(5);
  const [appartementsParEtage, setAppartementsParEtage] = useState(4);
  const totalCalcule = etages * appartementsParEtage;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = formText(form, "nom");
    const et = Number(form.get("etages") ?? etages);
    const maxAppartements = Number(form.get("maxAppartements") || totalCalcule || 50);

    void run(async () => {
      await createBatiment(residenceId, { nom, etages: et, maxAppartements });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouveau Bâtiment (Bloc)" description={`${tText("Ajout d'un bloc dans")} « ${residenceNom} ».`} onClose={onClose}>
      {maxBatiments !== undefined && currentBatiments !== undefined && (
        <div className="mb-4">
          <QuotaProgress current={currentBatiments} max={maxBatiments} label="Quota de la résidence" unit="bâtiments" />
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom ou lettre du bâtiment" name="nom" required placeholder="ex: Bloc B ou Tour 03" autoFocus />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nombre d'étages"
            name="etages"
            type="number"
            required
            min={0}
            max={200}
            value={etages}
            onChange={(e) => setEtages(Number(e.target.value))}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">{tText("Logements par étage (aide)")}</label>
            <input
              type="number"
              min={1}
              max={50}
              value={appartementsParEtage}
              onChange={(e) => setAppartementsParEtage(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        <Field
          label="Capacité max d'appartements"
          name="maxAppartements"
          type="number"
          value={totalCalcule}
          min={1}
          max={2000}
          hint={`${tText("Calcul automatique :")} ${etages} ${tText("étages")} × ${appartementsParEtage} ${tText("logements")} = ${totalCalcule} ${tText("appartements")}`}
        />
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
  const { tText } = useI18n();
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
    <Modal title="Modifier le Bâtiment" description={`${tText("Modification de")} « ${batiment.nom} »`} onClose={onClose}>
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
  const { tText } = useI18n();
  const { submitting, error, run } = useSubmit();
  const defaultBatimentId = preselectedBatiment?.id || batiments.find((b) => !b.sousAdmin)?.id || batiments[0]?.id || "";
  const [selectedBatimentId, setSelectedBatimentId] = useState(defaultBatimentId);
  const [password, setPassword] = useState("City@2026!Sec");

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
      title="Nouveau Sous-Admin (Gestionnaire de Bloc)"
      description="Créez le compte d'accès pour le responsable de bâtiment."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {batiments.length === 0 ? (
          <p className="text-sm text-stone-500">{tText("Aucun bâtiment disponible. Créez d'abord un bâtiment dans la résidence.")}</p>
        ) : (
          <div className="space-y-2">
            <SelectField
              label="Bâtiment assigné"
              value={selectedBatimentId}
              onChange={(e) => setSelectedBatimentId(e.target.value)}
              required
            >
              {batiments.map((b) => (
                <option key={b.id} value={b.id}>
                  {tText("Bâtiment")} {b.nom} {b.sousAdmin ? `(${tText("Gestionnaire actuel :")} ${fullName(b.sousAdmin)})` : `— [${tText("DISPONIBLE")}]`}
                </option>
              ))}
            </SelectField>

            {selectedBuilding && (
              <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-xs">
                <div>
                  <span className="font-bold text-ink">{tText("Bâtiment")} {selectedBuilding.nom}</span>
                  <span className="ml-2 text-stone-500">
                    {selectedBuilding.appartements.length} / {selectedBuilding.maxAppartements ?? 50} {tText("logements")}
                  </span>
                </div>
                {selectedBuilding.sousAdmin ? (
                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    {tText("Remplacera")} {fullName(selectedBuilding.sousAdmin)}
                  </span>
                ) : (
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    {tText("Disponible")}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Prénom" name="prenom" required maxLength={60} placeholder="ex: Karim" autoFocus />
          <Field label="Nom" name="nom" required maxLength={60} placeholder="ex: Benali" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email professionnel" name="email" type="email" required maxLength={254} placeholder="karim.benali@gmail.com" />
          <Field label="Téléphone mobile" name="telephone" type="tel" required pattern="\+?[0-9]{8,15}" placeholder="0555123456" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Wilaya" name="wilaya" required maxLength={80} defaultValue="Alger" />
          <Field label="Daïra" name="daira" required maxLength={80} defaultValue="Sidi M'Hamed" />
          <Field label="Baladia" name="baladia" required maxLength={80} defaultValue="Alger Centre" />
        </div>
        
        <PasswordGeneratorInput
          value={password}
          onChange={setPassword}
          hint="Copiez ce mot de passe pour le transmettre directement au gestionnaire avec son identifiant."
        />

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer et affecter le sous-admin" onCancel={onClose} />
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
  const { tText } = useI18n();
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
          <p className="text-sm text-stone-500">{tText("Aucune formule disponible pour le moment. Contactez le Super Admin.")}</p>
        ) : (
          <SelectField label="Formule" value={formuleId} onChange={(e) => setFormuleId(e.target.value)}>
            {formules.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom} — {formatDZD(f.prix)} ({f.duree} {tText("mois")})
              </option>
            ))}
          </SelectField>
        )}
        <Field label="Date de début" type="date" value={debut} onChange={(e) => setDebut(e.target.value)} required />
        <label className="flex items-center gap-2 text-sm text-ink cursor-pointer pt-1">
          <input type="checkbox" checked={paye} onChange={(e) => setPaye(e.target.checked)} className="rounded text-brand" />
          <span>{tText("Marquer comme payé immédiatement")}</span>
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
