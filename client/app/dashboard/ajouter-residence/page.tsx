"use client";

import { Building, Building2, KeyRound, Layers, MapPin, Plus, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createAccount,
  createBatiment,
  createResidence,
  deleteAccount,
  deleteBatiment,
  deleteResidence,
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
  ConfirmModal,
  DataTable,
  Field,
  FormError,
  Modal,
  PageHeader,
  Pill,
  button,
  card,
  describeError,
  useToast,
  type Column,
} from "../ui";
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
        title="Ajouter Résidence"
        subtitle="Créez les résidences et leurs bâtiments, puis nommez l'Admin responsable de chaque résidence et le Sub Admin de chaque bâtiment."
        actions={
          <button type="button" onClick={() => setModal({ kind: "residence" })} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle Résidence
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
  return (
    <nav aria-label="Résidences" className="space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Résidences ({residences.length})</p>
      <ul className="space-y-2">
        {residences.map((r) => {
          const selected = r.id === activeId;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                aria-current={selected ? "true" : undefined}
                className={`w-full rounded-2xl border bg-white p-4 text-left transition ${
                  selected ? "border-ink shadow-md ring-1 ring-ink" : "border-stone-200 hover:border-stone-300 hover:shadow-sm"
                }`}
              >
                <p className="truncate font-semibold text-ink">{r.nom}</p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-stone-500">
                  <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                  {r.localisation}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-stone-600">
                    {r.batiments} bâtiment{r.batiments > 1 ? "s" : ""}
                  </span>
                  {r.admin ? <Pill tone="dark">{fullName(r.admin)}</Pill> : <Pill tone="warning">Sans admin</Pill>}
                </div>
              </button>
            </li>
          );
        })}
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
  if (!person) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-4">
        <p className="text-sm text-stone-500">{emptyLabel}</p>
        <button type="button" onClick={onCreate} className={button("primary", "sm")}>
          <UserPlus className="h-3.5 w-3.5" aria-hidden />
          Créer l&apos;admin
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
  const { residence, admin, batiments } = details;
  const etages = batiments.reduce((sum, b) => sum + b.etages, 0);
  const appartements = batiments.reduce((sum, b) => sum + b.appartements.length, 0);
  const sousAdmins = batiments.filter((b) => b.sousAdmin).length;

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
            <span className="ml-1 text-xs text-stone-500">({b.appartements.filter((a) => a.proprietaire).length} avec propriétaire)</span>
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
            Créer le sub admin
          </button>
        ),
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
            <span className="text-xs text-stone-400">Créée le {formatDate(residence.createdAt)}</span>
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
            { label: "Bâtiments", value: batiments.length, icon: Building },
            { label: "Étages", value: etages, icon: Layers },
            { label: "Appartements", value: appartements, icon: KeyRound },
            { label: "Sub Admins", value: `${sousAdmins} / ${batiments.length}`, icon: UserRound },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
              <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </dt>
              <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={`${card} p-6`}>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
          <ShieldCheck className="h-4 w-4 text-brand" aria-hidden />
          Admin responsable de la résidence
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <Building className="h-4 w-4 text-brand" aria-hidden />
            Bâtiments ({batiments.length})
          </h3>
          <button type="button" onClick={onAddBatiment} className={button("primary", "sm")}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Ajouter un bâtiment
          </button>
        </div>
        <DataTable columns={columns} rows={batiments} rowKey={(b) => b.id} empty="Aucun bâtiment. Ajoutez le premier bâtiment de cette résidence." />
      </section>
    </div>
  );
}

function ResidenceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (r: ResidenceSummary) => void }) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => onCreated(await createResidence({ nom: text(form, "nom"), localisation: text(form, "localisation") })));
  }

  return (
    <Modal title="Nouvelle résidence" description="Nom et localisation de la résidence." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la résidence" name="nom" required minLength={2} maxLength={120} placeholder="Cité 1500 Logements AADL" autoFocus />
        <Field label="Localisation" name="localisation" required minLength={2} maxLength={200} placeholder="Bab Ezzouar, Alger" />
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
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = text(form, "nom");
    void run(async () => {
      await createBatiment(residence.id, { nom, etages: Number(form.get("etages")) });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouveau bâtiment" description={`Dans la résidence « ${residence.nom} ».`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom du bâtiment" name="nom" required maxLength={60} placeholder="A1" autoFocus />
        <Field label="Nombre d'étages" name="etages" type="number" required min={0} max={200} step={1} placeholder="9" />
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
  const { submitting, error, run } = useSubmit();
  const [password, setPassword] = useState("");

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
      password,
    };
    void run(async () => {
      await createAccount(role === "admin" ? { ...profile, role, idResidence: target.id } : { ...profile, role, idBatiment: target.id });
      onCreated(profile.email);
    });
  }

  return (
    <Modal
      title={role === "admin" ? "Nouvel Admin" : "Nouveau Sub Admin"}
      description={`${role === "admin" ? "Responsable de la résidence" : "Responsable du bâtiment"} « ${target.nom} ». Il pourra se connecter avec cet email et ce mot de passe dès qu'un abonnement payé sera en cours${role === "admin" ? "" : " pour l'Admin de la résidence"}.`}
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
          <Field label="Wilaya" name="wilaya" required maxLength={80} />
          <Field label="Daïra" name="daira" required maxLength={80} />
          <Field label="Baladia" name="baladia" required maxLength={80} />
        </div>
        <PasswordField value={password} onChange={setPassword} />
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

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateResidence(residence.id, { nom, localisation });
      onUpdated(nom);
    });
  }

  return (
    <Modal title="Modifier la résidence" description="Modifiez le nom et l'emplacement." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la résidence" value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} maxLength={120} autoFocus />
        <Field label="Localisation" value={localisation} onChange={(e) => setLocalisation(e.target.value)} required minLength={2} maxLength={200} />
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
