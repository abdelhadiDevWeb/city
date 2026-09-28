"use client";

import { ROLE_LABELS, displayName, primaryRole } from "@/lib/roles";
import { useSession } from "./session";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default function DashboardPage() {
  const { account } = useSession();
  const role = primaryRole(account);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-brand">{ROLE_LABELS[role]}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">Welcome, {displayName(account)}</h1>
        <p className="mt-2 text-sm text-stone-500">Here is an overview of your account.</p>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-base font-semibold text-ink">Profile</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {account.type === "SuperAdmin" ? (
            <>
              <Field label="Full name" value={account.nomComplet} />
              <Field label="Email" value={account.email} />
              <Field label="Role" value={ROLE_LABELS[role]} />
            </>
          ) : (
            <>
              <Field label="Prénom" value={account.prenom} />
              <Field label="Nom" value={account.nom} />
              <Field label="Email" value={account.email} />
              <Field label="Téléphone" value={account.telephone} />
              <Field label="Role" value={ROLE_LABELS[role]} />
              <Field label="Wilaya" value={account.wilaya} />
              <Field label="Daïra" value={account.daira} />
              <Field label="Baladia" value={account.baladia} />
            </>
          )}
          <Field label="Member since" value={new Date(account.createdAt).toLocaleDateString()} />
        </dl>
      </section>
    </div>
  );
}
