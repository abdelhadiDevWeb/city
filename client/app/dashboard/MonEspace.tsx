"use client";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Droplets,
  FileSignature,
  FileText,
  KeyRound,
  Layers,
  ListChecks,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  Receipt,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  UsersRound,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAnnonces, type Alerte, type Annonce, type AnnoncesData } from "@/lib/annonces-api";
import { getConfig, type ConfigData } from "@/lib/config-api";
import { getDocuments, type Contrat, type DocumentsData } from "@/lib/documents-api";
import { getFinances, type Depense, type Facture, type FinancesData, type Impaye, type Paiement } from "@/lib/finances-api";
import { formatDZD } from "@/lib/format";
import { getMaintenance, type Incident, type MaintenanceData, type PanneEquipement, type Priorite } from "@/lib/maintenance-api";
import { getPersonnel, type Employe, type PersonnelData, type Tache } from "@/lib/personnel-api";
import {
  etageLabel,
  getMonEspace,
  listResidents,
  type BatimentDetail,
  type MonEspace as Espace,
  type Resident,
  type Responsable,
} from "@/lib/residences-api";
import { ROLE_BADGE, ROLE_LABELS, displayName, primaryRole } from "@/lib/roles";
import { useSession } from "./session";
import { FormError, Mono, Pill, button, card, describeError, type Tone } from "./ui";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");
const formatUtcDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { timeZone: "UTC" });
const fullName = (p: { prenom: string; nom: string }) => `${p.prenom} ${p.nom}`;

const PRIORITE_TONE: Record<Priorite, Tone> = {
  Haute: "danger",
  Moyenne: "warning",
  Basse: "neutral",
};

const CONTRAT_TONE: Record<Contrat["statut"], Tone> = {
  Actif: "success",
  "Expire bientôt": "warning",
  Expiré: "danger",
};

