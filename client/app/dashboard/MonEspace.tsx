"use client";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building,
  Building2,
  Calendar,
  ChartColumn,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Download,
  Droplets,
  FileCheck2,
  FileSignature,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  KeyRound,
  Layers,
  ListChecks,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  Receipt,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  UserCheck,
  UserCog,
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
import { SmartActionCenter } from "./SmartActionCenter";
import { SkeletonDashboard } from "./skeletons";
import { useSession } from "./session";
import { useI18n } from "@/lib/i18n";
import { FormError, Mono, Panel, Pill, ProgressBar, button, card, describeError, type Tone } from "./ui";

const formatDate = (iso: string, loc?: string) => new Date(iso).toLocaleDateString(loc === "ar" ? "ar-DZ" : loc === "en" ? "en-US" : "fr-FR");
const formatUtcDate = (iso: string, loc?: string) => new Date(iso).toLocaleDateString(loc === "ar" ? "ar-DZ" : loc === "en" ? "en-US" : "fr-FR", { timeZone: "UTC" });
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
  const { t, tText, locale, isRTL, formatCurrency } = useI18n();
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
    return <SkeletonDashboard />;
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

  if (role === "admin" && !espace?.abonnement) {
    return (
      <div className="space-y-6">
        <section className={`${card} p-12 text-center`}>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <CreditCard className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mt-4 text-2xl font-bold text-ink">Abonnement en attente de validation</h2>
          <p className="mt-2 max-w-lg mx-auto text-sm text-stone-500 leading-relaxed">
            Votre compte administrateur pour la résidence <span className="font-semibold text-ink">« {residence.nom} »</span> n&apos;a pas d&apos;abonnement actif payé en cours.
            Le Super Administrateur doit valider votre formule d&apos;abonnement (durée standard 1 an avec paiement flexible) pour débloquer l&apos;accès complet à votre tableau de bord.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard/profil" className={button("secondary")}>
              Consulter mon profil
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Common Calculations
  const batiments = espace.batiments ?? [];
  const appartements = batiments.flatMap((b) => b.appartements);
  const occupes = appartements.filter((a) => a.proprietaire).length;
  const abonnement = espace.abonnement;

  // Global Finances
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

  // Global Maintenance
  const incidents = maintenance?.incidents ?? [];
  const pannes = maintenance?.pannesEquipement ?? [];
  const interventionsPassees = maintenance?.historiqueInterventions ?? [];
  const incidentsUrgents = incidents.filter((i) => i.priorite === "Haute" || i.statut !== "Clôturé");

  // Global Personnel & Taches
  const taches = personnel?.taches ?? [];
  const employes = personnel?.personnel ?? [];
  const employesEnService = employes.filter((e) => e.statut === "En service").length;
  const tachesEnCours = taches.filter((t) => t.statut !== "Terminée");

  // Global Annonces & Alertes
  const alertes = annonces?.alertes ?? [];
  const annoncesList = annonces?.annonces ?? [];

  // Documents & Contrats
  const contrats = documents?.contrats ?? [];
  const documentsResidence = documents?.documentsResidence ?? [];

  // -------------------------------------------------------------
  // SCOPED CALCULATIONS FOR SOUS-ADMIN (RESPONSABLE DE BÂTIMENT)
  // -------------------------------------------------------------
  const adminAccount = account.type === "Admin" ? account : null;
  const assignedBatimentId = adminAccount?.idBatiment;
  const myBatiment = (batiments.find((b) => b.id === assignedBatimentId) ?? batiments[0]) as BatimentDetail | undefined;
  const myAppartements = myBatiment?.appartements ?? [];
  const myAppartementIds = new Set(myAppartements.map((a) => a.id));
  const myAppartementNames = new Set(myAppartements.map((a) => a.nom.toLowerCase()));
  const myOccupes = myAppartements.filter((a) => a.proprietaire).length;

  const myResidents = residents.filter(
    (r) =>
      (r.batiment && r.batiment.id === myBatiment?.id) ||
      (r.appartement && myAppartementIds.has(r.appartement.id)) ||
      myAppartementNames.has((r.appartement?.nom ?? "").toLowerCase())
  );
  const myResidentNames = new Set(myResidents.map((r) => fullName(r).toLowerCase()));

  const myPaiements = paiements.filter(
    (p) =>
      myResidentNames.has(p.resident.toLowerCase()) ||
      myAppartementNames.has(p.logement.toLowerCase()) ||
      (myBatiment && p.logement.toLowerCase().includes(myBatiment.nom.toLowerCase()))
  );

  const myImpayes = impayes.filter(
    (i) =>
      myResidentNames.has(i.resident.toLowerCase()) ||
      myAppartementNames.has(i.logement.toLowerCase()) ||
      (myBatiment && i.logement.toLowerCase().includes(myBatiment.nom.toLowerCase()))
  );

  const myEncaisse = myPaiements.reduce((sum, p) => sum + p.montant, 0);
  const myTotalImpayes = myImpayes.reduce((sum, i) => sum + i.totalDu, 0);
  const myChargesAppelees = myEncaisse + myTotalImpayes;
  const myTauxRecouvrement = myChargesAppelees > 0 ? Math.round((myEncaisse / myChargesAppelees) * 100) : 100;

  const myIncidents = incidents.filter(
    (i) =>
      !myBatiment ||
      i.lieu.toLowerCase().includes(myBatiment.nom.toLowerCase()) ||
      i.lieu.toLowerCase().includes("commun") ||
      i.lieu.toLowerCase().includes("hall")
  );

  const myPannes = pannes.filter(
    (p) =>
      !myBatiment ||
      p.lieu.toLowerCase().includes(myBatiment.nom.toLowerCase()) ||
      p.lieu.toLowerCase().includes("commun")
  );

  const myTaches = taches.filter(
    (t) =>
      !myBatiment ||
      t.lieu.toLowerCase().includes(myBatiment.nom.toLowerCase()) ||
      t.lieu.toLowerCase().includes("hall") ||
      t.lieu.toLowerCase().includes("commun")
  );

  // =========================================================================
  // VIEW A: SOUS-ADMIN (RESPONSABLE DE BÂTIMENT)
  // =========================================================================
  if (role === "sub_admin") {
    const batimentModules = [
      {
        title: "Mon Bâtiment & Lots",
        route: "/dashboard/residences",
        icon: Building2,
        badge: `${myAppartements.length} lots`,
        meta: `${myBatiment?.etages ?? 0} étages`,
        description: "Gestion des appartements, étages et répartition des tantièmes de votre bâtiment.",
        color: "bg-orange-50 text-brand border-orange-100",
      },
      {
        title: "Mes Résidents & Contacts",
        route: "/dashboard/residents",
        icon: Users,
        badge: `${myResidents.length} résidents`,
        meta: `${myOccupes} occupés`,
        description: "Annuaire nominatif des occupants de votre bloc, coordonnées téléphoniques et clés temporaires.",
        color: "bg-blue-50 text-blue-600 border-blue-100",
      },
      {
        title: "Paiements & Cotisations",
        route: "/dashboard/finances",
        icon: Wallet,
        badge: `${myTauxRecouvrement}% payé`,
        meta: formatDZD(myEncaisse),
        description: "Enregistrement des paiements des résidents, suivi de qui a payé et qui est en retard.",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
      {
        title: "Incidents & Pannes Bloc",
        route: "/dashboard/maintenance",
        icon: Wrench,
        badge: `${myIncidents.length} signalements`,
        meta: `${myPannes.length} panne(s)`,
        description: "Signalement des pannes d'ascenseur, éclairage, interphone et plomberie de votre bâtiment.",
        color: "bg-amber-50 text-amber-600 border-amber-100",
      },
      {
        title: "Personnel & Entretien Bloc",
        route: "/dashboard/personnel",
        icon: UserCog,
        badge: `${myTaches.length} tâches`,
        meta: "Missions assignées",
        description: "Suivi des agents d'entretien, techniciens et prestataires intervenant sur votre bâtiment.",
        color: "bg-purple-50 text-purple-600 border-purple-100",
      },
      {
        title: "Alertes & Rapports Bloc",
        route: "/dashboard/annonces",
        icon: Megaphone,
        badge: `${alertes.length} alertes`,
        meta: "Diffusions & Exports",
        description: "Diffusion d'avis aux résidents de votre bloc et export du journal de caisse du bâtiment.",
        color: "bg-teal-50 text-teal-600 border-teal-100",
      },
    ];

    return (
      <div className="space-y-8">
        {/* Sub-Admin Header Banner */}
        <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
                <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
                Responsable de Bâtiment · Périmètre délégué
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold text-brand">
                <Building className="h-3.5 w-3.5" aria-hidden />
                {myBatiment?.nom ?? "Bâtiment Délégué"}
              </span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {myBatiment?.nom ?? "Mon Bâtiment"} — {residence.nom}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
              <MapPin className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
              {residence.localisation} · {myBatiment?.etages ?? 0} étages · {myAppartements.length} appartements sous votre responsabilité
            </p>

            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-600">
              Sous-Admin connecté : <span className="font-semibold text-ink">{displayName(account)}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${ROLE_BADGE.sub_admin}`}>
                {ROLE_LABELS.sub_admin}
              </span>
            </p>
          </div>

          {/* Sub-Admin Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/dashboard/finances" className={button("primary", "sm")}>
              <Wallet className="h-3.5 w-3.5" aria-hidden />
              Encaisser un Résident
            </Link>
            <Link href="/dashboard/residents" className={button("secondary", "sm")}>
              <UserPlus className="h-3.5 w-3.5" aria-hidden />
              Nouveau Résident
            </Link>
            <Link href="/dashboard/maintenance" className={button("secondary", "sm")}>
              <Wrench className="h-3.5 w-3.5" aria-hidden />
              Signaler Panne Bloc
            </Link>
            <Link href="/dashboard/annonces" className={button("secondary", "sm")}>
              <Megaphone className="h-3.5 w-3.5" aria-hidden />
              Diffuser Alerte
            </Link>
            <Link href="/dashboard/rapports" className={button("secondary", "sm")}>
              <ChartColumn className="h-3.5 w-3.5" aria-hidden />
              Exporter Registre
            </Link>
          </div>
        </section>

        {error && <FormError error={{ message: error, details: [] }} />}

        {/* Sub-Admin 4 KPIs Filtered to his building */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* KPI 1 : Recouvrement Bâtiment */}
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Recouvrement Bâtiment</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-brand">
                <Receipt className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{myTauxRecouvrement}%</p>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
              <span>Encaissé : {formatDZD(myEncaisse)}</span>
              <span className={myImpayes.length > 0 ? "text-amber-600 font-semibold" : "text-emerald-600 font-semibold"}>
                {myImpayes.length} en retard
              </span>
            </div>
          </div>

          {/* KPI 2 : Logements & Résidents */}
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Logements & Résidents</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {myResidents.length} résident{myResidents.length > 1 ? "s" : ""}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
              <span>Occupation Bloc</span>
              <span className="text-blue-600 font-semibold">
                {myOccupes} / {myAppartements.length} attribués
              </span>
            </div>
          </div>

          {/* KPI 3 : Incidents de proximité */}
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Maintenance & Pannes Bloc</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  myIncidents.length > 0 ? "bg-amber-50 text-amber-600" : "bg-stone-50 text-stone-600"
                }`}
              >
                <Wrench className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {myIncidents.length} signalement{myIncidents.length > 1 ? "s" : ""}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
              <span>{myPannes.length} panne(s) ascenseur/bloc</span>
              <span className="text-stone-500 font-semibold">Suivi actif</span>
            </div>
          </div>

          {/* KPI 4 : Tâches d'entretien Bâtiment */}
          <div className={`${card} p-5`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Entretien & Tâches</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <ListChecks className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {myTaches.length} intervention{myTaches.length > 1 ? "s" : ""}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-2">
              <span>Personnel mobilisé</span>
              <span className="text-emerald-600 font-semibold">Nettoyage & Sécurité</span>
            </div>
          </div>
        </div>

        {/* Sub-Admin 6 Modules Hub */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Modules de Gestion du {myBatiment?.nom ?? "Bâtiment"}</h2>
              <p className="text-xs text-stone-500">Accès direct et données filtrées sur votre périmètre de bâtiment délégué</p>
            </div>
            <span className="text-xs font-semibold text-stone-400">6 modules délégués</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {batimentModules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.route}
                  href={m.route}
                  className={`${card} group flex flex-col justify-between p-5 transition hover:border-brand/40 hover:shadow-xs`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${m.color}`}>
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <Pill tone="brand">{m.badge}</Pill>
                    </div>
                    <h3 className="mt-3 text-base font-bold text-ink group-hover:text-brand transition">{m.title}</h3>
                    <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">{m.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs">
                    <span className="font-semibold text-stone-600">{m.meta}</span>
                    <span className="flex items-center gap-1 font-semibold text-brand group-hover:translate-x-0.5 transition">
                      Gérer
                      <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Sub-Admin Workspaces */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Workspace 1: Logements & Résidents du Bâtiment */}
          <section className={`${card} flex flex-col p-6`}>
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-bold text-ink">Résidents du {myBatiment?.nom ?? "Bâtiment"}</h2>
                  <p className="text-xs text-stone-500">{myOccupes} logements occupés sur {myAppartements.length} au total</p>
                </div>
              </div>
              <Link href="/dashboard/residents" className="text-xs font-semibold text-brand hover:underline">
                Gérer →
              </Link>
            </div>

            <div className="my-4 flex-1">
              {myAppartements.length === 0 ? (
                <p className="py-8 text-center text-xs text-stone-500">Aucun appartement configuré dans ce bâtiment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        <th className="pb-2.5">Logement</th>
                        <th className="pb-2.5">Étage</th>
                        <th className="pb-2.5">Occupant / Copropriétaire</th>
                        <th className="pb-2.5 text-end">Paiement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {myAppartements.slice(0, 6).map((apt) => {
                        const occupant = apt.proprietaire;
                        const isImpaye = myImpayes.some((i) => i.logement.toLowerCase() === apt.nom.toLowerCase());
                        return (
                          <tr key={apt.id} className="hover:bg-stone-50/60 transition">
                            <td className="py-2.5 font-bold text-ink">{apt.nom}</td>
                            <td className="py-2.5 text-stone-500">{etageLabel(apt.etage)}</td>
                            <td className="py-2.5">
                              {occupant ? (
                                <span className="font-semibold text-ink">{fullName(occupant)}</span>
                              ) : (
                                <span className="text-stone-400 italic">Vacant</span>
                              )}
                            </td>
                            <td className="py-2.5 text-end">
                              {isImpaye ? (
                                <Pill tone="danger">Impayé</Pill>
                              ) : occupant ? (
                                <Pill tone="success">À jour</Pill>
                              ) : (
                                <Pill tone="neutral">Non attribué</Pill>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="border-t border-stone-100 pt-3">
              <Link
                href="/dashboard/residents"
                className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand"
              >
                <span>Accéder à l&apos;annuaire complet des résidents ({myResidents.length})</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </section>

          {/* Workspace 2: Règlements & Impayés du Bâtiment */}
          <section className={`${card} flex flex-col p-6`}>
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand">
                  <Receipt className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h2 className="text-base font-bold text-ink">Journal des Règlements du Bâtiment</h2>
                  <p className="text-xs text-stone-500">Recouvrement direct des charges et cotisations</p>
                </div>
              </div>
              <Link href="/dashboard/finances" className="text-xs font-semibold text-brand hover:underline">
                Encaisser →
              </Link>
            </div>

            <div className="my-4 flex-1">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Derniers encaissements enregistrés</p>
              {myPaiements.length === 0 ? (
                <p className="py-6 text-center text-xs text-stone-500">Aucun paiement récent dans ce bâtiment.</p>
              ) : (
                <ul className="divide-y divide-stone-100 text-xs">
                  {myPaiements.slice(0, 4).map((p) => (
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

            <div className="border-t border-stone-100 pt-3">
              <Link
                href="/dashboard/finances"
                className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand"
              >
                <span>Voir la liste des retards de paiement ({myImpayes.length} impayés)</span>
                <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Link>
            </div>
          </section>
        </div>

        {/* Sub-Admin Workspace 3: Maintenance & Pannes de proximité */}
        <section className={`${card} p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Wrench className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Incidents & Pannes du {myBatiment?.nom ?? "Bâtiment"}</h2>
                <p className="text-xs text-stone-500">Ascenseur, éclairage du hall, pompes et parties communes</p>
              </div>
            </div>
            <Link href="/dashboard/maintenance" className="text-xs font-semibold text-brand hover:underline">
              Signaler un problème →
            </Link>
          </div>

          <div className="my-4">
            {myIncidents.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucun incident ouvert sur ce bâtiment. Équipements opérationnels.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="pb-2.5">Incident</th>
                      <th className="pb-2.5">Emplacement</th>
                      <th className="pb-2.5">Prestataire / Intervenant</th>
                      <th className="pb-2.5">Priorité</th>
                      <th className="pb-2.5 text-end">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {myIncidents.slice(0, 4).map((i) => (
                      <tr key={i.id} className="hover:bg-stone-50/60 transition">
                        <td className="py-2.5 font-semibold text-ink">{i.titre}</td>
                        <td className="py-2.5 text-stone-500">{i.lieu}</td>
                        <td className="py-2.5 text-stone-600 font-medium">{i.prestataire}</td>
                        <td className="py-2.5">
                          <Pill tone={PRIORITE_TONE[i.priorite]}>{i.priorite}</Pill>
                        </td>
                        <td className="py-2.5 text-end">
                          <Pill tone={i.statut === "En cours" ? "brand" : "neutral"}>{i.statut}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
            <span className="text-stone-500">{myPannes.length} équipement(s) sous surveillance technique</span>
            <Link href="/dashboard/maintenance" className="font-semibold text-brand hover:underline flex items-center gap-1">
              Ouvrir le registre de maintenance
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: ADMIN (SYNDIC DE RÉSIDENCE - 360° MASTER EXECUTIVE VIEW)
  // =========================================================================
  const batimentsWithoutSubAdmin = batiments.filter((b) => !b.sousAdmin).length;

  const adminModules = [
    {
      title: "Bâtiments & Sous-Admins",
      route: "/dashboard/residences",
      icon: Building2,
      badge: `${batiments.length} bâtiments`,
      meta: `${batimentsWithoutSubAdmin > 0 ? `${batimentsWithoutSubAdmin} sans sous-admin` : "Tous délégués"}`,
      description: "Gestion des blocs, étages, tantièmes et nomination des responsables de bâtiment.",
      color: "bg-orange-50 text-brand border-orange-100",
    },
    {
      title: "Résidents & Logements",
      route: "/dashboard/residents",
      icon: Users,
      badge: `${residents.length} résidents`,
      meta: `${occupes} / ${appartements.length} occupés`,
      description: "Annuaire des copropriétaires, fiches logements, mots de passe temporaires et affectations.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Finances & Règlements",
      route: "/dashboard/finances",
      icon: Wallet,
      badge: `${tauxRecouvrement}% recouvré`,
      meta: formatDZD(solde),
      description: "Journal de caisse, encaissement des charges, quittances WhatsApp et relances d'impayés.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Maintenance & Pannes",
      route: "/dashboard/maintenance",
      icon: Wrench,
      badge: `${incidents.length} incidents`,
      meta: `${pannes.length} pannes matérielles`,
      description: "Suivi des pannes d'ascenseurs, interventions techniques avec photos et clôture des tickets.",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Assemblées Générales (AG)",
      route: "/dashboard/assemblees",
      icon: ScrollText,
      badge: "AGO 2026",
      meta: "Quorum 74.5% tantièmes",
      description: "Convocations, vote en ligne par tantièmes, mode projection vidéoprojecteur et PV certifié.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Personnel & Tâches",
      route: "/dashboard/personnel",
      icon: UserCog,
      badge: `${employesEnService} / ${employes.length} en poste`,
      meta: `${tachesEnCours.length} tâches à faire`,
      description: "Planning des concierges, agents d'entretien, gardiens de nuit et affectation des tâches.",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Annonces & Alertes",
      route: "/dashboard/annonces",
      icon: Megaphone,
      badge: `${alertes.length} alertes actives`,
      meta: `${annoncesList.length} diffusées`,
      description: "Diffusion d'avis aux copropriétaires et alertes d'urgence avec notification instantanée.",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Documents & Contrats",
      route: "/dashboard/documents",
      icon: FolderOpen,
      badge: `${contrats.length} contrats`,
      meta: `${documentsResidence.length} pièces archivées`,
      description: "Coffre-fort numérique, contrats d'ascenseur, assurance de copropriété et devis.",
      color: "bg-stone-100 text-stone-700 border-stone-200",
    },
    {
      title: "Rapports & Exports",
      route: "/dashboard/rapports",
      icon: ChartColumn,
      badge: "Bilan N vs N+1",
      meta: "Formats CSV & Print",
      description: "Génération de bilans comptables, journaux financiers et registres par période paramétrable.",
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
    {
      title: "Configuration & Types",
      route: "/dashboard/configuration",
      icon: SlidersHorizontal,
      badge: `${config?.typesCharges.length ?? 0} types charges`,
      meta: "Barèmes & CIB",
      description: "Modes de paiement acceptés (CIB, BaridiMob), barèmes mensuels et délais SLA d'intervention.",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Context Banner */}
      <section className={`${card} flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between`}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-stone-600">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
              Syndic de Copropriété · Espace Administrateur Général
            </span>
            {abonnement && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {abonnement.nom ?? "Abonnement"} · 1 an standard · Payé
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-ink">{residence.nom}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
            {residence.localisation} · {batiments.length} bâtiment{batiments.length > 1 ? "s" : ""} · {appartements.length} appartements au total
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
          <Link href="/dashboard/residences" className={button("secondary", "sm")}>
            <UserCheck className="h-3.5 w-3.5" aria-hidden />
            Bâtiments & Sous-Admins
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
          <Link href="/dashboard/assemblees" className={button("secondary", "sm")}>
            <ScrollText className="h-3.5 w-3.5" aria-hidden />
            Assemblées (AG)
          </Link>
        </div>
      </section>

      {error && <FormError error={{ message: error, details: [] }} />}

      {/* Ruban d'Alertes Intelligentes du Syndic */}
      <SmartActionCenter
        impayesCount={impayes.length}
        totalImpayes={totalImpayes}
        pannesCount={pannes.length}
        pannesSummary={pannes.map((p) => p.equipement).slice(0, 2).join(", ")}
        contratsExpirantCount={contrats.filter((c) => c.statut === "Expire bientôt" || c.statut === "Expiré").length}
        agDate="20 Novembre 2026"
        agQuorumPct={74.5}
      />

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

      {/* 3. The 10 Modules 360° Management Hub */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{tText("Hub des 10 Modules de Gestion Résidence")}</h2>
            <p className="text-xs text-stone-500">{tText("Supervision globale et accès direct à l'ensemble des pages du Syndic")}</p>
          </div>
          <span className="text-xs font-semibold text-stone-400">
            {locale === "ar" ? "10 صفحات تشغيلية" : locale === "en" ? "10 operational pages" : "10 pages opérationnelles"}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {adminModules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.route}
                href={m.route}
                className={`${card} group flex flex-col justify-between p-4 transition hover:border-brand/40 hover:shadow-xs`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${m.color}`}>
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <Pill tone="brand">{tText(m.badge)}</Pill>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-ink group-hover:text-brand transition">{tText(m.title)}</h3>
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">{tText(m.description)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs">
                  <span className="font-semibold text-stone-600 truncate">{tText(m.meta)}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-brand shrink-0 rtl:rotate-180" aria-hidden />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Primary Workspaces (Bâtiments & Finances) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: Bâtiments de la résidence & Sous-Admins délégués */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-brand">
                <Building2 className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Bâtiments & Sous-Admins Délégués</h2>
                <p className="text-xs text-stone-500">Nomination et suivi des responsables par bloc</p>
              </div>
            </div>
            <Link href="/dashboard/residences" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-4 flex-1">
            {batiments.length === 0 ? (
              <p className="py-6 text-center text-xs text-stone-500">Aucun bâtiment configuré pour cette résidence.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      <th className="pb-2.5">Bâtiment</th>
                      <th className="pb-2.5">Étages</th>
                      <th className="pb-2.5">Logements</th>
                      <th className="pb-2.5">Sous-Admin Délégué</th>
                      <th className="pb-2.5 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {batiments.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/60 transition">
                        <td className="py-2.5 font-bold text-ink">{b.nom}</td>
                        <td className="py-2.5 text-stone-500">{b.etages} étages</td>
                        <td className="py-2.5 text-stone-600 font-medium">{b.appartements.length} apts</td>
                        <td className="py-2.5">
                          {b.sousAdmin ? (
                            <Pill tone="dark">{fullName(b.sousAdmin)}</Pill>
                          ) : (
                            <Pill tone="warning">Non délégué</Pill>
                          )}
                        </td>
                        <td className="py-2.5 text-end">
                          <Link href="/dashboard/residences" className="font-semibold text-brand hover:underline">
                            Gérer
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/residences"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Accéder aux tableaux détaillés des blocs et appartements</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>

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
          <div className="my-3 grid grid-cols-3 gap-2 text-center text-xs">
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
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Derniers règlements enregistrés</p>
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

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/finances"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Consulter l&apos;historique complet ({paiements.length} encaissements)</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      {/* 5. Assemblées Générales & Maintenance Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Card: Assemblées Générales (AG) & Quorum des Tantièmes */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ScrollText className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-base font-bold text-ink">Gouvernance & Assemblée Générale</h2>
                <p className="text-xs text-stone-500">Délibérations, votes des copropriétaires & quorum</p>
              </div>
            </div>
            <Link href="/dashboard/assemblees" className="text-xs font-semibold text-brand hover:underline">
              Gérer →
            </Link>
          </div>

          <div className="my-4 flex-1 space-y-4">
            <div className="rounded-xl border border-stone-100 bg-stone-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Prochaine Session</span>
                <Pill tone="brand">En cours</Pill>
              </div>
              <p className="mt-1.5 font-bold text-ink">Assemblée Générale Ordinaire Annuelle (2026)</p>
              <p className="mt-1 text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-stone-400" aria-hidden />
                20 Novembre 2026 · Hall d&apos;Honneur & Salle Polyvalente - Bloc A
              </p>

              <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-stone-600">Quorum des tantièmes atteint</span>
                  <span className="text-emerald-600">745 / 1000 (74.5%)</span>
                </div>
                <ProgressBar value={74.5} label="Quorum tantièmes" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 border border-stone-100 rounded-xl p-3 bg-white">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                Procès-verbal (PV) certifié conforme
              </span>
              <Link href="/dashboard/assemblees" className="font-bold text-brand hover:underline">
                Mode Vidéoprojection →
              </Link>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/assemblees"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Accéder aux résolutions et résultats de vote</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
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
          <div className="my-3 grid grid-cols-3 gap-2 text-center text-xs">
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
                {incidents.slice(0, 3).map((i) => (
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

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/maintenance"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Ouvrir le registre des interventions</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      {/* 6. Secondary Operations Grid (Annonces, Residents, Personnel) */}
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
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Résidents & Logements */}
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
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
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
              <ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>

      {/* 7. Governance, Contracts, Rapports & Configuration Grid */}
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
                    <div className="text-end">
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
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Card: Configuration, Moyens de Paiement & Rapports */}
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

            {/* Quick Export Shortcuts */}
            <div className="border-t border-stone-100 pt-3">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-stone-400">Rapports & Exports Rapides</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/dashboard/rapports"
                  className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 font-semibold text-ink hover:border-brand/40 hover:bg-stone-50 transition"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600" aria-hidden />
                    Bilan Financier (CSV)
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 rtl:rotate-180" aria-hidden />
                </Link>
                <Link
                  href="/dashboard/rapports"
                  className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50/50 p-2.5 font-semibold text-ink hover:border-brand/40 hover:bg-stone-50 transition"
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" aria-hidden />
                    Annuaire Copropriétaires
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 rtl:rotate-180" aria-hidden />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-3">
            <Link
              href="/dashboard/configuration"
              className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-brand transition"
            >
              <span>Modifier les types de charges et délais SLA</span>
              <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
