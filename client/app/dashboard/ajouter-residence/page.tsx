"use client";

import {
  Building,
  Building2,
  CheckCircle2,
  ChevronRight,
  KeyRound,
  Layers,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { formatDZD } from "@/lib/format";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createAccount,
  createBatiment,
  createResidence,
  deleteAccount,
  deleteBatiment,
  deleteResidence,
  etageLabel,
  getResidence,
  listResidences,
  updateAccount,
  updateBatiment,
  updateResidence,
  type BatimentDetail,
  type ResidenceDetails,
  type ResidenceSummary,
  type Responsable,
} from "@/lib/residences-api";
import { ROLE_LABELS } from "@/lib/roles";
import {
  AccountStatusPill,
  ActionGroup,
  Breadcrumbs,
  ConfirmModal,
  DataTable,
  FacetFilter,
  Field,
  FormError,
  Modal,
  Mono,
  PageHeader,
  PasswordGeneratorInput,
  Pill,
  QuotaProgress,
  button,
  card,
  describeError,
  inputClass,
  useToast,
  type Column,
} from "../ui";
import { useI18n } from "@/lib/i18n";
import { ModalActions, PasswordField, formText as text, useSubmit } from "../forms";

type ModalState =
  | { kind: "residence" }
  | { kind: "batiment"; residence: { id: string; nom: string } }
  | { kind: "admin"; residence: { id: string; nom: string } }
  | { kind: "sub_admin"; batiment: { id: string; nom: string } }
  | { kind: "edit_residence"; residence: ResidenceDetails["residence"] }
  | { kind: "edit_batiment"; batiment: BatimentDetail; residenceId: string }
  | { kind: "edit_account"; account: Responsable }
  | null;

type ConfirmDeleteState =
  | { kind: "residence"; id: string; nom: string }
  | { kind: "batiment"; id: string; nom: string; residenceId: string }
  | { kind: "account"; id: string; nom: string }
  | null;

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");
const fullName = (p: { prenom: string; nom: string }) => `${p.prenom} ${p.nom}`;

export default function AjouterResidencePage() {
  return (
    <Suspense
      fallback={
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      }
    >
      <AjouterResidenceContent />
    </Suspense>
  );
}

