"use client";

import { Building2, Search, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createResident,
  etageLabel,
  getMonEspace,
  listResidents,
  type BatimentDetail,
  type MonEspace,
  type Resident,
} from "@/lib/residences-api";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import { useSession } from "../session";
import { Avatar, DataTable, Field, FormError, Modal, Mono, PageHeader, Pill, button, card, describeError, useToast, type Column } from "../ui";

const fullName = (p: { prenom: string; nom: string }) => `${p.prenom} ${p.nom}`;

export default function ResidentsPage() {
  const notify = useToast();
  const { account } = useSession();
  const isSubAdmin = account.type === "Admin" && account.role === "sub_admin";
  const [espace, setEspace] = useState<MonEspace | null>(null);
  const [residents, setResidents] = useState<Resident[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const closeModal = useCallback(() => setAdding(false), []);

  useEffect(() => {
    let active = true;
    Promise.all([getMonEspace(), listResidents()])
      .then(([e, r]) => {
        if (!active) return;
        setEspace(e);
        setResidents(r);
        setError(null);
      })
      .catch((err) => {
        if (active) setError(describeError(err).message);
      });
    return () => {
      active = false;
    };
  }, [version]);

  const needle = query.trim().toLowerCase();
  const rows = (residents ?? []).filter(
    (r) =>
      !needle ||
      [fullName(r), r.email, r.nin, r.telephone, r.batiment?.nom ?? "", r.appartement?.nom ?? ""].some((v) => v.toLowerCase().includes(needle)),
  );

  const columns: Column<Resident>[] = [
    {
      header: "Résident",
      cell: (r) => (
        <span className="flex items-center gap-3">
          <Avatar name={fullName(r)} />
          <span>
            <span className="block font-semibold text-ink">{fullName(r)}</span>
            <span className="block text-xs text-stone-500">{r.email}</span>
          </span>
        </span>
      ),
    },
    { header: "NIN", cell: (r) => <Mono>{r.nin}</Mono> },
    { header: "Téléphone", cell: (r) => <Mono>{r.telephone}</Mono> },
    { header: "Bâtiment", cell: (r) => (r.batiment ? <span className="font-semibold text-ink">{r.batiment.nom}</span> : "—") },
    {
      header: "Appartement",
      cell: (r) =>
        r.appartement ? (
          <span>
            <span className="block font-semibold text-ink">{r.appartement.nom}</span>
            <span className="block text-xs text-stone-500">{etageLabel(r.appartement.etage)}</span>
          </span>
        ) : (
          "—"
        ),
    },
    { header: "Statut", cell: () => <Pill tone="dark">Propriétaire</Pill> },
    { header: "Ajouté le", cell: (r) => <span className="text-stone-500">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</span> },
  ];

  const canAdd = !!espace?.residence && espace.batiments.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Résidents & Propriétaires"
        subtitle={
          espace?.residence
            ? `${isSubAdmin ? `Bâtiment ${espace.batiments[0]?.nom ?? ""} · ` : ""}${espace.residence.nom} — ajoutez les propriétaires et leur appartement.`
            : "Ajoutez les propriétaires et leur appartement."
        }
        actions={
          <button type="button" disabled={!canAdd} onClick={() => setAdding(true)} className={button("primary")}>
            <UserPlus className="h-4 w-4" aria-hidden />
            Ajouter un résident
          </button>
        }
      />

      {error && <FormError error={{ message: error, details: [] }} />}

      {residents === null && !error ? (
        <div className={`${card} flex items-center justify-center p-16`}>
          <span aria-label="Chargement" className="h-7 w-7 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
        </div>
      ) : espace && !canAdd ? (
        <section className={`${card} flex flex-col items-center p-12 text-center`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <p className="mt-4 max-w-sm text-sm text-stone-500">
            {espace.residence
              ? "Aucun bâtiment n'existe encore dans votre résidence. Le Super Admin doit d'abord créer les bâtiments."
              : "Aucune résidence ne vous est encore attribuée. Contactez le Super Admin."}
          </p>
        </section>
      ) : residents ? (
        <>
          <label className={`${card} flex items-center gap-3 px-4 py-3`}>
            <Search className="h-4 w-4 text-stone-400" aria-hidden />
            <span className="sr-only">Rechercher</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par nom, email, NIN, bâtiment ou appartement…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-stone-400 focus:outline-none"
            />
          </label>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            empty={residents.length === 0 ? "Aucun résident pour le moment. Cliquez sur « Ajouter un résident »." : "Aucun résident ne correspond à la recherche."}
          />
        </>
      ) : null}

      {adding && espace?.residence && (
        <ResidentModal
          residenceNom={espace.residence.nom}
          batiments={espace.batiments}
          onClose={closeModal}
          onCreated={(r) => {
            setAdding(false);
            setVersion((v) => v + 1);
            notify(`${fullName(r)} ajouté comme propriétaire de l'appartement ${r.appartement?.nom ?? ""}.`);
          }}
        />
      )}
    </div>
  );
}

function ResidentModal({
  residenceNom,
  batiments,
  onClose,
  onCreated,
}: {
  residenceNom: string;
  batiments: BatimentDetail[];
  onClose: () => void;
  onCreated: (r: Resident) => void;
}) {
  const { submitting, error, run } = useSubmit();
  const [batimentId, setBatimentId] = useState(batiments[0]?.id ?? "");
  const [etage, setEtage] = useState(0);
  const batiment = batiments.find((b) => b.id === batimentId);
  const freeFlats = batiment?.appartements.filter((a) => !a.proprietaire) ?? [];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () =>
      onCreated(
        await createResident({
          prenom: formText(form, "prenom"),
          nom: formText(form, "nom"),
          email: formText(form, "email").toLowerCase(),
          telephone: formText(form, "telephone"),
          nin: formText(form, "nin"),
          idBatiment: batimentId,
          etage,
          appartement: formText(form, "appartement"),
        }),
      ),
    );
  }

  return (
    <Modal title="Ajouter un résident" description="Le résident est enregistré comme propriétaire de l'appartement." onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-5">
        <fieldset className="space-y-4">
          <legend className="mb-3 text-[11px] font-bold uppercase tracking-wide text-stone-500">Logement</legend>
          <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-2.5 text-sm">
            <span className="text-stone-500">Résidence</span>
            <span className="font-semibold text-ink">{residenceNom}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Bâtiment"
              value={batimentId}
              disabled={batiments.length === 1}
              onChange={(e) => {
                setBatimentId(e.target.value);
                setEtage(0);
              }}
              required
            >
              {batiments.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nom} ({b.etages} étage{b.etages > 1 ? "s" : ""})
                </option>
              ))}
            </SelectField>
            <SelectField label="Étage" value={etage} onChange={(e) => setEtage(Number(e.target.value))} required>
              {Array.from({ length: (batiment?.etages ?? 0) + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {etageLabel(i)}
                </option>
              ))}
            </SelectField>
          </div>
          <Field
            label="Nom / numéro de l'appartement"
            name="appartement"
            required
            maxLength={20}
            placeholder="A12"
            autoComplete="off"
            list="free-flats"
            hint={
              freeFlats.length
                ? `Appartements libres dans ce bâtiment : ${freeFlats.map((a) => `${a.nom} (${etageLabel(a.etage)})`).join(", ")}. Un nom nouveau crée l'appartement.`
                : "L'appartement sera créé dans ce bâtiment à l'étage choisi."
            }
          />
          <datalist id="free-flats">
            {freeFlats
              .filter((a) => a.etage === etage)
              .map((a) => (
                <option key={a.id} value={a.nom} />
              ))}
          </datalist>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-[11px] font-bold uppercase tracking-wide text-stone-500">Informations du résident</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" name="prenom" required maxLength={60} autoComplete="off" autoFocus />
            <Field label="Nom" name="nom" required maxLength={60} autoComplete="off" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required maxLength={254} autoComplete="off" />
            <Field label="Téléphone" name="telephone" type="tel" required pattern="\+?[0-9]{8,15}" title="8 à 15 chiffres, + facultatif" placeholder="0555123456" />
          </div>
          <Field
            label="NIN (numéro d'identification nationale)"
            name="nin"
            required
            inputMode="numeric"
            pattern="[0-9]{18}"
            minLength={18}
            maxLength={18}
            title="18 chiffres"
            placeholder="18 chiffres"
            autoComplete="off"
            className="font-mono"
          />
        </fieldset>

        <FormError error={error} />
        <ModalActions submitting={submitting} label="Ajouter le résident" onCancel={onClose} />
      </form>
    </Modal>
  );
}