export function MonEspace() {
  const { account } = useSession();
  const role = primaryRole(account);

  const [loading, setLoading] = useState(true);
  const [espace, setEspace] = useState<Espace | null>(null);
  const [finances, setFinances] = useState<FinancesData | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelData | null>(null);
  const [annonces, setAnnonces] = useState<AnnoncesData | null>(null);
  const [documents, setDocuments] = useState<DocumentsData | null>(null);
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getMonEspace(),
      getFinances(),
      getMaintenance(),
      listResidents(),
      getPersonnel(),
      getAnnonces(),
      getDocuments(),
      getConfig(),
    ])
      .then(([resEspace, resFin, resMaint, resResid, resPers, resAnn, resDocs, resConf]) => {
        if (!active) return;
        if (resEspace.status === "fulfilled") setEspace(resEspace.value);
        if (resFin.status === "fulfilled") setFinances(resFin.value);
        if (resMaint.status === "fulfilled") setMaintenance(resMaint.value);
        if (resResid.status === "fulfilled") setResidents(resResid.value);
        if (resPers.status === "fulfilled") setPersonnel(resPers.value);
        if (resAnn.status === "fulfilled") setAnnonces(resAnn.value);
        if (resDocs.status === "fulfilled") setDocuments(resDocs.value);
        if (resConf.status === "fulfilled") setConfig(resConf.value);
        setLoading(false);
      })
      .catch((err) => {
        if (active) {
          setError(describeError(err).message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={`${card} flex items-center justify-center p-20`}>
        <div className="flex flex-col items-center gap-3">
          <span aria-label="Chargement" className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-brand" />
          <p className="text-xs font-semibold text-stone-500">Chargement des données de la résidence...</p>
        </div>
      </div>
    );
  }

  const residence = espace?.residence;

  if (!residence) {
    return (
      <div className="space-y-6">
        <section className={`${card} p-12 text-center`}>
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-brand">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-xl font-bold text-ink">Aucune résidence attribuée</h2>
          <p className="mt-1 max-w-md mx-auto text-sm text-stone-500">
            Votre compte responsable n&apos;est pas encore lié à une résidence. Veuillez contacter le Super Administrateur pour finaliser votre affectation.
          </p>
        </section>
      </div>
    );
  }

  // Calculations
  const batiments = espace.batiments ?? [];
  const appartements = batiments.flatMap((b) => b.appartements);
  const occupes = appartements.filter((a) => a.proprietaire).length;
  const abonnement = espace.abonnement;

  // Finances
  const paiements = finances?.paiements ?? [];
  const depenses = finances?.depenses ?? [];
  const factures = finances?.factures ?? [];
  const impayes = finances?.impayes ?? [];
  const totalEncaisse = paiements.reduce((sum, p) => sum + p.montant, 0);
  const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);
  const totalFactures = factures.reduce((sum, f) => sum + f.montant, 0);
  const totalImpayes = impayes.reduce((sum, i) => sum + i.totalDu, 0);
  const solde = totalEncaisse - totalDepenses;
  const chargesAppelees = totalEncaisse + totalImpayes;
  const tauxRecouvrement = chargesAppelees > 0 ? Math.round((totalEncaisse / chargesAppelees) * 100) : 100;

  // Maintenance
  const incidents = maintenance?.incidents ?? [];
  const pannes = maintenance?.pannesEquipement ?? [];
  const interventionsPassees = maintenance?.historiqueInterventions ?? [];
  const incidentsUrgents = incidents.filter((i) => i.priorite === "Haute" || i.statut !== "Clôturé");

  // Personnel & Taches
  const taches = personnel?.taches ?? [];
  const employes = personnel?.personnel ?? [];
  const employesEnService = employes.filter((e) => e.statut === "En service").length;
  const tachesEnCours = taches.filter((t) => t.statut !== "Terminée");

  // Annonces & Alertes
  const alertes = annonces?.alertes ?? [];
  const annoncesList = annonces?.annonces ?? [];

  // Documents & Contrats
  const contrats = documents?.contrats ?? [];
  const documentsResidence = documents?.documentsResidence ?? [];

  return (
    <div className="space-y-8">
      {/* 1. Header & Context Banner */}
      <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
              {role === "admin" ? "Espace Admin Résidence" : "Espace Sub Admin Bâtiment"}
            </span>
            {abonnement && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {abonnement.nom ?? "Abonnement"} · Payé
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">{residence.nom}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
            {residence.localisation} · {batiments.length} bâtiment{batiments.length > 1 ? "s" : ""} · {appartements.length} appartements
          </p>

          <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-600">
            Responsable connecté : <span className="font-semibold text-ink">{displayName(account)}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/finances" className={button("primary", "sm")}>
            <Wallet className="h-3.5 w-3.5" aria-hidden />
            Encaisser Paiement
          </Link>
          <Link href="/dashboard/maintenance" className={button("secondary", "sm")}>
            <Wrench className="h-3.5 w-3.5" aria-hidden />
            Signaler Incident
          </Link>
          <Link href="/dashboard/annonces" className={button("secondary", "sm")}>
            <Megaphone className="h-3.5 w-3.5" aria-hidden />
            Diffuser Alerte
          </Link>
          <Link href="/dashboard/residents" className={button("secondary", "sm")}>
            <UserPlus className="h-3.5 w-3.5" aria-hidden />
            Nouveau Résident
          </Link>
        </div>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      {/* 2. Top 4 Executive KPI Hero Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI 1 : Trésorerie */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Trésorerie Disponible</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{formatDZD(solde)}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
            <span>Encaissé : {formatDZD(totalEncaisse)}</span>
            <span className="text-emerald-600 font-semibold">Caisse active</span>
          </div>
        </div>

        {/* KPI 2 : Recouvrement */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Recouvrement Charges</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
              <Receipt className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{tauxRecouvrement}%</p>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
            <span>Impayés : {formatDZD(totalImpayes)}</span>
            <span className={impayes.length > 0 ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
              {impayes.length} en retard
            </span>
          </div>
        </div>

        {/* KPI 3 : Incidents & Pannes */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Urgences & Pannes</span>
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                incidentsUrgents.length > 0 ? "bg-red-50 text-red-600" : "bg-stone-50 text-stone-600"
              }`}
            >
              <Wrench className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
            {incidents.length} incident{incidents.length > 1 ? "s" : ""}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
            <span>{pannes.length} panne(s) équipement</span>
            <span className={incidentsUrgents.length > 0 ? "text-red-600 font-semibold" : "text-stone-500"}>
              {incidentsUrgents.length} en cours
            </span>
          </div>
        </div>

        {/* KPI 4 : Communauté & Logements */}
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Résidents & Logements</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
            {residents.length} résident{residents.length > 1 ? "s" : ""}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
            <span>Occupation</span>
            <span className="text-blue-600 font-semibold">
              {occupes} / {appartements.length} attribués
            </span>
          </div>
        </div>
      </div>

      {/* 3. Primary Operations Grid (Finances & Maintenance) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: Finances & Recettes Récentes */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand">
                <CircleDollarSign className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Finances & Derniers Règlements</h2>
                <p className="text-xs text-stone-500">Recouvrement des charges et cotisations</p>
              </div>
            </div>
            <Link href="/dashboard/finances" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="my-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Encaissé</p>
              <p className="mt-1 font-bold text-emerald-600 truncate">{formatDZD(totalEncaisse)}</p>
            </div>
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Dépenses</p>
              <p className="mt-1 font-bold text-stone-700 truncate">{formatDZD(totalDepenses)}</p>
            </div>
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Factures Serv.</p>
              <p className="mt-1 font-bold text-stone-700 truncate">{formatDZD(totalFactures)}</p>
            </div>
          </div>

          {/* Paiements récents */}
          <div className="flex-1">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Derniers paiements enregistrés</p>
            {paiements.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucun paiement enregistré pour l&apos;instant.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {paiements.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="font-semibold text-ink">{p.resident}</p>
                      <p className="text-[11px] text-stone-500">
                        {p.logement} · <span className="font-medium text-stone-600">{p.mode}</span> · {p.date}
                      </p>
                    </div>
                    <Mono strong className="text-emerald-700">
                      +{formatDZD(p.montant)}
                    </Mono>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/finances"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Consulter l&apos;historique complet ({paiements.length} encaissements)</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Maintenance & Pannes */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand">
                <Wrench className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Maintenance & Équipements</h2>
                <p className="text-xs text-stone-500">Incidents en cours et pannes matérielles</p>
              </div>
            </div>
            <Link href="/dashboard/maintenance" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="my-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Incidents</p>
              <p className="mt-1 font-bold text-ink truncate">{incidents.length} déclarés</p>
            </div>
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Pannes</p>
              <p className="mt-1 font-bold text-amber-600 truncate">{pannes.length} en attente</p>
            </div>
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
              <p className="text-[10px] uppercase font-bold text-stone-400">Historique</p>
              <p className="mt-1 font-bold text-stone-600 truncate">{interventionsPassees.length} réglés</p>
            </div>
          </div>

          {/* Incidents récents */}
          <div className="flex-1">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Incidents & urgences récentes</p>
            {incidents.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucun incident actif dans la résidence. Tout fonctionne normalement.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {incidents.slice(0, 4).map((i) => (
                  <li key={i.id} className="flex items-center justify-between py-2.5 gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink truncate">{i.titre}</p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {i.lieu} · Prestataire : {i.prestataire}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Pill tone={PRIORITE_TONE[i.priorite]}>{i.priorite}</Pill>
                      <Pill tone={i.statut === "En cours" ? "brand" : "neutral"}>{i.statut}</Pill>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/maintenance"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Ouvrir le registre des interventions</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      {/* 4. Secondary Operations Grid (Annonces, Residents, Personnel) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Card: Annonces & Alertes */}
        <section className={`${card} flex flex-col p-5`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
                <Megaphone className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-sm font-bold text-ink">Annonces & Alertes</h3>
            </div>
            <Link href="/dashboard/annonces" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-3 flex-1">
            {alertes.length === 0 && annoncesList.length === 0 ? (
              <p className="py-8 text-center text-xs text-stone-500">Aucune annonce publiée pour le moment.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {alertes.slice(0, 3).map((a) => (
                  <li key={a.id} className="py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink truncate">{a.titre}</span>
                      <Pill tone={a.niveau === "critique" ? "danger" : a.niveau === "attention" ? "warning" : "neutral"}>
                        {a.niveau}
                      </Pill>
                    </div>
                    <p className="mt-1 text-[11px] text-stone-500 line-clamp-2">{a.detail}</p>
                    <span className="mt-1 block text-[10px] text-stone-400">{a.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-stone-100 pt-2.5">
            <Link href="/dashboard/annonces" className="flex items-center justify-between text-xs text-stone-500 hover:text-brand">
              <span>Voir toutes les alertes ({alertes.length + annoncesList.length})</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Nouveaux Résidents */}
        <section className={`${card} flex flex-col p-5`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <UsersRound className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-sm font-bold text-ink">Résidents & Logements</h3>
            </div>
            <Link href="/dashboard/residents" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-3 flex-1">
            {residents.length === 0 ? (
              <p className="py-8 text-center text-xs text-stone-500">Aucun résident inscrit pour le moment.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {residents.slice(0, 3).map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2.5 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-brand">
                        {r.prenom[0]}
                        {r.nom[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{fullName(r)}</p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {r.batiment?.nom ?? "Bâtiment"} · Apt {r.appartement?.nom ?? "—"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono shrink-0">{r.telephone}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-stone-100 pt-2.5">
            <Link href="/dashboard/residents" className="flex items-center justify-between text-xs text-stone-500 hover:text-brand">
              <span>Annuaire complet ({residents.length} résidents)</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Personnel en Service & Tâches */}
        <section className={`${card} flex flex-col p-5`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ListChecks className="h-4 w-4" aria-hidden />
              </span>
              <h3 className="text-sm font-bold text-ink">Personnel & Tâches</h3>
            </div>
            <Link href="/dashboard/personnel" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-3 flex-1">
            <div className="mb-2.5 flex items-center justify-between text-[11px] text-stone-500">
              <span>Agents en service</span>
              <span className="font-semibold text-emerald-700">
                {employesEnService} / {employes.length} actifs
              </span>
            </div>

            {taches.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucune tâche assignée pour le moment.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {taches.slice(0, 3).map((t) => (
                  <li key={t.id} className="py-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-ink truncate">{t.titre}</span>
                      <Pill tone={t.statut === "Terminée" ? "success" : t.statut === "En cours" ? "brand" : "neutral"}>
                        {t.statut}
                      </Pill>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Assigné à {t.assigneA} · {t.lieu}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-stone-100 pt-2.5">
            <Link href="/dashboard/personnel" className="flex items-center justify-between text-xs text-stone-500 hover:text-brand">
              <span>Plan de travail ({tachesEnCours.length} à faire)</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      {/* 5. Governance, Contracts & Configuration Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: Contrats Prestataires */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FileSignature className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Contrats Prestataires Clés</h2>
                <p className="text-xs text-stone-500">Ascenseurs, gardiennage, sécurité & nettoyage</p>
              </div>
            </div>
            <Link href="/dashboard/documents" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-4 flex-1">
            {contrats.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucun contrat prestataire archivé.</p>
            ) : (
              <ul className="divide-y divide-stone-100 text-xs">
                {contrats.slice(0, 3).map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-ink">{c.objet}</p>
                      <p className="text-[11px] text-stone-500">
                        {c.prestataire} · Échéance : {c.fin}
                      </p>
                    </div>
                    <div className="text-right">
                      <Mono strong className="text-ink">
                        {formatDZD(c.montantAnnuel)}
                      </Mono>
                      <div className="mt-1">
                        <Pill tone={CONTRAT_TONE[c.statut]}>{c.statut}</Pill>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/documents"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Accéder aux documents & archives ({documentsResidence.length} pièces)</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Configuration & Moyens de Paiement */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand">
                <SlidersHorizontal className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Modes de Règlement & Paramètres</h2>
                <p className="text-xs text-stone-500">Canaux de paiement et barèmes de charges</p>
              </div>
            </div>
            <Link href="/dashboard/configuration" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-4 flex-1 space-y-4">
            {/* Modes de paiement */}
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Canaux de paiement acceptés</p>
              <div className="flex flex-wrap gap-2">
                {(config?.modesPaiement ?? []).map((m) => (
                  <span
                    key={m.id}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                      m.actif
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 bg-stone-50 text-stone-400 line-through"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${m.actif ? "bg-emerald-500" : "bg-stone-300"}`} />
                    {m.nom}
                  </span>
                ))}
                {(!config || config.modesPaiement.length === 0) && (
                  <span className="text-xs text-stone-400">Modes standard activés : CIB, Edahabia, BaridiMob, Virement, Espèces</span>
                )}
              </div>
            </div>

            {/* Types de charges */}
            <div className="border-t border-stone-100 pt-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Types de charges configurés</p>
              <div className="flex flex-wrap gap-1.5">
                {(config?.typesCharges ?? []).slice(0, 4).map((tc) => (
                  <Pill key={tc.id} tone={tc.actif ? "brand" : "neutral"}>
                    {tc.nom} ({formatDZD(tc.montantMensuel)}/mois)
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/configuration"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Modifier les types de charges et délais SLA</span>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