function AjouterResidenceContent() {
  const { tText } = useI18n();
  const notify = useToast();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [residences, setResidences] = useState<ResidenceSummary[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<ResidenceDetails | null>(null);
  const [detailsError, setDetailsError] = useState<{ id: string; message: string } | null>(null);
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState<ModalState>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteState>(null);

  useEffect(() => {
    if (queryId) setSelectedId(queryId);
  }, [queryId]);

  const activeId = selectedId ?? queryId ?? residences?.[0]?.id ?? null;
  const refresh = () => setVersion((v) => v + 1);
  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    let active = true;
    listResidences()
      .then((list) => {
        if (!active) return;
        setResidences(list);
        setListError(null);
      })
      .catch((err) => {
        if (active) setListError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  useEffect(() => {
    if (!activeId) return;
    let active = true;
    getResidence(activeId)
      .then((d) => {
        if (!active) return;
        setDetails(d);
        setDetailsError(null);
      })
      .catch((err) => {
        if (active) setDetailsError({ id: activeId, message: describeError(err).message });
      });
    return () => {
      active = false;
    };
  }, [activeId, version]);

  const shownDetails = details && details.residence.id === activeId ? details : null;
  const shownDetailsError = detailsError && detailsError.id === activeId ? detailsError.message : null;

  function onCreated(message: string, newResidenceId?: string) {
    setModal(null);
    if (newResidenceId) setSelectedId(newResidenceId);
    refresh();
    notify(message);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title={tText("Ajouter Résidence")}
        subtitle={tText("Créez les résidences et leurs bâtiments, puis nommez l'Admin responsable de chaque résidence et le Sub Admin de chaque bâtiment.")}
        actions={
          <button type="button" onClick={() => setModal({ kind: "residence" })} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            {tText("Nouvelle Résidence")}
          </button>
        }
      />

      {listError && <FormError error={{ message: listError, details: [] }} />}

      {residences === null && !listError ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : residences && residences.length === 0 ? (
        <section className={`${card} flex flex-col items-center p-12 text-center`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-bold text-ink">Aucune résidence pour le moment</h2>
          <p className="mt-1 max-w-sm text-sm text-stone-500">Commencez par créer une résidence. Vous pourrez ensuite y ajouter des bâtiments et nommer les responsables.</p>
          <button type="button" onClick={() => setModal({ kind: "residence" })} className={`${button("primary")} mt-6`}>
            <Plus className="h-4 w-4" aria-hidden />
            Créer la première résidence
          </button>
        </section>
      ) : residences ? (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <ResidenceList residences={residences} activeId={activeId} onSelect={setSelectedId} />
          <div className="min-w-0">
            {shownDetailsError ? (
              <FormError error={{ message: shownDetailsError, details: [] }} />
            ) : shownDetails ? (
              <ResidenceDetailsView
                details={shownDetails}
                onAddBatiment={() => setModal({ kind: "batiment", residence: { id: shownDetails.residence.id, nom: shownDetails.residence.nom } })}
                onAddAdmin={() => setModal({ kind: "admin", residence: { id: shownDetails.residence.id, nom: shownDetails.residence.nom } })}
                onAddSubAdmin={(b) => setModal({ kind: "sub_admin", batiment: { id: b.id, nom: b.nom } })}
                onEditResidence={(r) => setModal({ kind: "edit_residence", residence: r })}
                onDeleteResidence={(id, nom) => setConfirmDelete({ kind: "residence", id, nom })}
                onEditBatiment={(b) => setModal({ kind: "edit_batiment", batiment: b, residenceId: shownDetails.residence.id })}
                onDeleteBatiment={(id, nom) => setConfirmDelete({ kind: "batiment", id, nom, residenceId: shownDetails.residence.id })}
                onEditAccount={(a) => setModal({ kind: "edit_account", account: a })}
                onDeleteAccount={(id, nom) => setConfirmDelete({ kind: "account", id, nom })}
              />
            ) : (
              <div className={`${card} flex items-center justify-center p-16`}>
                <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
              </div>
            )}
          </div>
        </div>
      ) : null}

      {modal?.kind === "residence" && (
        <ResidenceModal onClose={closeModal} onCreated={(r) => onCreated(`Résidence « ${r.nom} » créée.`, r.id)} />
      )}
      {modal?.kind === "batiment" && (
        <BatimentModal residence={modal.residence} onClose={closeModal} onCreated={(nom) => onCreated(`Bâtiment « ${nom} » ajouté.`)} />
      )}
      {modal?.kind === "admin" && (
        <AccountModal
          role="admin"
          target={{ label: "Résidence", nom: modal.residence.nom, id: modal.residence.id }}
          onClose={closeModal}
          onCreated={(email) => onCreated(`Compte Admin créé pour ${email}.`)}
        />
      )}
      {modal?.kind === "sub_admin" && (
        <AccountModal
          role="sub_admin"
          target={{ label: "Bâtiment", nom: modal.batiment.nom, id: modal.batiment.id }}
          onClose={closeModal}
          onCreated={(email) => onCreated(`Compte Sub Admin créé pour ${email}.`)}
        />
      )}
      {modal?.kind === "edit_residence" && (
        <EditResidenceModal
          residence={modal.residence}
          onClose={closeModal}
          onUpdated={(nom) => {
            setModal(null);
            refresh();
            notify(`Résidence « ${nom} » mise à jour.`);
          }}
        />
      )}
      {modal?.kind === "edit_batiment" && (
        <EditBatimentModal
          batiment={modal.batiment}
          residenceId={modal.residenceId}
          onClose={closeModal}
          onUpdated={(nom) => {
            setModal(null);
            refresh();
            notify(`Bâtiment « ${nom} » mis à jour.`);
          }}
        />
      )}
      {modal?.kind === "edit_account" && (
        <EditAccountModal
          account={modal.account}
          onClose={closeModal}
          onUpdated={(nom) => {
            setModal(null);
            refresh();
            notify(`Compte de ${nom} mis à jour.`);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          isOpen={true}
          title={`Supprimer ${
            confirmDelete.kind === "residence"
              ? "la résidence"
              : confirmDelete.kind === "batiment"
              ? "le bâtiment"
              : "le compte"
          }`}
          message={`Êtes-vous sûr de vouloir supprimer « ${confirmDelete.nom} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer définitivement"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            try {
              if (confirmDelete.kind === "residence") {
                await deleteResidence(confirmDelete.id);
                notify(`Résidence « ${confirmDelete.nom} » supprimée.`);
                if (selectedId === confirmDelete.id) setSelectedId(null);
              } else if (confirmDelete.kind === "batiment") {
                await deleteBatiment(confirmDelete.residenceId!, confirmDelete.id);
                notify(`Bâtiment « ${confirmDelete.nom} » supprimé.`);
              } else if (confirmDelete.kind === "account") {
                await deleteAccount(confirmDelete.id);
                notify(`Compte « ${confirmDelete.nom} » supprimé.`);
              }
              setConfirmDelete(null);
              refresh();
            } catch (err) {
              notify(describeError(err).message);
            }
          }}
        />
      )}
    </div>
  );
}

function ResidenceList({
  residences,
  activeId,
  onSelect,
}: {
  residences: ResidenceSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { tText } = useI18n();
  const [search, setSearch] = useState("");
  const needle = search.trim().toLowerCase();
  const filtered = residences.filter(
    (r) => !needle || r.nom.toLowerCase().includes(needle) || r.localisation.toLowerCase().includes(needle),
  );

  return (
    <nav aria-label="Résidences" className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">{tText("Résidences")} ({residences.length})</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tText("Filtrer résidences...")}
          className="w-full rounded-xl border border-stone-200 bg-white py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((r) => {
          const selected = r.id === activeId;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                aria-current={selected ? "true" : undefined}
                className={`w-full rounded-2xl border p-4 text-start transition ${
                  selected
                    ? "border-brand bg-orange-50/20 shadow-md ring-2 ring-brand/30"
                    : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-bold text-ink">{r.nom}</p>
                  {selected && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />}
                </div>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-stone-500">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                  {r.localisation}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-stone-600">
                    {r.batiments} {tText("bâtiments")}
                  </span>
                  {r.admin ? (
                    <Pill tone="success">{tText("Admin")} : {fullName(r.admin)}</Pill>
                  ) : (
                    <Pill tone="warning">{tText("Sans admin")}</Pill>
                  )}
                </div>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="py-6 text-center text-xs text-stone-400">{tText("Aucune résidence trouvée.")}</li>
        )}
      </ul>
    </nav>
  );
}

function ResponsableCard({
  person,
  emptyLabel,
  onCreate,
  onEdit,
  onDelete,
}: {
  person: Responsable | null;
  emptyLabel: string;
  onCreate: () => void;
  onEdit?: (person: Responsable) => void;
  onDelete?: (person: Responsable) => void;
}) {
  const { tText } = useI18n();
  if (!person) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-4">
        <p className="text-sm text-stone-500">{tText(emptyLabel)}</p>
        <button type="button" onClick={onCreate} className={button("primary", "sm")}>
          <UserPlus className="h-3.5 w-3.5" aria-hidden />
          {tText("Créer l'admin")}
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 p-4">
      <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-brand">
        {person.prenom[0]}
        {person.nom[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{fullName(person)}</p>
        <p className="truncate text-xs text-stone-500">
          {person.email} · <span className="font-mono">{person.telephone}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <AccountStatusPill actif={person.actif} />
        <Pill tone="dark">{ROLE_LABELS[person.role]}</Pill>
        {onEdit && onDelete && (
          <ActionGroup
            editLabel="Modifier compte"
            deleteLabel="Supprimer compte"
            onEdit={() => onEdit(person)}
            onDelete={() => onDelete(person)}
          />
        )}
      </div>
    </div>
  );
}

function ResidenceDetailsView({
  details,
  onAddBatiment,
  onAddAdmin,
  onAddSubAdmin,
  onEditResidence,
  onDeleteResidence,
  onEditBatiment,
  onDeleteBatiment,
  onEditAccount,
  onDeleteAccount,
}: {
  details: ResidenceDetails;
  onAddBatiment: () => void;
  onAddAdmin: () => void;
  onAddSubAdmin: (batiment: BatimentDetail) => void;
  onEditResidence: (residence: ResidenceDetails["residence"]) => void;
  onDeleteResidence: (id: string, nom: string) => void;
  onEditBatiment: (batiment: BatimentDetail) => void;
  onDeleteBatiment: (id: string, nom: string) => void;
  onEditAccount: (account: Responsable) => void;
  onDeleteAccount: (id: string, nom: string) => void;
}) {
  const { tText } = useI18n();
  const { residence, admin, batiments } = details;
  const etages = batiments.reduce((sum, b) => sum + b.etages, 0);
  const appartements = batiments.reduce((sum, b) => sum + b.appartements.length, 0);
  const sousAdmins = batiments.filter((b) => b.sousAdmin).length;

  const [selectedBatimentId, setSelectedBatimentId] = useState<string | null>(null);
  const [drilldownFilter, setDrilldownFilter] = useState<"all" | "occupes" | "impayes">("all");
  const selectedBatiment = batiments.find((b) => b.id === selectedBatimentId);

  const drilldownApts = (selectedBatiment?.appartements ?? []).filter((apt) => {
    if (drilldownFilter === "occupes") return !!apt.proprietaire;
    if (drilldownFilter === "impayes") return apt.paiement?.statut === "impaye";
    return true;
  });
  const drilldownOccupesCount = (selectedBatiment?.appartements ?? []).filter((a) => a.proprietaire).length;
  const drilldownImpayesCount = (selectedBatiment?.appartements ?? []).filter((a) => a.paiement?.statut === "impaye").length;

  const columns: Column<BatimentDetail>[] = [
    {
      header: "Bâtiment",
      cell: (b) => (
        <span className="flex items-center gap-2 font-semibold text-ink">
          <Building className="h-4 w-4 text-stone-400" aria-hidden />
          {b.nom}
        </span>
      ),
    },
    { header: "Étages", cell: (b) => b.etages },
    {
      header: "Appartements",
      cell: (b) => (
        <span>
          {b.appartements.length}
          {b.appartements.length > 0 && (
            <span className="ml-1 text-xs text-stone-500">({b.appartements.filter((a) => a.proprietaire).length} {tText("avec propriétaire")})</span>
          )}
        </span>
      ),
    },
    {
      header: "Sub Admin responsable",
      cell: (b) =>
        b.sousAdmin ? (
          <span className="flex flex-col items-start gap-1">
            <span className="font-semibold text-ink">{fullName(b.sousAdmin)}</span>
            <span className="text-xs text-stone-500">{b.sousAdmin.email}</span>
            <AccountStatusPill actif={b.sousAdmin.actif} />
          </span>
        ) : (
          <button type="button" onClick={() => onAddSubAdmin(b)} className={button("secondary", "sm")}>
            <UserPlus className="h-3.5 w-3.5" aria-hidden />
            {tText("Créer le sub admin")}
          </button>
        ),
    },
    {
      header: "Résidents & Cotisations",
      cell: (b) => {
        const isSelected = selectedBatimentId === b.id;
        const total = b.appartements.length;
        const occupes = b.appartements.filter((a) => a.proprietaire).length;
        const impayes = b.appartements.filter((a) => a.paiement?.statut === "impaye").length;
        return (
          <button
            type="button"
            onClick={() => setSelectedBatimentId(isSelected ? null : b.id)}
            className={`${button(isSelected ? "primary" : "secondary", "sm")} flex items-center gap-1.5`}
          >
            <Users className="h-3.5 w-3.5" aria-hidden />
            <span>{isSelected ? tText("Fermer Détails") : `${tText("Voir Résidents")} (${occupes}/${total})`}</span>
            {impayes > 0 && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                {impayes} {tText("impayés")}
              </span>
            )}
          </button>
        );
      },
    },
    { header: "Ajouté le", cell: (b) => <span className="text-stone-500">{formatDate(b.createdAt)}</span> },
    {
      header: "Actions",
      align: "right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-2">
          {b.sousAdmin && (
            <span className="flex items-center gap-1 border-r border-stone-200 pr-2">
              <ActionGroup
                editLabel="Modifier Sub Admin"
                deleteLabel="Supprimer Sub Admin"
                onEdit={() => onEditAccount(b.sousAdmin!)}
                onDelete={() => onDeleteAccount(b.sousAdmin!.id, fullName(b.sousAdmin!))}
              />
            </span>
          )}
          <ActionGroup
            editLabel="Modifier Bâtiment"
            deleteLabel="Supprimer Bâtiment"
            onEdit={() => onEditBatiment(b)}
            onDelete={() => onDeleteBatiment(b.id, b.nom)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <section className={`${card} p-6`}>
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-brand">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight text-ink">{residence.nom}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {residence.localisation}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-stone-400">{tText("Créée le")} {formatDate(residence.createdAt)}</span>
            <ActionGroup
              editLabel="Modifier Résidence"
              deleteLabel="Supprimer Résidence"
              onEdit={() => onEditResidence(residence)}
              onDelete={() => onDeleteResidence(residence.id, residence.nom)}
            />
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Bâtiments", value: `${batiments.length} / ${residence.maxBatiments || 5}`, icon: Building },
            { label: "Étages", value: etages, icon: Layers },
            { label: "Appartements", value: appartements, icon: KeyRound },
            { label: "Sub Admins", value: `${sousAdmins} / ${batiments.length}`, icon: UserRound },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {tText(label)}
              </dt>
              <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${card} p-6`}>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <ShieldCheck className="h-4 w-4 text-brand" aria-hidden />
          {tText("Admin responsable de la résidence")}
        </h3>
        <ResponsableCard
          person={admin}
          emptyLabel="Aucun admin n'est encore responsable de cette résidence."
          onCreate={onAddAdmin}
          onEdit={onEditAccount}
          onDelete={(person) => onDeleteAccount(person.id, fullName(person))}
        />
        {admin && !admin.actif && (
          <p className="mt-3 text-xs text-stone-500">
            L&apos;Admin et les Sub Admins de cette résidence ne peuvent pas se connecter tant qu&apos;un abonnement n&apos;est pas attribué et marqué payé dans « Gestion Abonnements ».
          </p>
        )}
      </section>

      <section className="space-y-3">
        <QuotaProgress
          current={batiments.length}
          max={residence.maxBatiments || 5}
          label={`${tText("Quota de bâtiments de")} « ${residence.nom} »`}
          unit={tText("bâtiments")}
        />
        <QuotaProgress
          current={appartements}
          max={residence.maxResidents || 100}
          label={`${tText("Capacité maximale de résidents")} (« ${residence.nom} »)`}
          unit={tText("résidents")}
        />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <Building className="h-4 w-4 text-brand" aria-hidden />
            {tText("Bâtiments")} ({batiments.length})
          </h3>
          {batiments.length >= (residence.maxBatiments || 5) ? (
            <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              {tText("Quota atteint")} ({residence.maxBatiments || 5} max)
            </span>
          ) : (
            <button type="button" onClick={onAddBatiment} className={button("primary", "sm")}>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {tText("Ajouter un bâtiment")}
            </button>
          )}
        </div>
        <DataTable columns={columns} rows={batiments} rowKey={(b) => b.id} empty={tText("Aucun bâtiment. Ajoutez le premier bâtiment de cette résidence.")} />

        {selectedBatiment && (
          <div className="rounded-2xl border-2 border-brand/30 bg-orange-50/20 p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand p-1.5 text-white">
                    <Building className="h-4 w-4" />
                  </span>
                  <h4 className="text-base font-bold text-ink">
                    Bâtiment {selectedBatiment.nom} — Détail des Logements & Résidents
                  </h4>
                </div>
                <p className="mt-0.5 text-xs text-stone-500">
                  {selectedBatiment.etages} étages · {selectedBatiment.appartements.length} / {selectedBatiment.maxAppartements ?? 50} logements autorisés
                  {selectedBatiment.sousAdmin ? ` · Sous-Admin : ${fullName(selectedBatiment.sousAdmin)} (${selectedBatiment.sousAdmin.telephone})` : " · Aucun Sous-Admin assigné"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/residents"
                  className={button("secondary", "sm")}
                >
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  Gérer sur la page Résidents
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedBatimentId(null)}
                  className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-200 hover:text-ink"
                  title="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {selectedBatiment.appartements.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-500">
                {tText("Aucun appartement n'a encore été créé dans ce bâtiment.")}
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FacetFilter
                    value={drilldownFilter}
                    onChange={setDrilldownFilter}
                    options={[
                      { id: "all", label: "Tous les logements", count: selectedBatiment.appartements.length },
                      { id: "occupes", label: "Occupés", count: drilldownOccupesCount },
                      { id: "impayes", label: "Cotisations impayées", count: drilldownImpayesCount },
                    ]}
                  />
                  <span className="text-xs font-semibold text-stone-500">
                    {drilldownApts.length} {tText("appartements")}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
                  <table className="w-full text-start text-sm">
                    <thead className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <tr>
                        <th className="px-4 py-3">{tText("Logement")}</th>
                        <th className="px-4 py-3">{tText("Étage")}</th>
                        <th className="px-4 py-3">{tText("Résident / Propriétaire")}</th>
                        <th className="px-4 py-3">{tText("Contact")}</th>
                        <th className="px-4 py-3">{tText("Statut Cotisation")}</th>
                        <th className="px-4 py-3 text-end">{tText("Action")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {drilldownApts.map((apt) => {
                        const prop = apt.proprietaire;
                        const p = apt.paiement;
                        const isImpaye = p?.statut === "impaye";
                        return (
                          <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                            <td className="px-4 py-3 font-bold text-ink">{apt.nom}</td>
                            <td className="px-4 py-3 text-stone-600">{etageLabel(apt.etage)}</td>
                            <td className="px-4 py-3">
                              {prop ? (
                                <span className="font-semibold text-ink">{fullName(prop)}</span>
                              ) : (
                                <span className="text-xs text-stone-400 italic">Logement vacant</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {prop ? (
                                <div className="flex items-center gap-2">
                                  <Mono>{prop.telephone}</Mono>
                                  <span className="text-stone-400">·</span>
                                  <span className="text-stone-500">{prop.email}</span>
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {!prop ? (
                                <Pill tone="neutral">Vacant</Pill>
                              ) : isImpaye ? (
                                <Pill tone="danger">
                                  Impayé {p.totalDu > 0 ? `(${formatDZD(p.totalDu)})` : ""}
                                </Pill>
                              ) : (
                                <Pill tone="success">À jour (Payé)</Pill>
                              )}
                            </td>
                            <td className="px-4 py-3 text-end">
                              {prop && (
                                <a
                                  href={`tel:${prop.telephone}`}
                                  className={button("secondary", "sm")}
                                  title={`Appeler ${fullName(prop)}`}
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                  Appeler
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ResidenceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: ResidenceSummary) => void }) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () =>
      onCreated(
        await createResidence({
          nom: text(form, "nom"),
          localisation: text(form, "localisation"),
          maxBatiments: Number(form.get("maxBatiments")) || 5,
          maxResidents: Number(form.get("maxResidents")) || 100,
        }),
      ),
    );
  }

  return (
    <Modal title="Nouvelle résidence" description="Nom, localisation et quotas autorisés." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la résidence" name="nom" required minLength={2} maxLength={120} placeholder="Cité 1500 Logements AADL" autoFocus />
        <Field label="Localisation" name="localisation" required minLength={2} maxLength={200} placeholder="Bab Ezzouar, Alger" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Max bâtiments autorisés" name="maxBatiments" type="number" defaultValue="5" required min={1} max={500} step={1} />
          <Field label="Max résidents autorisés" name="maxResidents" type="number" defaultValue="100" required min={1} max={10000} step={1} />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer la résidence" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function BatimentModal({
  residence,
  onClose,
  onCreated,
}: {
  residence: { id: string; nom: string };
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
    const nom = text(form, "nom");
    const et = Number(form.get("etages") ?? etages);
    const maxAppartements = Number(form.get("maxAppartements") || totalCalcule || 50);
    void run(async () => {
      await createBatiment(residence.id, { nom, etages: et, maxAppartements });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouveau bâtiment (Bloc)" description={`${tText("Dans la résidence")} « ${residence.nom} ».`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom du bâtiment" name="nom" required maxLength={60} placeholder="ex: Bloc B ou Tour 03" autoFocus />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Nombre d'étages"
            name="etages"
            type="number"
            required
            min={0}
            max={200}
            step={1}
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
          label="Capacité maximale d'appartements"
          name="maxAppartements"
          type="number"
          value={totalCalcule}
          required
          min={1}
          max={2000}
          step={1}
          hint={`${tText("Calcul estimé :")} ${etages} ${tText("étages")} × ${appartementsParEtage} ${tText("logements")} = ${totalCalcule} ${tText("appartements")}`}
        />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter le bâtiment" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function AccountModal({
  role,
  target,
  onClose,
  onCreated,
}: {
  role: "admin" | "sub_admin";
  target: { label: string; nom: string; id: string };
  onClose: () => void;
  onCreated: (email: string) => void;
}) {
  const { tText } = useI18n();
  const { submitting, error, run } = useSubmit();
  const [password, setPassword] = useState("City@2026!Sec");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const profile = {
      prenom: text(form, "prenom"),
      nom: text(form, "nom"),
      email: text(form, "email").toLowerCase(),
      telephone: text(form, "telephone"),
      wilaya: text(form, "wilaya"),
      daira: text(form, "daira"),
      baladia: text(form, "baladia"),
      password: password || "City@2026!",
    };
    void run(async () => {
      await createAccount(role === "admin" ? { ...profile, role, idResidence: target.id } : { ...profile, role, idBatiment: target.id });
      onCreated(profile.email);
    });
  }

  return (
    <Modal
      title={role === "admin" ? tText("Nouvel Admin (Syndic de Résidence)") : tText("Nouveau Sous-Admin (Gestionnaire de Bloc)")}
      description={`${role === "admin" ? tText("Responsable de la résidence") : tText("Responsable du bâtiment")} « ${target.nom} ». ${tText("Il pourra se connecter dès qu'un abonnement payé sera en cours.")}`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-2.5 text-sm">
          <span className="text-stone-500">{target.label}</span>
          <span className="font-semibold text-ink">{target.nom}</span>
          <Pill tone="dark">{ROLE_LABELS[role]}</Pill>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" name="prenom" required maxLength={60} autoComplete="off" autoFocus />
          <Field label="Nom" name="nom" required maxLength={60} autoComplete="off" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" required maxLength={254} autoComplete="off" />
          <Field label="Téléphone" name="telephone" type="tel" required pattern="\+?[0-9]{8,15}" title="8 à 15 chiffres, + facultatif" placeholder="0555123456" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Wilaya" name="wilaya" required maxLength={80} defaultValue="Alger" />
          <Field label="Daïra" name="daira" required maxLength={80} defaultValue="Sidi M'Hamed" />
          <Field label="Baladia" name="baladia" required maxLength={80} defaultValue="Alger Centre" />
        </div>
        <PasswordGeneratorInput
          value={password}
          onChange={setPassword}
          hint="Copiez ce mot de passe pour le transmettre directement à l'administrateur avec ses accès."
        />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer le compte" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditResidenceModal({
  residence,
  onClose,
  onUpdated,
}: {
  residence: ResidenceDetails["residence"];
  onClose: () => void;
  onUpdated: (nom: string) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(residence.nom);
  const [localisation, setLocalisation] = useState(residence.localisation);
  const [maxBatiments, setMaxBatiments] = useState(residence.maxBatiments || 5);
  const [maxResidents, setMaxResidents] = useState(residence.maxResidents || 100);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateResidence(residence.id, {
        nom,
        localisation,
        maxBatiments: Number(maxBatiments),
        maxResidents: Number(maxResidents),
      });
      onUpdated(nom);
    });
  }

  return (
    <Modal title="Modifier la résidence" description="Modifiez le nom, l'emplacement et les quotas autorisés." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la résidence" value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} maxLength={120} autoFocus />
        <Field label="Localisation" value={localisation} onChange={(e) => setLocalisation(e.target.value)} required minLength={2} maxLength={200} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Max bâtiments autorisés" value={maxBatiments} onChange={(e) => setMaxBatiments(Number(e.target.value))} type="number" required min={1} max={500} />
          <Field label="Max résidents autorisés" value={maxResidents} onChange={(e) => setMaxResidents(Number(e.target.value))} type="number" required min={1} max={10000} />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
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
  batiment: BatimentDetail;
  residenceId: string;
  onClose: () => void;
  onUpdated: (nom: string) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(batiment.nom);
  const [etages, setEtages] = useState(batiment.etages);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateBatiment(residenceId, batiment.id, { nom, etages: Number(etages) });
      onUpdated(nom);
    });
  }

  return (
    <Modal title="Modifier le bâtiment" description={`Bâtiment « ${batiment.nom} ».`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom du bâtiment" value={nom} onChange={(e) => setNom(e.target.value)} required maxLength={60} autoFocus />
        <Field label="Nombre d'étages" type="number" value={etages} onChange={(e) => setEtages(Number(e.target.value))} required min={0} max={200} step={1} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function EditAccountModal({
  account,
  onClose,
  onUpdated,
}: {
  account: Responsable;
  onClose: () => void;
  onUpdated: (nom: string) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [prenom, setPrenom] = useState(account.prenom);
  const [nom, setNom] = useState(account.nom);
  const [email, setEmail] = useState(account.email);
  const [telephone, setTelephone] = useState(account.telephone);
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      const payload: { prenom: string; nom: string; email: string; telephone: string; password?: string } = {
        prenom,
        nom,
        email: email.toLowerCase(),
        telephone,
      };
      if (password.trim()) payload.password = password.trim();
      await updateAccount(account.id, payload);
      onUpdated(`${prenom} ${nom}`);
    });
  }

  return (
    <Modal
      title={`Modifier ${account.role === "admin" ? "l'Admin" : "le Sub Admin"}`}
      description={`Compte : ${account.email}. Laissez le mot de passe vide si vous ne souhaitez pas le changer.`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required maxLength={60} autoFocus />
          <Field label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required maxLength={60} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={254} />
          <Field label="Téléphone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} required pattern="\\+?[0-9]{8,15}" title="8 à 15 chiffres, + facultatif" />
        </div>
        <PasswordField value={password} onChange={setPassword} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
