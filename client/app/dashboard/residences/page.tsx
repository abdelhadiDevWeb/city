"use client";

import { Building2, ChevronRight, DoorOpen, Layers, Mail, MapPin, Phone, Plus, UsersRound } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createBatiment,
  etageLabel,
  getMonEspace,
  type MonEspace,
  type Responsable,
} from "@/lib/residences-api";
import { ROLE_LABELS } from "@/lib/roles";
import { ModalActions, formText, useSubmit } from "../forms";
import { useSession } from "../session";
import {
  Avatar,
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

type TabId = "batiments" | "gestionnaires" | "appartements" | "residence";

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

export default function ResidencesPage() {
  const notify = useToast();
  const { account } = useSession();
  const isAdmin = account.type === "Admin" && account.role === "admin";
  const [espace, setEspace] = useState<MonEspace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [tab, setTab] = useState<TabId>("batiments");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [addingBatiment, setAddingBatiment] = useState(false);

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

  const batiments = espace?.batiments ?? [];
  const residence = espace?.residence;

  const allAppartements: AppartementRow[] = batiments.flatMap((b) =>
    b.appartements.map((a) => ({
      id: a.id,
      nom: a.nom,
      batimentNom: b.nom,
      batimentId: b.id,
      etage: a.etage,
      proprietaire: a.proprietaire,
    }))
  );

  const allGestionnaires: GestionnaireRow[] = batiments.flatMap((b) =>
    b.sousAdmin ? [{ ...b.sousAdmin, batimentNom: b.nom, batimentId: b.id }] : []
  );

  const tabs: TabItem<TabId>[] = [
    { id: "batiments", label: "Bâtiments & Blocs", icon: Building2, count: batiments.length },
    { id: "gestionnaires", label: "Gestionnaires de Bâtiment", icon: UsersRound, count: allGestionnaires.length },
    { id: "appartements", label: "Appartements", icon: DoorOpen, count: allAppartements.length },
    { id: "residence", label: "Ma Résidence", icon: Layers },
  ];

  function showApartments(batimentNom: string) {
    setBuildingFilter(batimentNom);
    setTab("appartements");
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
        <div className="flex justify-end gap-1.5">
          <a
            href={`tel:${g.telephone}`}
            title={`Appeler ${fullName(g)}`}
            className={button("secondary", "sm")}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            Appeler
          </a>
          <a
            href={`mailto:${g.email}`}
            title={`Envoyer un email à ${fullName(g)}`}
            className={button("secondary", "sm")}
          >
            <Mail className="h-3.5 w-3.5" aria-hidden />
            Email
          </a>
        </div>
      ),
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
            <span className="block text-xs text-stone-500">{a.proprietaire.email}</span>
          </div>
        ) : (
          <span className="text-stone-400">Sans propriétaire</span>
        ),
    },
    {
      header: "Statut",
      cell: (a) => (a.proprietaire ? <Pill tone="success">Occupé</Pill> : <Pill tone="neutral">Vacant</Pill>),
    },
    {
      header: "Téléphone",
      cell: (a) => (a.proprietaire ? <Mono>{a.proprietaire.telephone}</Mono> : "—"),
    },
  ];

  const filteredApartments =
    buildingFilter === "all" ? allAppartements : allAppartements.filter((a) => a.batimentNom === buildingFilter);

  const totalAppartements = allAppartements.length;
  const totalOccupes = allAppartements.filter((a) => a.proprietaire).length;
  const tauxOccupation = totalAppartements > 0 ? Math.round((totalOccupes / totalAppartements) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Patrimoine, Bâtiments & Gestionnaires"
        subtitle={
          residence
            ? `${residence.nom} (${residence.localisation}) — Résidence → Bâtiments → Gestionnaires → Appartements`
            : "Structure organisationnelle : Résidence → Bâtiments → Gestionnaires → Appartements"
        }
        actions={
          isAdmin && residence ? (
            <button
              type="button"
              onClick={() => setAddingBatiment(true)}
              className={button("primary")}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Nouveau Bâtiment (Bloc)
            </button>
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

          {tab === "batiments" && (
            batiments.length === 0 ? (
              <section className={`${card} p-12 text-center text-sm text-stone-500`}>
                Aucun bâtiment n&apos;a encore été créé dans cette résidence.
                {isAdmin && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setAddingBatiment(true)}
                      className={button("primary")}
                    >
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
                        <h3 className="text-sm font-extrabold uppercase tracking-wide text-ink">Bâtiment {b.nom}</h3>
                        <Pill tone={taux > 50 ? "success" : "neutral"}>{taux}% occupé</Pill>
                      </div>
                      <p className="mt-3 text-2xl font-bold tracking-tight text-ink">{nbAppart} Appartements</p>
                      <p className="text-xs text-stone-500">{b.etages} Étages ({etageLabel(b.etages)})</p>

                      <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">
                          Gestionnaire du bâtiment
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className={`truncate text-sm font-semibold ${b.sousAdmin ? "text-ink" : "text-stone-400"}`}>
                            {b.sousAdmin ? fullName(b.sousAdmin) : "Non affecté"}
                          </span>
                          {b.sousAdmin && <Mono>{b.sousAdmin.telephone}</Mono>}
                        </div>
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
            )
          )}

          {tab === "gestionnaires" && (
            <DataTable
              columns={gestionnaireColumns}
              rows={allGestionnaires}
              rowKey={(g) => `${g.batimentId}-${g.id}`}
              empty="Aucun gestionnaire de bâtiment affecté pour le moment."
            />
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
                        selected
                          ? "bg-brand text-white"
                          : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      {value === "all" ? "Tous les bâtiments" : `Bâtiment ${value}`}
                    </button>
                  );
                })}
              </div>
              <DataTable
                columns={appartementColumns}
                rows={filteredApartments}
                rowKey={(a) => a.id}
                empty="Aucun appartement pour ce bâtiment."
              />
            </div>
          )}

          {tab === "residence" && (
            <div className="grid gap-6 md:grid-cols-2">
              <article className={`${card} p-6`}>
                <h3 className="text-lg font-bold text-ink">{residence.nom}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {residence.localisation}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500">Bâtiments</p>
                    <p className="mt-0.5 text-xl font-bold text-ink">{batiments.length}</p>
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
                  <StatLine
                    label="Administrateur Responsable"
                    value={espace.admin ? fullName(espace.admin) : "Non affecté"}
                  />
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
                <h4 className="text-sm font-bold uppercase tracking-wide text-stone-500">
                  Répartition par Bâtiment
                </h4>
                <div className="space-y-3">
                  {batiments.map((b) => (
                    <div key={b.id} className="rounded-xl border border-stone-100 bg-stone-50/50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-ink">Bâtiment {b.nom}</span>
                        <span className="text-xs text-stone-500">{b.etages} étages</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                        <span>{b.appartements.length} appartements</span>
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

    void run(async () => {
      await createBatiment(residenceId, { nom, etages });
      onCreated(nom);
    });
  }

  return (
    <Modal
      title="Nouveau Bâtiment (Bloc)"
      description={`Ajouter un bâtiment à la résidence « ${residenceNom} »`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Nom ou lettre du bâtiment"
          name="nom"
          required
          maxLength={60}
          placeholder="Ex: Bloc A, Bâtiment 1"
          autoFocus
        />
        <Field
          label="Nombre d'étages"
          name="etages"
          type="number"
          required
          min={0}
          max={200}
          defaultValue={4}
          hint="0 correspond à un rez-de-chaussée seul."
        />
        <FormError error={error} />
        <ModalActions submitting={submitting} label="Créer le bâtiment" onCancel={onClose} />
      </form>
    </Modal>
  );
}
