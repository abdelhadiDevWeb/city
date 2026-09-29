"use client";

import { ShieldPlus, User } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createSuperAdmin, listSuperAdmins, type SuperAdminAccount } from "@/lib/platform-api";
import { ROLE_BADGE, ROLE_LABELS, displayName, initials, primaryRole } from "@/lib/roles";
import { ModalActions, PasswordField, formText, useSubmit } from "../forms";
import { useSession } from "../session";
import { DataTable, Field as InputField, FormError, Modal, PageHeader, Pill, button, card, describeError, useToast, type Column } from "../ui";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { account } = useSession();
  const role = primaryRole(account);

  return (
    <div className="space-y-6">
      <PageHeader icon={User} title="Mon profil" subtitle="Informations de votre compte et rôle sur la plateforme." />

      <section className={`${card} p-6 sm:p-8`}>
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-bold text-brand">
            {initials(account)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-ink">{displayName(account)}</p>
            <p className="truncate text-sm text-stone-500">{account.email}</p>
          </div>
          <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {account.type === "SuperAdmin" ? (
            <>
              <Field label="Nom complet" value={account.nomComplet} />
              <Field label="Email" value={account.email} />
              <Field label="Rôle" value={ROLE_LABELS[role]} />
            </>
          ) : (
            <>
              <Field label="Prénom" value={account.prenom} />
              <Field label="Nom" value={account.nom} />
              <Field label="Email" value={account.email} />
              <Field label="Téléphone" value={account.telephone} />
              <Field label="Rôle" value={ROLE_LABELS[role]} />
              <Field label="Wilaya" value={account.wilaya} />
              <Field label="Daïra" value={account.daira} />
              <Field label="Baladia" value={account.baladia} />
            </>
          )}
          <Field label="Membre depuis" value={new Date(account.createdAt).toLocaleDateString("fr-FR")} />
        </dl>
      </section>

      {role === "super_admin" && <SuperAdminsSection currentId={account.id} />}
    </div>
  );
}

function SuperAdminsSection({ currentId }: { currentId: string }) {
  const notify = useToast();
  const [superAdmins, setSuperAdmins] = useState<SuperAdminAccount[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [creating, setCreating] = useState(false);
  const closeModal = useCallback(() => setCreating(false), []);

  useEffect(() => {
    let active = true;
    listSuperAdmins()
      .then((list) => {
        if (!active) return;
        setSuperAdmins(list);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  const columns: Column<SuperAdminAccount>[] = [
    {
      header: "Nom complet",
      cell: (s) => (
        <span className="flex items-center gap-2 font-semibold text-ink">
          {s.nomComplet}
          {s.id === currentId && <Pill tone="brand">Vous</Pill>}
        </span>
      ),
    },
    { header: "Email", cell: (s) => s.email },
    { header: "Créé le", cell: (s) => <span className="text-stone-500">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</span> },
  ];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
            <ShieldPlus className="h-4 w-4 text-brand" aria-hidden />
            Super Admins{superAdmins ? ` (${superAdmins.length})` : ""}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500">Les Super Admins ont un accès complet à la plateforme.</p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className={button("primary", "sm")}>
          <ShieldPlus className="h-3.5 w-3.5" aria-hidden />
          Nouveau Super Admin
        </button>
      </div>

      {error ? (
        <FormError error={{ message: error, details: [] }} />
      ) : superAdmins ? (
        <DataTable columns={columns} rows={superAdmins} rowKey={(s) => s.id} />
      ) : (
        <div className={`${card} flex items-center justify-center p-10`}>
          <span aria-label="Chargement" className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      )}

      {creating && (
        <SuperAdminModal
          onClose={closeModal}
          onCreated={(email) => {
            setCreating(false);
            setVersion((v) => v + 1);
            notify(`Compte Super Admin créé pour ${email}.`);
          }}
        />
      )}
    </section>
  );
}

function SuperAdminModal({ onClose, onCreated }: { onClose: () => void; onCreated: (email: string) => void }) {
  const { submitting, error, run } = useSubmit();
  const [password, setPassword] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = formText(form, "email").toLowerCase();
    void run(async () => {
      await createSuperAdmin({ nomComplet: formText(form, "nomComplet"), email, password });
      onCreated(email);
    });
  }

  return (
    <Modal title="Nouveau Super Admin" description="Ce compte aura exactement les mêmes droits que vous. Il pourra se connecter avec cet email et ce mot de passe." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField label="Nom complet" name="nomComplet" required minLength={2} maxLength={120} autoComplete="off" autoFocus />
        <InputField label="Email" name="email" type="email" required maxLength={254} autoComplete="off" />
        <PasswordField value={password} onChange={setPassword} />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer le Super Admin" onCancel={onClose} />
      </form>
    </Modal>
  );
}
