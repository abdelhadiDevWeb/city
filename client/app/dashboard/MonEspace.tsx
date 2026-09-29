"use client";

import { BadgeCheck, Building, Building2, KeyRound, Layers, MapPin, ShieldCheck, UserRound, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getMonEspace, type BatimentDetail, type MonEspace as Espace, type Responsable } from "@/lib/residences-api";
import { ROLE_BADGE, ROLE_LABELS, displayName, primaryRole } from "@/lib/roles";
import { useSession } from "./session";
import { AccountStatusPill, DataTable, FormError, Pill, card, describeError, type Column } from "./ui";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");
// Subscription dates are UTC midnights; shown in UTC to avoid a one-day shift.
const formatUtcDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" });
const fullName = (p: { prenom: string; nom: string }) => `${p.prenom} ${p.nom}`;

export function MonEspace() {
  const { account } = useSession();
  const role = primaryRole(account);
  const [espace, setEspace] = useState<Espace | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMonEspace()
      .then((e) => {
        if (active) setEspace(e);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className={`${card} p-6 sm:p-8`}>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Tableau de bord</h1>
        <p className="mt-1.5 text-sm text-stone-500">
          {role === "admin" ? "La résidence dont vous êtes responsable, avec tous ses bâtiments." : "Le bâtiment dont vous êtes responsable et sa résidence."}
        </p>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-stone-600">
          Bonjour, <span className="font-semibold text-ink">{displayName(account)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
        </p>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      {!espace && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : espace && !espace.residence ? (
        <section className={`${card} p-10 text-center text-sm text-stone-500`}>
          Aucune résidence ne vous est encore attribuée. Contactez le Super Admin.
        </section>
      ) : espace?.residence ? (
        <EspaceView espace={espace} residence={espace.residence} />
      ) : null}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3">
      <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-stone-500">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
    </div>
  );
}

function PersonCard({ title, person, empty }: { title: string; person: Responsable | null; empty: string }) {
  return (
    <section className={`${card} p-5`}>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
        <ShieldCheck className="h-4 w-4 text-brand" aria-hidden />
        {title}
      </h3>
      {person ? (
        <div className="flex flex-wrap items-center gap-3">
          <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-brand">
            {person.prenom[0]}
            {person.nom[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-ink">{fullName(person)}</p>
            <p className="truncate text-xs text-stone-500">
              {person.email} · <span className="font-mono">{person.telephone}</span>
            </p>
          </div>
          <AccountStatusPill actif={person.actif} />
        </div>
      ) : (
        <p className="text-sm text-stone-500">{empty}</p>
      )}
    </section>
  );
}

function EspaceView({ espace, residence }: { espace: Espace; residence: NonNullable<Espace["residence"]> }) {
  const { batiments, admin, abonnement, role } = espace;
  const etages = batiments.reduce((sum, b) => sum + b.etages, 0);
  const appartements = batiments.flatMap((b) => b.appartements);
  const occupes = appartements.filter((a) => a.proprietaire).length;
  const monBatiment = role === "sub_admin" ? batiments[0] : undefined;

  return (
    <>
      <section className={`${card} p-6`}>
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-brand">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">{role === "admin" ? "Ma résidence" : "Résidence"}</p>
            <h2 className="text-xl font-bold tracking-tight text-ink">{residence.nom}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {residence.localisation}
            </p>
          </div>
          <span className="text-xs text-stone-400">Créée le {formatDate(residence.createdAt)}</span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {monBatiment ? (
            <>
              <Stat icon={Building} label="Mon bâtiment" value={monBatiment.nom} />
              <Stat icon={Layers} label="Étages" value={monBatiment.etages} />
            </>
          ) : (
            <>
              <Stat icon={Building} label="Bâtiments" value={batiments.length} />
              <Stat icon={Layers} label="Étages" value={etages} />
            </>
          )}
          <Stat icon={KeyRound} label="Appartements" value={appartements.length} />
          <Stat icon={UserRound} label="Avec propriétaire" value={`${occupes} / ${appartements.length}`} />
        </dl>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <PersonCard title="Admin responsable de la résidence" person={admin} empty="Aucun admin n'est encore responsable de cette résidence." />
        <section className={`${card} p-5`}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <BadgeCheck className="h-4 w-4 text-brand" aria-hidden />
            Abonnement de la résidence
          </h3>
          {abonnement ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{abonnement.nom ?? "Formule"}</p>
                <p className="text-xs text-stone-500">
                  Du {formatUtcDate(abonnement.debut)} au {formatUtcDate(abonnement.fin)}
                </p>
              </div>
              <Pill tone="success">Payé · en cours</Pill>
            </div>
          ) : (
            <p className="text-sm text-stone-500">Aucun abonnement payé en cours.</p>
          )}
        </section>
      </div>

      {monBatiment ? <MonBatiment batiment={monBatiment} /> : <BatimentsTable batiments={batiments} />}
    </>
  );
}

function BatimentsTable({ batiments }: { batiments: BatimentDetail[] }) {
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
            <span className="text-xs text-stone-500">
              {b.sousAdmin.email} · <span className="font-mono">{b.sousAdmin.telephone}</span>
            </span>
          </span>
        ) : (
          <Pill tone="warning">Aucun sub admin</Pill>
        ),
    },
  ];

  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
        <Building className="h-4 w-4 text-brand" aria-hidden />
        Bâtiments de la résidence ({batiments.length})
      </h3>
      <DataTable columns={columns} rows={batiments} rowKey={(b) => b.id} empty="Aucun bâtiment dans cette résidence pour le moment." />
    </section>
  );
}

function MonBatiment({ batiment }: { batiment: BatimentDetail }) {
  return (
    <section className={`${card} p-5`}>
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
        <Building className="h-4 w-4 text-brand" aria-hidden />
        Bâtiment {batiment.nom} · appartements ({batiment.appartements.length})
      </h3>
      {batiment.appartements.length === 0 ? (
        <p className="text-sm text-stone-500">Aucun appartement enregistré dans ce bâtiment pour le moment.</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {batiment.appartements.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <span>
                <span className="block font-semibold text-ink">Appartement {a.nom}</span>
                <span className="block text-xs text-stone-500">{etageLabel(a.etage)}</span>
              </span>
              {a.proprietaire ? (
                <span className="text-right">
                  <span className="block text-ink">{fullName(a.proprietaire)}</span>
                  <span className="block text-xs text-stone-500">{a.proprietaire.email}</span>
                </span>
              ) : (
                <Pill>Sans propriétaire</Pill>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
