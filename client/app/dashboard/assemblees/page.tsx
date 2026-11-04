"use client";

import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Gavel,
  History,
  Hourglass,
  Layers,
  Maximize2,
  Minimize2,
  Percent,
  Plus,
  Printer,
  ScrollText,
  Search,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
  Tv,
  Users2,
  Vote,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { formatDZD } from "@/lib/format";
import { ModalActions, SelectField, formText, useSubmit } from "../forms";
import {
  ActionGroup,
  Avatar,
  DataTable,
  ExportPeriodToolbar,
  FacetFilter,
  Field,
  FormError,
  Modal,
  Mono,
  PageHeader,
  Pill,
  Tabs,
  button,
  card,
  downloadCsv,
  useToast,
  type Column,
  type TabItem,
  type Tone,
} from "../ui";

type TabId = "sessions" | "resolutions";

export type MajoriteType = "Art. 24 (Majorité simple)" | "Art. 25 (Majorité absolue)" | "Art. 26 (Double majorité)";

export type AssembleeSession = {
  id: string;
  titre: string;
  type: "AGO" | "AGE";
  date: string;
  heure: string;
  lieu: string;
  quorumTantiemes: number;
  quorumTotal: number;
  presidentsSeance: string;
  scrutateurs: string;
  secretaire: string;
  statut: "Convoquée" | "En cours" | "Clôturée";
  ordreDuJour: string[];
};

export type Resolution = {
  id: string;
  sessionId: string;
  numero: number;
  titre: string;
  description: string;
  majoriteRequise: MajoriteType;
  pourTantiemes: number;
  contreTantiemes: number;
  abstentionTantiemes: number;
  pourVotes: number;
  contreVotes: number;
  abstentionVotes: number;
  totalVotants: number;
  statut: "Approuvée" | "Rejetée" | "En cours";
};

const INITIAL_SESSIONS: AssembleeSession[] = [
  {
    id: "ag-2026",
    titre: "Assemblée Générale Ordinaire Annuelle (Exercice 2026)",
    type: "AGO",
    date: "2026-11-20",
    heure: "18:00",
    lieu: "Hall d'Honneur & Salle Polyvalente - Bloc A",
    quorumTantiemes: 745,
    quorumTotal: 1000,
    presidentsSeance: "M. Salim Amrani (Copropriétaire Apt A-12)",
    scrutateurs: "Mme Karima Benali (B-04) & M. Reda Mansouri (C-08)",
    secretaire: "Direction du Syndic City",
    statut: "En cours",
    ordreDuJour: [
      "1. Vérification des présences, pouvoirs et validation du quorum des tantièmes",
      "2. Élection du bureau de séance (Président, 2 scrutateurs et secrétaire)",
      "3. Rapport d'activité du Syndic et compte de gestion de l'exercice N",
      "4. Approbation des comptes de l'exercice et affectation du solde de trésorerie",
      "5. Vote du budget prévisionnel pour l'exercice N+1",
      "6. Travaux de modernisation de l'interphonie et digicode des halls",
      "7. Fixation du montant de la provision pour le Fonds de Travaux obligatoire (10%)",
      "8. Renouvellement du mandat des membres du Conseil Syndical",
    ],
  },
  {
    id: "ag-2025",
    titre: "Assemblée Générale Extraordinaire - Remplacement Bâche à Eau",
    type: "AGE",
    date: "2025-06-15",
    heure: "19:00",
    lieu: "Esplanade Centrale de la Résidence",
    quorumTantiemes: 810,
    quorumTotal: 1000,
    presidentsSeance: "M. Mohamed Touati (Apt C-02)",
    scrutateurs: "Mme Leila Hadj (A-06) & M. Yacine Kaci (B-11)",
    secretaire: "Direction du Syndic City",
    statut: "Clôturée",
    ordreDuJour: [
      "1. Approbation du devis de remplacement de la pompe de relevage bâche à eau",
      "2. Appel de fonds exceptionnel pour travaux urgents",
    ],
  },
];

