"use client";

import {
  BadgeCheck,
  CalendarRange,
  CircleDollarSign,
  CreditCard,
  Plus,
  Receipt,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { formatDZD } from "@/lib/format";
import {
  createFormule,
  createSouscription,
  deleteFormule,
  deleteSouscription,
  listAdminsAbonnes,
  listFormules,
  listSousAdminsAbonnes,
  setStatutPaiement,
  updateFormule,
  type AdminAbonne,
  type Formule,
  type SousAdminAbonne,
  type Souscription,
} from "@/lib/platform-api";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import {
  AccountStatusPill,
  ActionGroup,
  ConfirmModal,
  DataTable,
  ExportPeriodToolbar,
  FacetFilter,
  Field,
  FormError,
  Modal,
  PageHeader,
  Pill,
  Tabs,
  button,
  card,
  describeError,
  downloadCsv,
  useToast,
  type Column,
  type TabItem,
  type Tone,
} from "../ui";

type Etat = "Actif" | "À venir" | "Expiré";
type ModalState =
  | { kind: "formule" }
  | { kind: "edit_formule"; formule: Formule }
  | { kind: "attribuer"; target: { id: string; nom: string; detail?: string } }
  | { kind: "historique"; target: { id: string; nom: string; email: string; souscriptions: Souscription[] } }
  | null;

const ETAT_TONE: Record<Etat, Tone> = { Actif: "success", "À venir": "brand", Expiré: "neutral" };

// Subscription dates are stored as UTC midnights, so they are displayed in UTC to avoid a one-day shift.
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" });
const fullName = (a: { prenom: string; nom: string }) => `${a.prenom} ${a.nom}`;
const dureeLabel = (mois: number) => (mois % 12 === 0 ? `${mois / 12} an${mois > 12 ? "s" : ""}` : `${mois} mois`);

function etat(s: Souscription, now = Date.now()): Etat {
  if (new Date(s.debut).getTime() > now) return "À venir";
  return new Date(s.fin).getTime() > now ? "Actif" : "Expiré";
}

// Active first, then the next upcoming one, otherwise the most recent (list is sorted by start date, newest first).
function current(subs: Souscription[]): Souscription | null {
  return subs.find((s) => etat(s) === "Actif") ?? subs.findLast((s) => etat(s) === "À venir") ?? subs[0] ?? null;
}

// Mirrors the server: adds calendar months in UTC and clamps to the end of the month.
function addMonths(isoDate: string, months: number): Date {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return target;
}

export default function AbonnementsPage() {
  const notify = useToast();
  const [formules, setFormules] = useState<Formule[] | null>(null);
  const [admins, setAdmins] = useState<AdminAbonne[] | null>(null);
  const [sousAdmins, setSousAdmins] = useState<SousAdminAbonne[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<"admins" | "sous_admins" | "formules">("admins");
  const [modal, setModal] = useState<ModalState>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: "formule" | "souscription"; id: string; nom: string } | null>(null);
  const [adminFilter, setAdminFilter] = useState<"all" | "paye" | "impaye">("all");
  const [sousAdminFilter, setSousAdminFilter] = useState<"all" | "paye" | "impaye">("all");

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);

  const refresh = () => setVersion((v) => v + 1);

  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    let active = true;
    Promise.all([listFormules(), listAdminsAbonnes(), listSousAdminsAbonnes()])
      .then(([f, a, sa]) => {
        if (!active) return;
        setFormules(f);
        setAdmins(a);
        setSousAdmins(sa);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  async function togglePaiement(s: Souscription) {
    setBusyId(s.id);
    try {
      await setStatutPaiement(s.id, !s.statutPaiement);
      notify(s.statutPaiement ? "Abonnement marqué comme non payé." : "Paiement enregistré.");
      refresh();
    } catch (err) {
      notify(describeError(err).message);
    } finally {
      setBusyId(null);
    }
  }

  function onCreated(message: string) {
    setModal(null);
    refresh();
    notify(message);
  }

  const adminColumns: Column<AdminAbonne>[] = [
    {
      header: "Admin responsable",
      cell: (a) => (
        <span className="flex flex-col items-start gap-1">
          <span className="font-semibold text-ink">{fullName(a)}</span>
          <span className="text-xs text-stone-500">{a.email}</span>
          <AccountStatusPill actif={a.actif} />
        </span>
      ),
    },
    {
      header: "Résidence",
      cell: (a) => (a.residence ? <span className="font-semibold text-ink">{a.residence.nom}</span> : <Pill tone="neutral">Non attribuée</Pill>),
    },
    {
      header: "Abonnement en cours",
      cell: (a) => {
        const c = current(a.souscriptions);
        if (!c) return <Pill tone="neutral">Aucun abonnement</Pill>;
        return (
          <span className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-ink">{c.abonnement?.nom ?? "Formule supprimée"}</span>
              <Pill tone={ETAT_TONE[etat(c)]}>{etat(c)}</Pill>
            </span>
            <span className="text-xs text-stone-500">
              {formatDate(c.debut)} → {formatDate(c.fin)}
              {c.abonnement && ` · ${formatDZD(c.abonnement.prix)}`}
            </span>
          </span>
        );
      },
    },
    {
      header: "Paiement",
      cell: (a) => {
        const c = current(a.souscriptions);
        if (!c) return <span className="text-xs text-stone-400">—</span>;
        return <PaiementToggle s={c} busy={busyId === c.id} onToggle={togglePaiement} />;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (a) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setModal({ kind: "attribuer", target: { id: a.id, nom: fullName(a), detail: a.residence ? `Résidence ${a.residence.nom}` : undefined } })}
            className={button("secondary", "sm")}
          >
            <CalendarRange className="h-3.5 w-3.5" aria-hidden />
            Attribuer
          </button>
          <button
            type="button"
            onClick={() => setModal({ kind: "historique", target: { id: a.id, nom: fullName(a), email: a.email, souscriptions: a.souscriptions } })}
            className={button("ghost", "sm")}
          >
            Historique ({a.souscriptions.length})
          </button>
        </div>
      ),
    },
  ];

  const sousAdminColumns: Column<SousAdminAbonne>[] = [
    {
      header: "Sous-Admin",
      cell: (sa) => (
        <span className="flex flex-col items-start gap-1">
          <span className="font-semibold text-ink">{fullName(sa)}</span>
          <span className="text-xs text-stone-500">{sa.email}</span>
          <AccountStatusPill actif={sa.actif} />
        </span>
      ),
    },
    {
      header: "Résidence & Bâtiment",
      cell: (sa) => (
        <span className="flex flex-col text-xs">
          <span className="font-semibold text-ink">{sa.residence?.nom ?? "—"}</span>
          <span className="text-stone-500">{sa.batiment?.nom ? `Bâtiment ${sa.batiment.nom}` : "Bâtiment non assigné"}</span>
        </span>
      ),
    },
    {
      header: "Abonnement",
      cell: (sa) => {
        const c = current(sa.souscriptions);
        if (!c) return <Pill tone="neutral">Aucun abonnement</Pill>;
        return (
          <span className="flex flex-col items-start gap-1">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-ink">{c.abonnement?.nom ?? "Formule"}</span>
              <Pill tone={ETAT_TONE[etat(c)]}>{etat(c)}</Pill>
            </span>
            <span className="text-xs text-stone-500">
              {formatDate(c.debut)} → {formatDate(c.fin)}
              {c.abonnement && ` · ${formatDZD(c.abonnement.prix)}`}
            </span>
          </span>
        );
      },
    },
    {
      header: "Paiement",
      cell: (sa) => {
        const c = current(sa.souscriptions);
        if (!c) return <span className="text-xs text-stone-400">—</span>;
        return <PaiementToggle s={c} busy={busyId === c.id} onToggle={togglePaiement} />;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (sa) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              setModal({
                kind: "attribuer",
                target: { id: sa.id, nom: fullName(sa), detail: `Sous-Admin ${sa.batiment?.nom ?? ""}` },
              })
            }
            className={button("secondary", "sm")}
          >
            <CalendarRange className="h-3.5 w-3.5" aria-hidden />
            Attribuer
          </button>
          <button
            type="button"
            onClick={() =>
              setModal({
                kind: "historique",
                target: { id: sa.id, nom: fullName(sa), email: sa.email, souscriptions: sa.souscriptions },
              })
            }
            className={button("ghost", "sm")}
          >
            Historique ({sa.souscriptions.length})
          </button>
        </div>
      ),
    },
  ];

  const formuleColumns: Column<Formule>[] = [
    {
      header: "Formule",
      cell: (f) => (
        <div>
          <span className="block font-semibold text-ink">{f.nom}</span>
          <span className="block text-xs text-stone-400">Créée le {formatDate(f.createdAt)}</span>
        </div>
      ),
    },
    {
      header: "Cible",
      cell: (f) => (
        <Pill tone={f.cible === "sub_admin" ? "brand" : "dark"}>
          {f.cible === "sub_admin" ? "Sous-Admin (Bâtiment)" : "Admin (Résidence)"}
        </Pill>
      ),
    },
    {
      header: "Durée",
      cell: (f) => (
        <span className="inline-flex items-center gap-1.5">
          <span>{dureeLabel(f.duree)}</span>
          {f.duree === 12 && (
            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
              Standard 1 An
            </span>
          )}
        </span>
      ),
    },
    { header: "Prix", cell: (f) => <span className="font-semibold text-ink">{formatDZD(f.prix)}</span> },
    {
      header: "Souscriptions",
      cell: (f) => (
        <span className="text-stone-600">
          {f.souscriptions} souscription{f.souscriptions > 1 ? "s" : ""}
        </span>
      ),
    },
    {
      header: "Actions",
      align: "right",
      cell: (f) => (
        <ActionGroup
          editLabel="Modifier la formule"
          deleteLabel="Supprimer la formule"
          onEdit={() => setModal({ kind: "edit_formule", formule: f })}
          onDelete={() => setConfirmDelete({ kind: "formule", id: f.id, nom: f.nom })}
        />
      ),
    },
  ];

  const totalAdmins = admins?.length ?? 0;
  const paidAdmins = (admins ?? []).filter((a) => {
    const c = current(a.souscriptions);
    return !!(c && c.statutPaiement);
  }).length;
  const unpaidAdmins = totalAdmins - paidAdmins;

  const filteredAdmins = (admins ?? []).filter((a) => {
    const c = current(a.souscriptions);
    const isPaid = !!(c && c.statutPaiement);
    if (adminFilter === "paye") return isPaid;
    if (adminFilter === "impaye") return !isPaid;
    return true;
  });

  const totalSousAdmins = sousAdmins?.length ?? 0;
  const paidSousAdmins = (sousAdmins ?? []).filter((sa) => {
    const c = current(sa.souscriptions);
    return !!(c && c.statutPaiement);
  }).length;
  const unpaidSousAdmins = totalSousAdmins - paidSousAdmins;

  const filteredSousAdmins = (sousAdmins ?? []).filter((sa) => {
    const c = current(sa.souscriptions);
    const isPaid = !!(c && c.statutPaiement);
    if (sousAdminFilter === "paye") return isPaid;
    if (sousAdminFilter === "impaye") return !isPaid;
    return true;
  });

  const tabs: TabItem<"admins" | "sous_admins" | "formules">[] = [
    { id: "admins", label: "Abonnements Admins", icon: ShieldCheck, count: admins?.length },
    { id: "sous_admins", label: "Abonnements Sous-Admins", icon: UsersRound, count: sousAdmins?.length },
    { id: "formules", label: "Formules", icon: CircleDollarSign, count: formules?.length },
  ];

  function handleExportCsv() {
    if (tab === "admins") {
      const rows = (filteredAdmins ?? []).map((a) => {
        const c = current(a.souscriptions);
        return {
          "Nom & Prénom": fullName(a),
          Email: a.email,
          Téléphone: a.telephone,
          Résidence: a.residence?.nom || "Non assignée",
          "Formule Active": c?.abonnement?.nom || "Aucune",
          "Date Début": c?.debut ? formatDate(c.debut) : "-",
          "Date Fin": c?.fin ? formatDate(c.fin) : "-",
          "Statut Paiement": c ? (c.statutPaiement ? "Payé (Validé)" : "En attente") : "-",
          "Mode de Paiement": c?.modePaiement || "Virement",
        };
      });
      downloadCsv(rows, `abonnements-administrateurs-${startDate}_${endDate}.csv`);
      notify("Export CSV des abonnements administrateurs généré.");
    } else if (tab === "sous_admins") {
      const rows = (filteredSousAdmins ?? []).map((sa) => {
        const c = current(sa.souscriptions);
        return {
          "Nom & Prénom": fullName(sa),
          Email: sa.email,
          Téléphone: sa.telephone,
          Résidence: sa.residence?.nom || "-",
          Bâtiment: sa.batiment?.nom || "-",
          "Formule Active": c?.abonnement?.nom || "Aucune",
          "Date Début": c?.debut ? formatDate(c.debut) : "-",
          "Date Fin": c?.fin ? formatDate(c.fin) : "-",
          "Statut Paiement": c ? (c.statutPaiement ? "Payé (Validé)" : "En attente") : "-",
        };
      });
      downloadCsv(rows, `abonnements-sous-admins-${startDate}_${endDate}.csv`);
      notify("Export CSV des abonnements sous-administrateurs généré.");
    } else {
      const rows = (formules ?? []).map((f) => ({
        Formule: f.nom,
        Cible: f.cible === "sub_admin" ? "Sous-Admin" : "Admin Résidence",
        "Durée (mois)": f.duree,
        "Prix (DZD)": f.prix,
        "Nombre Souscriptions": f.souscriptions,
        "Date Création": formatDate(f.createdAt),
      }));
      downloadCsv(rows, `formules-abonnements.csv`);
      notify("Export CSV des formules généré.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        title="Gestion Abonnements (Plateforme)"
        subtitle="Contrôlez les abonnements et paiements des Administrateurs et Sous-Administrateurs de l'ensemble des résidences."
        actions={
          <button type="button" onClick={() => setModal({ kind: "formule" })} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle formule
          </button>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {(!formules || !admins || !sousAdmins) && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : (
        <>
          <ExportPeriodToolbar
            startDate={startDate}
            endDate={endDate}
            onPeriodChange={(s, e) => {
              setStartDate(s);
              setEndDate(e);
            }}
            onExportCsv={handleExportCsv}
            onPrint={() => window.print()}
            title="Période souscriptions"
          />

          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          {tab === "admins" && (
            <DataTable
              columns={adminColumns}
              rows={filteredAdmins}
              rowKey={(a) => a.id}
              toolbar={
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FacetFilter
                    value={adminFilter}
                    onChange={setAdminFilter}
                    options={[
                      { id: "all", label: "Tous les admins", count: totalAdmins },
                      { id: "paye", label: "Accès Actif (Payé)", count: paidAdmins },
                      { id: "impaye", label: "Accès Bloqué (Impayé)", count: unpaidAdmins },
                    ]}
                  />
                  <span className="text-xs font-semibold text-stone-500">
                    {filteredAdmins.length} administrateur{filteredAdmins.length > 1 ? "s" : ""}
                  </span>
                </div>
              }
              empty="Aucun administrateur ne correspond aux critères sélectionnés."
            />
          )}

          {tab === "sous_admins" && (
            <DataTable
              columns={sousAdminColumns}
              rows={filteredSousAdmins}
              rowKey={(sa) => sa.id}
              toolbar={
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <FacetFilter
                    value={sousAdminFilter}
                    onChange={setSousAdminFilter}
                    options={[
                      { id: "all", label: "Tous les sous-admins", count: totalSousAdmins },
                      { id: "paye", label: "Accès Actif (Payé)", count: paidSousAdmins },
                      { id: "impaye", label: "Accès Bloqué (Impayé)", count: unpaidSousAdmins },
                    ]}
                  />
                  <span className="text-xs font-semibold text-stone-500">
                    {filteredSousAdmins.length} sous-administrateur{filteredSousAdmins.length > 1 ? "s" : ""}
                  </span>
                </div>
              }
              empty="Aucun sous-administrateur ne correspond aux critères sélectionnés."
            />
          )}

          {tab === "formules" && (
            <div className="space-y-6">
              <DataTable
                columns={formuleColumns}
                rows={formules ?? []}
                rowKey={(f) => f.id}
                empty="Aucune formule enregistrée. Créez la première pour commencer à abonner des admins ou sous-admins."
              />
            </div>
          )}
        </>
      )}

      {modal?.kind === "formule" && <FormuleModal onClose={closeModal} onCreated={(nom) => onCreated(`Formule « ${nom} » créée.`)} />}
      {modal?.kind === "edit_formule" && (
        <EditFormuleModal
          formule={modal.formule}
          onClose={closeModal}
          onUpdated={(nom) => {
            closeModal();
            refresh();
            notify(`Formule « ${nom} » mise à jour.`);
          }}
        />
      )}
      {modal?.kind === "attribuer" && formules && (
        <AttribuerModal
          target={modal.target}
          formules={formules}
          onClose={closeModal}
          onCreateFormule={() => setModal({ kind: "formule" })}
          onCreated={() => onCreated("Abonnement attribué.")}
        />
      )}
      {modal?.kind === "historique" && (
        <HistoriqueModal
          target={modal.target}
          busyId={busyId}
          onToggle={togglePaiement}
          onClose={closeModal}
          onDeleteSouscription={(s) =>
            setConfirmDelete({
              kind: "souscription",
              id: s.id,
              nom: s.abonnement?.nom ? `l'abonnement « ${s.abonnement.nom} »` : "cet abonnement",
            })
          }
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          open={Boolean(confirmDelete)}
          title={confirmDelete.kind === "formule" ? "Supprimer la formule ?" : "Supprimer la souscription ?"}
          message={
            confirmDelete.kind === "formule"
              ? `La formule « ${confirmDelete.nom} » sera supprimée ainsi que toutes les souscriptions qui y sont associées.`
              : `Voulez-vous supprimer ${confirmDelete.nom} ? Cette action est irréversible.`
          }
          confirmLabel="Supprimer définitivement"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            try {
              if (confirmDelete.kind === "formule") {
                await deleteFormule(confirmDelete.id);
                notify(`Formule « ${confirmDelete.nom} » supprimée.`);
              } else {
                await deleteSouscription(confirmDelete.id);
                notify("Souscription supprimée.");
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

function PaiementToggle({ s, busy, onToggle }: { s: Souscription; busy: boolean; onToggle: (s: Souscription) => void }) {
  const paye = s.statutPaiement;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onToggle(s)}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
        paye ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paye ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden />
      {busy ? "Mise à jour..." : paye ? "Payé" : "En attente"}
    </button>
  );
}

function FormuleModal({ onClose, onCreated }: { onClose: () => void; onCreated: (nom: string) => void }) {
  const { submitting, error, run } = useSubmit();
  const [cible, setCible] = useState<"admin" | "sub_admin">("admin");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = formText(form, "nom");
    void run(async () => {
      await createFormule({
        nom,
        prix: Number(form.get("prix")),
        duree: Number(form.get("duree")),
        cible,
      });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouvelle formule d'abonnement" description="Durée standard : 12 mois (1 an) avec options de paiement flexibles." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la formule" name="nom" required minLength={2} maxLength={60} placeholder="Standard Annuel Résidence" autoFocus />
        <SelectField label="Cible de la formule" value={cible} onChange={(e) => setCible(e.target.value as "admin" | "sub_admin")}>
          <option value="admin">Administrateur (Résidence entière)</option>
          <option value="sub_admin">Sous-Administrateur (Bâtiment)</option>
        </SelectField>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prix (DZD)" name="prix" type="number" required min={0} max={100000000} step={0.01} placeholder="36000" />
          <Field label="Durée standard (mois)" name="duree" type="number" required min={1} max={120} step={1} defaultValue={12} placeholder="12" />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer la formule" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function AttribuerModal({
  target,
  formules,
  onClose,
  onCreateFormule,
  onCreated,
}: {
  target: { id: string; nom: string; detail?: string };
  formules: Formule[];
  onClose: () => void;
  onCreateFormule: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [formuleId, setFormuleId] = useState(formules[0]?.id ?? "");
  const [debut, setDebut] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [paye, setPaye] = useState(true);
  const [modePaiement, setModePaiement] = useState("Virement bancaire");
  const [montantPaye, setMontantPaye] = useState<string>(() => String(formules[0]?.prix ?? 0));
  const [notesPaiement, setNotesPaiement] = useState("");
  const formule = formules.find((f) => f.id === formuleId);

  useEffect(() => {
    if (formule) {
      setMontantPaye(String(formule.prix));
    }
  }, [formuleId]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await createSouscription({
        idAdmin: target.id,
        idAbonnement: formuleId,
        debut,
        statutPaiement: paye,
        modePaiement,
        montantPaye: Number(montantPaye) || (formule ? formule.prix : 0),
        notesPaiement,
      });
      onCreated();
    });
  }

  return (
    <Modal title="Attribuer un abonnement" description={`À ${target.nom}${target.detail ? ` (${target.detail})` : ""}.`} onClose={onClose}>
      {formules.length === 0 ? (
        <div className="space-y-4 text-sm text-stone-600">
          <p>Aucune formule n&apos;existe encore. Créez-en une avant d&apos;attribuer un abonnement.</p>
          <div className="flex justify-end">
            <button type="button" onClick={onCreateFormule} className={button("primary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Nouvelle formule
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <SelectField label="Formule" value={formuleId} onChange={(e) => setFormuleId(e.target.value)} required>
            {formules.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom} — {formatDZD(f.prix)} / {dureeLabel(f.duree)} ({f.cible === "sub_admin" ? "Sous-Admin" : "Admin"})
              </option>
            ))}
          </SelectField>
          <Field label="Date de début" type="date" required min="2000-01-01" max="2099-12-31" value={debut} onChange={(e) => setDebut(e.target.value)} />
          {formule && debut && (
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-2.5 text-sm">
              <span className="text-stone-500">Date de fin (calculée)</span>
              <span className="font-semibold text-ink">{addMonths(debut, formule.duree).toLocaleDateString("fr-FR", { timeZone: "UTC" })}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Mode de règlement (flexible)" value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
              <option value="Virement bancaire">Virement bancaire</option>
              <option value="Espèces">Espèces (Reçu direct)</option>
              <option value="Chèque">Chèque bancaire</option>
              <option value="Paiement échelonné">Paiement échelonné</option>
              <option value="Edahabia / CIB">Edahabia / CIB</option>
            </SelectField>
            <Field
              label="Montant réglé (DZD)"
              type="number"
              value={montantPaye}
              onChange={(e) => setMontantPaye(e.target.value)}
              min={0}
              placeholder="Montant payé"
            />
          </div>

          <Field
            label="Notes ou référence du règlement (optionnel)"
            placeholder="Ex: Réf virement BNA, chèque n°12948, accord 50% avance..."
            value={notesPaiement}
            onChange={(e) => setNotesPaiement(e.target.value)}
          />

          <label className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-ink cursor-pointer">
            <input type="checkbox" checked={paye} onChange={(e) => setPaye(e.target.checked)} className="h-4 w-4 accent-brand" />
            <div>
              <span className="block font-semibold">Paiement validé (Accès immédiat au dashboard)</span>
              <span className="block text-xs text-stone-500">Si décoché, le compte reste bloqué jusqu'à confirmation du règlement.</span>
            </div>
          </label>
          <FormError error={error} />
          <ModalActions submitting={submitting} label="Attribuer l'abonnement" onCancel={onClose} />
        </form>
      )}
    </Modal>
  );
}

function HistoriqueModal({
  target,
  busyId,
  onToggle,
  onClose,
  onDeleteSouscription,
}: {
  target: { id: string; nom: string; email: string; souscriptions: Souscription[] };
  busyId: string | null;
  onToggle: (s: Souscription) => void;
  onClose: () => void;
  onDeleteSouscription: (s: Souscription) => void;
}) {
  return (
    <Modal title="Historique des abonnements" description={`${target.nom} · ${target.email}`} onClose={onClose}>
      {target.souscriptions.length === 0 ? (
        <p className="text-sm text-stone-500">Aucun abonnement enregistré pour ce compte.</p>
      ) : (
        <ul className="space-y-3">
          {target.souscriptions.map((s) => (
            <li key={s.id} className="rounded-xl border border-stone-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">{s.abonnement?.nom ?? "Formule"}</p>
                <Pill tone={ETAT_TONE[etat(s)]}>{etat(s)}</Pill>
              </div>
              <p className="mt-1 text-xs text-stone-500">
                {formatDate(s.debut)} → {formatDate(s.fin)}
                {s.abonnement && ` · ${formatDZD(s.abonnement.prix)}`}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                <PaiementToggle s={s} busy={busyId === s.id} onToggle={onToggle} />
                <button
                  type="button"
                  onClick={() => onDeleteSouscription(s)}
                  title="Supprimer cette souscription"
                  aria-label="Supprimer cette souscription"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50/70 text-red-600 shadow-xs transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

function EditFormuleModal({
  formule,
  onClose,
  onUpdated,
}: {
  formule: Formule;
  onClose: () => void;
  onUpdated: (nom: string) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [nom, setNom] = useState(formule.nom);
  const [prix, setPrix] = useState(formule.prix);
  const [duree, setDuree] = useState(formule.duree);
  const [cible, setCible] = useState<"admin" | "sub_admin">(formule.cible ?? "admin");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await updateFormule(formule.id, { nom, prix: Number(prix), duree: Number(duree), cible });
      onUpdated(nom);
    });
  }

  return (
    <Modal title="Modifier la formule" description="Le prix est en dinars algériens et la durée en mois." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la formule" value={nom} onChange={(e) => setNom(e.target.value)} required minLength={2} maxLength={60} autoFocus />
        <SelectField label="Cible de la formule" value={cible} onChange={(e) => setCible(e.target.value as "admin" | "sub_admin")}>
          <option value="admin">Administrateur (Résidence entière)</option>
          <option value="sub_admin">Sous-Administrateur (Bâtiment)</option>
        </SelectField>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prix (DZD)" type="number" value={prix} onChange={(e) => setPrix(Number(e.target.value))} required min={0} max={100000000} step={0.01} />
          <Field label="Durée (mois)" type="number" value={duree} onChange={(e) => setDuree(Number(e.target.value))} required min={1} max={120} step={1} />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Enregistrer les modifications" onCancel={onClose} />
      </form>
    </Modal>
  );
}
