"use client";

import { BadgeCheck, CalendarRange, CircleDollarSign, CreditCard, Plus, Receipt, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { formatDZD } from "@/lib/demo-data";
import {
  createFormule,
  createSouscription,
  listAdminsAbonnes,
  listFormules,
  setStatutPaiement,
  type AdminAbonne,
  type Formule,
  type Souscription,
} from "@/lib/platform-api";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import { AccountStatusPill, DataTable, Field, FormError, Modal, PageHeader, Pill, Tabs, button, card, describeError, useToast, type Column, type Tone } from "../ui";

type Etat = "Actif" | "À venir" | "Expiré";
type ModalState = { kind: "formule" } | { kind: "attribuer"; adminId: string } | { kind: "historique"; adminId: string } | null;

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
function current(admin: AdminAbonne): Souscription | null {
  const list = admin.souscriptions;
  return list.find((s) => etat(s) === "Actif") ?? list.findLast((s) => etat(s) === "À venir") ?? list[0] ?? null;
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
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<"admins" | "formules">("admins");
  const [modal, setModal] = useState<ModalState>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => setVersion((v) => v + 1);
  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    let active = true;
    Promise.all([listFormules(), listAdminsAbonnes()])
      .then(([f, a]) => {
        if (!active) return;
        setFormules(f);
        setAdmins(a);
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

  const modalAdmin = modal && modal.kind !== "formule" ? admins?.find((a) => a.id === modal.adminId) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CreditCard}
        title="Gestion Abonnements"
        subtitle="Un Admin (et les Sub Admins de sa résidence) ne peut se connecter que s'il a un abonnement payé en cours."
        actions={
          <button type="button" onClick={() => setModal({ kind: "formule" })} className={button("primary")}>
            <Plus className="h-4 w-4" aria-hidden />
            Nouvelle formule
          </button>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {(!formules || !admins) && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : formules && admins ? (
        <>
          <Summary formules={formules} admins={admins} />
          <Tabs
            tabs={[
              { id: "admins", label: "Abonnements des Admins", icon: ShieldCheck, count: admins.length },
              { id: "formules", label: "Formules", icon: CreditCard, count: formules.length },
            ]}
            active={tab}
            onChange={setTab}
          />
          {tab === "admins" ? (
            <AdminsTable
              admins={admins}
              busyId={busyId}
              onToggle={togglePaiement}
              onAssign={(a) => setModal({ kind: "attribuer", adminId: a.id })}
              onHistory={(a) => setModal({ kind: "historique", adminId: a.id })}
            />
          ) : (
            <FormulesGrid formules={formules} onCreate={() => setModal({ kind: "formule" })} />
          )}
        </>
      ) : null}

      {modal?.kind === "formule" && <FormuleModal onClose={closeModal} onCreated={(nom) => onCreated(`Formule « ${nom} » créée.`)} />}
      {modal?.kind === "attribuer" && modalAdmin && formules && (
        <AttribuerModal
          admin={modalAdmin}
          formules={formules}
          onClose={closeModal}
          onCreateFormule={() => setModal({ kind: "formule" })}
          onCreated={() => onCreated(`Abonnement attribué à ${fullName(modalAdmin)}.`)}
        />
      )}
      {modal?.kind === "historique" && modalAdmin && (
        <HistoriqueModal admin={modalAdmin} busyId={busyId} onToggle={togglePaiement} onClose={closeModal} />
      )}
    </div>
  );
}

function Summary({ formules, admins }: { formules: Formule[]; admins: AdminAbonne[] }) {
  const all = admins.flatMap((a) => a.souscriptions);
  const actifs = admins.filter((a) => a.souscriptions.some((s) => etat(s) === "Actif")).length;
  const impayes = all.filter((s) => !s.statutPaiement);
  const sum = (list: Souscription[]) => list.reduce((total, s) => total + (s.abonnement?.prix ?? 0), 0);

  const items = [
    { label: "Formules", value: formules.length, icon: CreditCard },
    { label: "Admins avec abonnement actif", value: `${actifs} / ${admins.length}`, icon: BadgeCheck },
    { label: "Montant encaissé", value: formatDZD(sum(all.filter((s) => s.statutPaiement))), icon: CircleDollarSign },
    { label: `Non payés (${impayes.length})`, value: formatDZD(sum(impayes)), icon: Receipt },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{label}</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}

function PaiementToggle({ s, busy, onToggle }: { s: Souscription; busy: boolean; onToggle: (s: Souscription) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Pill tone={s.statutPaiement ? "success" : "danger"}>{s.statutPaiement ? "Payé" : "Non payé"}</Pill>
      <button type="button" disabled={busy} onClick={() => onToggle(s)} className={button("secondary", "sm")}>
        {s.statutPaiement ? "Marquer non payé" : "Marquer payé"}
      </button>
    </div>
  );
}

function AdminsTable({
  admins,
  busyId,
  onToggle,
  onAssign,
  onHistory,
}: {
  admins: AdminAbonne[];
  busyId: string | null;
  onToggle: (s: Souscription) => void;
  onAssign: (a: AdminAbonne) => void;
  onHistory: (a: AdminAbonne) => void;
}) {
  const columns: Column<AdminAbonne>[] = [
    {
      header: "Admin",
      cell: (a) => (
        <span className="flex flex-col items-start gap-1">
          <span className="font-semibold text-ink">{fullName(a)}</span>
          <span className="text-xs text-stone-500">{a.email}</span>
          <AccountStatusPill actif={a.actif} />
        </span>
      ),
    },
    { header: "Résidence", cell: (a) => (a.residence ? a.residence.nom : <Pill tone="warning">Non assignée</Pill>) },
    {
      header: "Abonnement",
      cell: (a) => {
        const s = current(a);
        if (!s) return <span className="text-stone-400">Aucun</span>;
        return (
          <span>
            <span className="block font-semibold text-ink">{s.abonnement?.nom ?? "Formule supprimée"}</span>
            {s.abonnement && <span className="block text-xs text-stone-500">{formatDZD(s.abonnement.prix)} · {dureeLabel(s.abonnement.duree)}</span>}
          </span>
        );
      },
    },
    {
      header: "Période",
      cell: (a) => {
        const s = current(a);
        if (!s) return <span className="text-stone-400">—</span>;
        return (
          <span className="flex flex-col items-start gap-1">
            <span className="whitespace-nowrap text-xs">
              {formatDate(s.debut)} → {formatDate(s.fin)}
            </span>
            <Pill tone={ETAT_TONE[etat(s)]}>{etat(s)}</Pill>
          </span>
        );
      },
    },
    {
      header: "Paiement",
      cell: (a) => {
        const s = current(a);
        return s ? <PaiementToggle s={s} busy={busyId === s.id} onToggle={onToggle} /> : <span className="text-stone-400">—</span>;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (a) => (
        <div className="flex justify-end gap-2">
          {a.souscriptions.length > 0 && (
            <button type="button" onClick={() => onHistory(a)} className={button("secondary", "sm")}>
              <CalendarRange className="h-3.5 w-3.5" aria-hidden />
              Historique ({a.souscriptions.length})
            </button>
          )}
          <button type="button" onClick={() => onAssign(a)} className={button("primary", "sm")}>
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Attribuer
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={admins}
      rowKey={(a) => a.id}
      empty="Aucun compte Admin. Créez d'abord un Admin depuis la page « Ajouter Résidence »."
    />
  );
}

function FormulesGrid({ formules, onCreate }: { formules: Formule[]; onCreate: () => void }) {
  if (formules.length === 0) {
    return (
      <section className={`${card} flex flex-col items-center p-12 text-center`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
          <CreditCard className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink">Aucune formule pour le moment</h2>
        <p className="mt-1 max-w-sm text-sm text-stone-500">Créez une formule (nom, prix, durée) pour pouvoir l&apos;attribuer aux Admins.</p>
        <button type="button" onClick={onCreate} className={`${button("primary")} mt-6`}>
          <Plus className="h-4 w-4" aria-hidden />
          Créer la première formule
        </button>
      </section>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {formules.map((f) => (
        <article key={f.id} className={`${card} p-5`}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-ink">{f.nom}</h3>
            <Pill tone="dark">{dureeLabel(f.duree)}</Pill>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-brand">{formatDZD(f.prix)}</p>
          <p className="mt-1 text-xs text-stone-500">
            {f.souscriptions} abonnement{f.souscriptions > 1 ? "s" : ""} · créée le {new Date(f.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </article>
      ))}
    </div>
  );
}

function FormuleModal({ onClose, onCreated }: { onClose: () => void; onCreated: (nom: string) => void }) {
  const { submitting, error, run } = useSubmit();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nom = formText(form, "nom");
    void run(async () => {
      await createFormule({ nom, prix: Number(form.get("prix")), duree: Number(form.get("duree")) });
      onCreated(nom);
    });
  }

  return (
    <Modal title="Nouvelle formule d'abonnement" description="Le prix est en dinars algériens et la durée en mois." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nom de la formule" name="nom" required minLength={2} maxLength={60} placeholder="Premium" autoFocus />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prix (DZD)" name="prix" type="number" required min={0} max={100000000} step={0.01} placeholder="25000" />
          <Field label="Durée (mois)" name="duree" type="number" required min={1} max={120} step={1} placeholder="12" />
        </div>
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer la formule" onCancel={onClose} />
      </form>
    </Modal>
  );
}

function AttribuerModal({
  admin,
  formules,
  onClose,
  onCreateFormule,
  onCreated,
}: {
  admin: AdminAbonne;
  formules: Formule[];
  onClose: () => void;
  onCreateFormule: () => void;
  onCreated: () => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [formuleId, setFormuleId] = useState(formules[0]?.id ?? "");
  const [debut, setDebut] = useState(() => new Date().toLocaleDateString("en-CA"));
  const [paye, setPaye] = useState(false);
  const formule = formules.find((f) => f.id === formuleId);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      await createSouscription({ idAdmin: admin.id, idAbonnement: formuleId, debut, statutPaiement: paye });
      onCreated();
    });
  }

  return (
    <Modal title="Attribuer un abonnement" description={`À ${fullName(admin)}${admin.residence ? `, responsable de « ${admin.residence.nom} »` : ""}.`} onClose={onClose}>
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
                {f.nom} — {formatDZD(f.prix)} / {dureeLabel(f.duree)}
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
          <label className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-ink">
            <input type="checkbox" checked={paye} onChange={(e) => setPaye(e.target.checked)} className="h-4 w-4 accent-[#f97316]" />
            Paiement déjà reçu
          </label>
          <FormError error={error} />
          <ModalActions submitting={submitting} label="Attribuer" onCancel={onClose} />
        </form>
      )}
    </Modal>
  );
}

function HistoriqueModal({
  admin,
  busyId,
  onToggle,
  onClose,
}: {
  admin: AdminAbonne;
  busyId: string | null;
  onToggle: (s: Souscription) => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Historique des abonnements" description={`${fullName(admin)} · ${admin.email}`} onClose={onClose}>
      <ul className="space-y-3">
        {admin.souscriptions.map((s) => (
          <li key={s.id} className="rounded-xl border border-stone-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">{s.abonnement?.nom ?? "Formule supprimée"}</p>
              <Pill tone={ETAT_TONE[etat(s)]}>{etat(s)}</Pill>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {formatDate(s.debut)} → {formatDate(s.fin)}
              {s.abonnement && ` · ${formatDZD(s.abonnement.prix)}`}
            </p>
            <div className="mt-3">
              <PaiementToggle s={s} busy={busyId === s.id} onToggle={onToggle} />
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