const INITIAL_RESOLUTIONS: Resolution[] = [
  {
    id: "res-1",
    sessionId: "ag-2026",
    numero: 1,
    titre: "Approbation des comptes de l'exercice écoulé et quitus au Syndic",
    description: "Approbation du bilan financier, des dépenses courantes et des relevés de comptes présentés par le Syndic.",
    majoriteRequise: "Art. 24 (Majorité simple)",
    pourTantiemes: 685,
    contreTantiemes: 40,
    abstentionTantiemes: 20,
    pourVotes: 32,
    contreVotes: 2,
    abstentionVotes: 1,
    totalVotants: 35,
    statut: "Approuvée",
  },
  {
    id: "res-2",
    sessionId: "ag-2026",
    numero: 2,
    titre: "Vote du budget prévisionnel N+1 d'un montant de 2 550 000 DZD",
    description: "Fixation des charges communes ordinaires et appels trimestriels pour l'année à venir.",
    majoriteRequise: "Art. 24 (Majorité simple)",
    pourTantiemes: 650,
    contreTantiemes: 65,
    abstentionTantiemes: 30,
    pourVotes: 30,
    contreVotes: 3,
    abstentionVotes: 2,
    totalVotants: 35,
    statut: "Approuvée",
  },
  {
    id: "res-3",
    sessionId: "ag-2026",
    numero: 3,
    titre: "Modernisation des platines d'interphonie et digicodes des Blocs A, B et C",
    description: "Devis sélectionné auprès de la société SécuriTech Algérie pour un montant total de 420 000 DZD.",
    majoriteRequise: "Art. 25 (Majorité absolue)",
    pourTantiemes: 580,
    contreTantiemes: 110,
    abstentionTantiemes: 55,
    pourVotes: 26,
    contreVotes: 6,
    abstentionVotes: 3,
    totalVotants: 35,
    statut: "Approuvée",
  },
  {
    id: "res-4",
    sessionId: "ag-2026",
    numero: 4,
    titre: "Installation de caméras supplémentaires de vidéosurveillance sur le parking",
    description: "Renforcement de la couverture surveillance de la rampe de parking sous-sol et abords.",
    majoriteRequise: "Art. 25 (Majorité absolue)",
    pourTantiemes: 470,
    contreTantiemes: 220,
    abstentionTantiemes: 55,
    pourVotes: 19,
    contreVotes: 12,
    abstentionVotes: 4,
    totalVotants: 35,
    statut: "En cours",
  },
  {
    id: "res-5",
    sessionId: "ag-2026",
    numero: 5,
    titre: "Dotation du Fonds de Travaux légal obligatoire à hauteur de 10%",
    description: "Constitution de la réserve financière pluriannuelle pour gros travaux et toiture conformément aux règlements.",
    majoriteRequise: "Art. 24 (Majorité simple)",
    pourTantiemes: 710,
    contreTantiemes: 25,
    abstentionTantiemes: 10,
    pourVotes: 33,
    contreVotes: 1,
    abstentionVotes: 1,
    totalVotants: 35,
    statut: "Approuvée",
  },
  {
    id: "res-6",
    sessionId: "ag-2026",
    numero: 6,
    titre: "Interdiction de stationnement des véhicules non autorisés dans l'allée centrale",
    description: "Mise en fourrière ou sabot pour tout véhicule encombrant les voies d'accès pompiers et ambulance.",
    majoriteRequise: "Art. 24 (Majorité simple)",
    pourTantiemes: 735,
    contreTantiemes: 10,
    abstentionTantiemes: 0,
    pourVotes: 34,
    contreVotes: 1,
    abstentionVotes: 0,
    totalVotants: 35,
    statut: "Approuvée",
  },
];

export default function AssembleesPage() {
  const notify = useToast();
  const [tab, setTab] = useState<TabId>("sessions");

  const [sessions, setSessions] = useState<AssembleeSession[]>(INITIAL_SESSIONS);
  const [resolutions, setResolutions] = useState<Resolution[]>(INITIAL_RESOLUTIONS);

  const [selectedSessionForPv, setSelectedSessionForPv] = useState<AssembleeSession | null>(null);
  const [votingResolution, setVotingResolution] = useState<Resolution | null>(null);

  const [addingSession, setAddingSession] = useState(false);
  const [addingResolution, setAddingResolution] = useState(false);
  const [projectionMode, setProjectionMode] = useState(false);
  const [currentResIndex, setCurrentResIndex] = useState(0);

  const [query, setQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<"all" | "en_cours" | "cloturee" | "convoquee">("all");

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const [startDate, setStartDate] = useState(`${now.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!projectionMode) return;
      if (e.key === "Escape") {
        setProjectionMode(false);
      } else if (e.key === "ArrowRight") {
        setCurrentResIndex((prev) => (prev < resolutions.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentResIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [projectionMode, resolutions.length]);

  const tabs: TabItem<TabId>[] = [
    { id: "sessions", label: "Sessions d'AG & Convocations", icon: ScrollText, count: sessions.length },
    { id: "resolutions", label: "Votes des Résolutions", icon: Vote, count: resolutions.length },
  ];

  const activeSession = sessions[0];
  const quorumPct = activeSession ? Math.round((activeSession.quorumTantiemes / activeSession.quorumTotal) * 100) : 0;
  const quorumAtteint = quorumPct >= 50;

  const totalResolutionsApprouvees = resolutions.filter((r) => r.statut === "Approuvée").length;
  const totalResolutionsEnCours = resolutions.filter((r) => r.statut === "En cours").length;

  function handleVote(resId: string, type: "pour" | "contre" | "abstention", tantiemesVote: number) {
    setResolutions((prev) =>
      prev.map((r) => {
        if (r.id !== resId) return r;
        const newPour = type === "pour" ? r.pourTantiemes + tantiemesVote : r.pourTantiemes;
        const newContre = type === "contre" ? r.contreTantiemes + tantiemesVote : r.contreTantiemes;
        const newAbs = type === "abstention" ? r.abstentionTantiemes + tantiemesVote : r.abstentionTantiemes;
        const newPourVotes = type === "pour" ? r.pourVotes + 1 : r.pourVotes;
        const newContreVotes = type === "contre" ? r.contreVotes + 1 : r.contreVotes;
        const newAbsVotes = type === "abstention" ? r.abstentionVotes + 1 : r.abstentionVotes;
        const totalTantiemesVotes = newPour + newContre;

        let statut: "Approuvée" | "Rejetée" | "En cours" = r.statut;
        if (r.majoriteRequise.includes("Art. 24")) {
          statut = newPour > newContre ? "Approuvée" : "Rejetée";
        } else if (r.majoriteRequise.includes("Art. 25")) {
          statut = newPour > 500 ? "Approuvée" : "En cours";
        }

        return {
          ...r,
          pourTantiemes: newPour,
          contreTantiemes: newContre,
          abstentionTantiemes: newAbs,
          pourVotes: newPourVotes,
          contreVotes: newContreVotes,
          abstentionVotes: newAbsVotes,
          totalVotants: r.totalVotants + 1,
          statut,
        };
      }),
    );
    notify(`Votre vote « ${type.toUpperCase()} » (${tantiemesVote} tantièmes) a été comptabilisé avec succès.`);
    setVotingResolution(null);
  }

  function handleExportCsv() {
    if (tab === "sessions") {
      const rows = sessions.map((s) => ({
        Titre: s.titre,
        Type: s.type,
        Date: s.date,
        Heure: s.heure,
        Lieu: s.lieu,
        "Quorum (Tantièmes)": `${s.quorumTantiemes} / ${s.quorumTotal}`,
        Statut: s.statut,
        "Président de séance": s.presidentsSeance,
      }));
      downloadCsv(rows, `assemblees-generales-${startDate}_${endDate}.csv`);
      notify("Export CSV des sessions d'AG généré.");
    } else {
      const rows = resolutions.map((r) => ({
        "N°": r.numero,
        Titre: r.titre,
        Description: r.description,
        "Majorité requise": r.majoriteRequise,
        "Pour (Tantièmes)": r.pourTantiemes,
        "Contre (Tantièmes)": r.contreTantiemes,
        "Abstention (Tantièmes)": r.abstentionTantiemes,
        "Total Votants": r.totalVotants,
        Résultat: r.statut,
      }));
      downloadCsv(rows, `resolutions-votes-${startDate}_${endDate}.csv`);
      notify("Export CSV des votes de résolutions généré.");
    }
  }

  const sessionColumns: Column<AssembleeSession>[] = [
    {
      header: "Session d'Assemblée Générale",
      cell: (s) => (
        <div>
          <span className="block font-bold text-ink">{s.titre}</span>
          <span className="block text-xs text-stone-500">
            {s.type === "AGO" ? "Assemblée Générale Ordinaire (Annuelle)" : "Assemblée Générale Extraordinaire"}
          </span>
        </div>
      ),
    },
    {
      header: "Date & Lieu",
      cell: (s) => (
        <div>
          <span className="block font-medium text-stone-700">{s.date} à {s.heure}</span>
          <span className="block text-xs text-stone-500">{s.lieu}</span>
        </div>
      ),
    },
    {
      header: "Quorum Tantièmes",
      cell: (s) => {
        const pct = Math.round((s.quorumTantiemes / s.quorumTotal) * 100);
        return (
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
              <span>{s.quorumTantiemes} / {s.quorumTotal}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${pct >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                {pct}%
              </span>
            </div>
            <span className="text-[10px] text-stone-400">
              {pct >= 50 ? "Quorum légal réuni (Art. 24)" : "Quorum insuffisant (2e convocation)"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Statut",
      cell: (s) => {
        const tone: Tone = s.statut === "Clôturée" ? "success" : s.statut === "En cours" ? "brand" : "warning";
        return <Pill tone={tone}>{s.statut}</Pill>;
      },
    },
    {
      header: "Actions",
      align: "right",
      cell: (s) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedSessionForPv(s)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-brand" aria-hidden />
            PV d&apos;AG Officiel
          </button>
        </div>
      ),
    },
  ];

  const resolutionColumns: Column<Resolution>[] = [
    {
      header: "Résolution & Ordre du Jour",
      cell: (r) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-100 text-[10px] font-black text-ink">
              {r.numero}
            </span>
            <span className="font-bold text-ink">{r.titre}</span>
          </div>
          <p className="mt-0.5 text-xs text-stone-500 line-clamp-1 max-w-md">{r.description}</p>
        </div>
      ),
    },
    {
      header: "Majorité Requise",
      cell: (r) => <Pill tone={r.majoriteRequise.includes("Art. 24") ? "neutral" : "brand"}>{r.majoriteRequise}</Pill>,
    },
    {
      header: "Répartition des Tantièmes",
      cell: (r) => {
        const total = r.pourTantiemes + r.contreTantiemes + r.abstentionTantiemes;
        const pctPour = total > 0 ? Math.round((r.pourTantiemes / total) * 100) : 0;
        return (
          <div className="space-y-1 min-w-[150px]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-700 font-bold">{r.pourTantiemes} Pour ({pctPour}%)</span>
              <span className="text-red-700 font-semibold">{r.contreTantiemes} Contre</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200 flex">
              <div style={{ width: `${pctPour}%` }} className="bg-emerald-500" />
              <div style={{ width: `${100 - pctPour}%` }} className="bg-red-400" />
            </div>
            <p className="text-[10px] text-stone-400">{r.totalVotants} copropriétaires ayant voté</p>
          </div>
        );
      },
    },
    {
      header: "Résultat du Vote",
      cell: (r) => {
        const tone: Tone = r.statut === "Approuvée" ? "success" : r.statut === "Rejetée" ? "danger" : "warning";
        return <Pill tone={tone}>{r.statut}</Pill>;
      },
    },
    {
      header: "Action",
      align: "right",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setVotingResolution(r)}
          className={button("primary", "sm")}
        >
          <Vote className="h-3.5 w-3.5" aria-hidden />
          Voter
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ScrollText}
        title="Assemblées Générales & Votes en Ligne"
        subtitle="Convocations des copropriétaires, calcul du quorum en tantièmes, vote des résolutions et PV certifié"
        actions={
          <>
            <button
              type="button"
              onClick={() => setProjectionMode(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-900 hover:bg-indigo-100 transition shadow-xs"
              title="Lancer le mode projection plein écran pour grand écran ou vidéo-projecteur"
            >
              <Tv className="h-4 w-4 text-indigo-600" aria-hidden />
              Mode Projection AG
            </button>
            <button type="button" onClick={() => setAddingSession(true)} className={button("secondary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Convoquer une AG
            </button>
            <button type="button" onClick={() => setAddingResolution(true)} className={button("primary")}>
              <Plus className="h-4 w-4" aria-hidden />
              Nouvelle Résolution
            </button>
          </>
        }
      />

      {/* AG Executive KPI Strip */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
            <span>Prochaine AG Planifiée</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-brand">
              <CalendarDays className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 text-base font-extrabold tracking-tight text-ink">
            {activeSession ? `${activeSession.date} · ${activeSession.heure}` : "Aucune AG en cours"}
          </p>
          <p className="mt-1 text-xs text-stone-500 truncate">{activeSession?.lieu || "À définir"}</p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
            <span>Quorum des Tantièmes</span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${quorumAtteint ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              <Percent className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{quorumPct}%</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="font-mono text-stone-500">{activeSession?.quorumTantiemes} / {activeSession?.quorumTotal} Tantièmes</span>
            <span className={`font-semibold ${quorumAtteint ? "text-emerald-700" : "text-red-700"}`}>
              {quorumAtteint ? "Quorum Réuni" : "Quorum Non Atteint"}
            </span>
          </div>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
            <span>Résolutions Adoptées</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">
            {totalResolutionsApprouvees} / {resolutions.length}
          </p>
          <p className="mt-1 text-xs text-stone-500">
            {totalResolutionsEnCours} résolution(s) en cours de délibération
          </p>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-stone-500">
            <span>Feuille d&apos;Émargement</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
              <Users2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">36 Copropriétaires</p>
          <p className="mt-1 text-xs text-stone-500">Présents en séance ou avec procuration</p>
        </div>
      </div>

      <ExportPeriodToolbar
        startDate={startDate}
        endDate={endDate}
        onPeriodChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
        onExportCsv={handleExportCsv}
        onPrint={() => window.print()}
        title="Période des Assemblées"
      />

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === "sessions" && (
        <DataTable
          columns={sessionColumns}
          rows={sessions}
          rowKey={(s) => s.id}
          empty="Aucune session d'Assemblée Générale planifiée."
        />
      )}

      {tab === "resolutions" && (
        <DataTable
          columns={resolutionColumns}
          rows={resolutions}
          rowKey={(r) => r.id}
          empty="Aucune résolution soumise à l'ordre du jour."
        />
      )}

      {/* Modal: Official Procès-Verbal (PV d'AG) */}
      {selectedSessionForPv && (
        <Modal
          title="Procès-Verbal Officiel d'Assemblée Générale (PV d'AG)"
          description="Document juridique certifié consignant l'ensemble des votes, délibérations et résolutions de la copropriété."
          onClose={() => setSelectedSessionForPv(null)}
        >
          <div id="pv-ag-print" className="space-y-6 text-sm text-stone-800">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white font-black text-sm">C</span>
                  <span className="text-base font-extrabold tracking-tight text-ink">CITY SYNDIC</span>
                </div>
                <h3 className="mt-2 font-extrabold text-base text-ink">{selectedSessionForPv.titre}</h3>
                <p className="text-xs text-stone-500">
                  Tenue le {selectedSessionForPv.date} à {selectedSessionForPv.heure} · {selectedSessionForPv.lieu}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  PV OFFICIEL CERTIFIÉ
                </span>
                <p className="mt-1 font-mono text-xs text-stone-400">Réf : PV-AG-{selectedSessionForPv.date.slice(0, 4)}</p>
              </div>
            </div>

            {/* Bureau de Séance & Quorum */}
            <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-stone-50 p-4 border border-stone-200 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-stone-500">Bureau de Séance Élu</p>
                <p className="mt-1 text-stone-700"><strong>Président de séance : </strong>{selectedSessionForPv.presidentsSeance}</p>
                <p className="mt-0.5 text-stone-700"><strong>Scrutateurs : </strong>{selectedSessionForPv.scrutateurs}</p>
                <p className="mt-0.5 text-stone-700"><strong>Secrétaire : </strong>{selectedSessionForPv.secretaire}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-stone-500">Constat de la Représentation & Quorum</p>
                <p className="mt-1 text-stone-700">
                  Total tantièmes représentés : <strong className="font-mono text-emerald-700">{selectedSessionForPv.quorumTantiemes} / {selectedSessionForPv.quorumTotal}</strong>
                </p>
                <p className="mt-0.5 text-stone-600">
                  Le quorum légal de la moitié au moins des tantièmes de la copropriété étant réuni, l&apos;Assemblée Générale est déclarée régulièrement constituée et peut valablement délibérer.
                </p>
              </div>
            </div>

            {/* Resolutions details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Délibérations & Résultats des Votes par Résolution
              </h4>
              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden">
                {resolutions.map((res) => (
                  <div key={res.id} className="p-3.5 bg-white text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-ink">
                        Résolution n°{res.numero} : {res.titre}
                      </p>
                      <Pill tone={res.statut === "Approuvée" ? "success" : res.statut === "Rejetée" ? "danger" : "warning"}>
                        {res.statut}
                      </Pill>
                    </div>
                    <p className="text-stone-500 text-[11px]">{res.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-stone-600 pt-1">
                      <span className="text-emerald-700 font-semibold">Pour : {res.pourTantiemes} tantièmes ({res.pourVotes} voix)</span>
                      <span className="text-red-700 font-semibold">Contre : {res.contreTantiemes} tantièmes ({res.contreVotes} voix)</span>
                      <span className="text-stone-500">Abstention : {res.abstentionTantiemes} tantièmes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures zone */}
            <div className="grid gap-4 sm:grid-cols-3 border-t border-stone-200 pt-4 text-xs text-stone-600">
              <div>
                <p className="font-bold text-ink">Le Président de Séance</p>
                <div className="mt-2 h-14 w-full rounded border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400 italic">
                  Signature
                </div>
              </div>
              <div>
                <p className="font-bold text-ink">Les Scrutateurs</p>
                <div className="mt-2 h-14 w-full rounded border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400 italic">
                  Signatures
                </div>
              </div>
              <div>
                <p className="font-bold text-ink">Le Secrétaire (Syndic)</p>
                <div className="mt-2 h-14 w-full rounded border border-dashed border-stone-300 flex items-center justify-center text-[10px] text-stone-400 italic">
                  Cachet & Signature
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-stone-200 pt-4 print:hidden">
              <button type="button" onClick={() => setSelectedSessionForPv(null)} className={button("secondary")}>
                Fermer
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className={button("primary")}
              >
                <Printer className="h-4 w-4" aria-hidden />
                Imprimer le PV Officiel (PDF)
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Interactive Vote on a Resolution */}
      {votingResolution && (
        <Modal
          title={`Vote : Résolution n°${votingResolution.numero}`}
          description={votingResolution.titre}
          onClose={() => setVotingResolution(null)}
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
              <p className="text-stone-700 leading-relaxed">{votingResolution.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Majorité requise :</span>
                <Pill>{votingResolution.majoriteRequise}</Pill>
              </div>
            </div>

            <p className="font-bold text-ink text-sm">Sélectionnez votre vote en tant que copropriétaire :</p>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleVote(votingResolution.id, "pour", 25)}
                className="flex flex-col items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 hover:bg-emerald-100 transition shadow-xs"
              >
                <ThumbsUp className="h-6 w-6 text-emerald-600" />
                <span className="font-bold text-sm">Voter POUR</span>
                <span className="text-[10px] text-emerald-700 font-mono">+25 tantièmes</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote(votingResolution.id, "contre", 25)}
                className="flex flex-col items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 hover:bg-red-100 transition shadow-xs"
              >
                <ThumbsDown className="h-6 w-6 text-red-600" />
                <span className="font-bold text-sm">Voter CONTRE</span>
                <span className="text-[10px] text-red-700 font-mono">+25 tantièmes</span>
              </button>

              <button
                type="button"
                onClick={() => handleVote(votingResolution.id, "abstention", 25)}
                className="flex flex-col items-center gap-2 rounded-xl border border-stone-300 bg-stone-50 p-4 text-stone-800 hover:bg-stone-100 transition shadow-xs"
              >
                <Hourglass className="h-6 w-6 text-stone-500" />
                <span className="font-bold text-sm">S&apos;ABSTENIR</span>
                <span className="text-[10px] text-stone-500 font-mono">+25 tantièmes</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Convoquer une AG */}
      {addingSession && (
        <Modal
          title="Convoquer une Assemblée Générale"
          description="Planification de la session d'AG et convocation des copropriétaires avec ordre du jour"
          onClose={() => setAddingSession(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const newSess: AssembleeSession = {
                id: `ag-${Date.now()}`,
                titre: formText(form, "titre"),
                type: formText(form, "type") === "AGE" ? "AGE" : "AGO",
                date: formText(form, "date"),
                heure: formText(form, "heure") || "18:00",
                lieu: formText(form, "lieu") || "Hall d'honneur",
                quorumTantiemes: 0,
                quorumTotal: 1000,
                presidentsSeance: "À désigner en début de séance",
                scrutateurs: "À élire en séance",
                secretaire: "Syndic de copropriété",
                statut: "Convoquée",
                ordreDuJour: ["1. Vérification du quorum", "2. Élection du bureau", "3. Approbation des résolutions"],
              };
              setSessions([newSess, ...sessions]);
              setAddingSession(false);
              notify("Assemblée Générale convoquée avec succès.");
            }}
            className="space-y-4"
          >
            <Field label="Titre de l'Assemblée Générale" name="titre" required defaultValue="Assemblée Générale Extraordinaire" autoFocus />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Type d'Assemblée" name="type" defaultValue="AGO">
                <option value="AGO">AGO · Assemblée Générale Ordinaire Annuelle</option>
                <option value="AGE">AGE · Assemblée Générale Extraordinaire</option>
              </SelectField>
              <Field label="Lieu de tenue" name="lieu" required defaultValue="Salle de réunion / Hall principal" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date de l'AG" name="date" type="date" required defaultValue="2026-12-10" />
              <Field label="Heure de convocation" name="heure" type="time" required defaultValue="18:30" />
            </div>
            <ModalActions submitting={false} label="Envoyer les Convocations" onCancel={() => setAddingSession(false)} />
          </form>
        </Modal>
      )}

      {/* Modal: Nouvelle Résolution */}
      {addingResolution && (
        <Modal
          title="Soumettre une Résolution à l'Ordre du Jour"
          description="Création d'un projet de résolution à soumettre au vote des copropriétaires"
          onClose={() => setAddingResolution(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const newRes: Resolution = {
                id: `res-${Date.now()}`,
                sessionId: sessions[0]?.id || "ag-2026",
                numero: resolutions.length + 1,
                titre: formText(form, "titre"),
                description: formText(form, "description") || formText(form, "titre"),
                majoriteRequise: formText(form, "majorite") as MajoriteType,
                pourTantiemes: 0,
                contreTantiemes: 0,
                abstentionTantiemes: 0,
                pourVotes: 0,
                contreVotes: 0,
                abstentionVotes: 0,
                totalVotants: 0,
                statut: "En cours",
              };
              setResolutions([...resolutions, newRes]);
              setAddingResolution(false);
              notify("Résolution ajoutée à l'ordre du jour avec succès.");
            }}
            className="space-y-4"
          >
            <Field label="Titre de la résolution" name="titre" required placeholder="Ex: Travaux d'étanchéité terrasse Bloc B" autoFocus />
            <Field label="Description détaillée & Motivation" name="description" placeholder="Ex: Remplacement du complexe d'étanchéité suite à infiltration..." />
            <SelectField label="Majorité requise par la Loi" name="majorite" defaultValue="Art. 24 (Majorité simple)">
              <option value="Art. 24 (Majorité simple)">Art. 24 · Majorité simple (Entretien courant, budget)</option>
              <option value="Art. 25 (Majorité absolue)">Art. 25 · Majorité absolue (Travaux importants, contrats)</option>
              <option value="Art. 26 (Double majorité)">Art. 26 · Double majorité (Modification du règlement)</option>
            </SelectField>
            <ModalActions submitting={false} label="Inscrire la Résolution" onCancel={() => setAddingResolution(false)} />
          </form>
        </Modal>
      )}
      {/* MODE PROJECTION PLEIN ÉCRAN / VIDÉOPROJECTEUR */}
      {projectionMode && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-stone-950 p-6 sm:p-10 text-white overflow-y-auto animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white font-black text-base shadow-lg">
                C
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-brand font-black">
                    CITY SYNDIC PROJECTION
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    SÉANCE EN DIRECT
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">{activeSession?.titre}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-stone-800 bg-stone-900/90 px-4 py-2 text-right">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Quorum Constaté
                </span>
                <span className="font-mono text-lg font-black text-emerald-400">
                  {activeSession?.quorumTantiemes} / {activeSession?.quorumTotal} Tantièmes ({quorumPct}%)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProjectionMode(false)}
                className="flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 hover:text-white transition"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Quitter (Échap)</span>
              </button>
            </div>
          </div>

          {/* Current Resolution Center Stage */}
          {resolutions[currentResIndex] && (() => {
            const currentRes = resolutions[currentResIndex];
            const totalTantiemes = currentRes.pourTantiemes + currentRes.contreTantiemes + currentRes.abstentionTantiemes;
            const pctPour = totalTantiemes > 0 ? Math.round((currentRes.pourTantiemes / totalTantiemes) * 100) : 0;
            const pctContre = totalTantiemes > 0 ? Math.round((currentRes.contreTantiemes / totalTantiemes) * 100) : 0;

            return (
              <div className="my-8 max-w-5xl mx-auto w-full space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-black text-sm">
                      {currentRes.numero}
                    </span>
                    <span className="text-sm font-mono text-stone-400 uppercase tracking-widest">
                      Résolution {currentResIndex + 1} sur {resolutions.length}
                    </span>
                  </div>
                  <span className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-1 text-xs font-mono font-bold text-brand">
                    {currentRes.majoriteRequise}
                  </span>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                    {currentRes.titre}
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-4xl">
                    {currentRes.description}
                  </p>
                </div>

                {/* Big Visual Voting Gauge */}
                <div className="rounded-2xl border border-stone-800 bg-stone-900/80 p-6 space-y-5 shadow-2xl">
                  <div className="grid gap-4 sm:grid-cols-3 text-center">
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                        VOTES POUR
                      </span>
                      <span className="mt-1 block font-mono text-3xl sm:text-4xl font-black text-emerald-400">
                        {currentRes.pourTantiemes} <span className="text-lg">({pctPour}%)</span>
                      </span>
                      <span className="text-xs text-stone-400">{currentRes.pourVotes} copropriétaire(s)</span>
                    </div>

                    <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-red-400">
                        VOTES CONTRE
                      </span>
                      <span className="mt-1 block font-mono text-3xl sm:text-4xl font-black text-red-400">
                        {currentRes.contreTantiemes} <span className="text-lg">({pctContre}%)</span>
                      </span>
                      <span className="text-xs text-stone-400">{currentRes.contreVotes} copropriétaire(s)</span>
                    </div>

                    <div className="rounded-xl border border-stone-700 bg-stone-900 p-4">
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                        ABSTENTION
                      </span>
                      <span className="mt-1 block font-mono text-3xl sm:text-4xl font-black text-stone-300">
                        {currentRes.abstentionTantiemes}
                      </span>
                      <span className="text-xs text-stone-400">{currentRes.abstentionVotes} copropriétaire(s)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-5 w-full overflow-hidden rounded-full bg-stone-800 flex shadow-inner">
                    <div style={{ width: `${pctPour}%` }} className="bg-emerald-500 transition-all duration-300" />
                    <div style={{ width: `${pctContre}%` }} className="bg-red-500 transition-all duration-300" />
                  </div>

                  {/* Direct Voting Buttons for the Presiding Bureau */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-4">
                    <span className="text-xs text-stone-400 font-mono">
                      Comptabiliser un vote en direct (+25 tantièmes) :
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleVote(currentRes.id, "pour", 25)}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        + POUR
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVote(currentRes.id, "contre", 25)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        + CONTRE
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVote(currentRes.id, "abstention", 25)}
                        className="inline-flex items-center gap-2 rounded-xl bg-stone-700 px-4 py-2 text-xs font-bold text-white hover:bg-stone-600 transition"
                      >
                        <Hourglass className="h-4 w-4" />
                        + ABSTENTION
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resolution Carousel Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={currentResIndex === 0}
                    onClick={() => setCurrentResIndex((prev) => Math.max(0, prev - 1))}
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Résolution Précédente</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {resolutions.map((r, i) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setCurrentResIndex(i)}
                        className={`h-2.5 rounded-full transition-all ${
                          i === currentResIndex ? "w-8 bg-brand" : "w-2.5 bg-stone-700 hover:bg-stone-500"
                        }`}
                        title={`Résolution ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentResIndex === resolutions.length - 1}
                    onClick={() => setCurrentResIndex((prev) => Math.min(resolutions.length - 1, prev + 1))}
                    className="inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-bold text-stone-300 hover:bg-stone-800 disabled:opacity-40 transition"
                  >
                    <span>Résolution Suivante</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Bottom Bar Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-4 text-xs text-stone-400 font-mono">
            <div>
              <span>Séance présidée par : </span>
              <strong className="text-white">{activeSession?.presidentsSeance}</strong>
            </div>
            <div>
              <span>Secrétariat : </span>
              <strong className="text-white">{activeSession?.secretaire}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

