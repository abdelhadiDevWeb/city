"use client";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  CreditCard,
  FileSignature,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  PhoneCall,
  Plus,
  Receipt,
  Scale,
  ScrollText,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  User,
  UserCog,
  UserPlus,
  Users,
  Vote,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useSession } from "./session";
import { primaryRole } from "@/lib/roles";
import { useI18n } from "@/lib/i18n";

type CommandItem = {
  id: string;
  category: "Navigation" | "Actions Rapides" | "Copropriétaires & Lots";
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  keywords?: string[];
  badge?: string;
};

export function CommandPalette({
  isOpen,
  onClose,
  onOpenEmergency,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency?: () => void;
}) {
  const router = useRouter();
  const { account } = useSession();
  const { t, tText } = useI18n();
  const role = primaryRole(account);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      // Navigation
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Tableau de bord",
        subtitle: "Vue d'ensemble et indicateurs clés",
        icon: LayoutDashboard,
        href: "/dashboard",
        keywords: ["accueil", "home", "stats", "kpi"],
      },
      {
        id: "nav-residences",
        category: "Navigation",
        title: "Bâtiments & Sous-Admins",
        subtitle: "Gestion des blocs, étages et responsables de bâtiment",
        icon: Building2,
        href: role === "super_admin" ? "/dashboard/ajouter-residence" : "/dashboard/residences",
        keywords: ["immeuble", "bloc", "résidence", "appartements"],
      },
      {
        id: "nav-residents",
        category: "Navigation",
        title: "Résidents & Copropriétaires",
        subtitle: "Répertoire des occupants, propriétaires et locataires",
        icon: Users,
        href: "/dashboard/residents",
        keywords: ["habitants", "copropriétaires", "locataires", "contacts"],
      },
      {
        id: "nav-finances",
        category: "Navigation",
        title: "Finances & Charges",
        subtitle: "Encaissements, impayés, recouvrement et bilan annuel",
        icon: Wallet,
        href: "/dashboard/finances",
        keywords: ["paiements", "charges", "cotisations", "edahabia", "budget", "recouvrement"],
      },
      {
        id: "nav-assemblees",
        category: "Navigation",
        title: "Assemblées Générales (AG)",
        subtitle: "Convocations, calcul du quorum en tantièmes et votes",
        icon: ScrollText,
        href: "/dashboard/assemblees",
        keywords: ["ag", "vote", "résolution", "procès-verbal", "pv", "quorum"],
        badge: "Nouveau",
      },
      {
        id: "nav-maintenance",
        category: "Navigation",
        title: "Maintenance & Pannes",
        subtitle: "Suivi des incidents, pannes d'équipement et réparations",
        icon: Wrench,
        href: "/dashboard/maintenance",
        keywords: ["panne", "ascenseur", "fuite", "réparation", "incident", "bâche à eau"],
      },
      {
        id: "nav-personnel",
        category: "Navigation",
        title: "Personnel & Tâches",
        subtitle: "Employés de la résidence et ordres de mission",
        icon: UserCog,
        href: "/dashboard/personnel",
        keywords: ["gardiens", "agents", "nettoyage", "missions", "salaires"],
      },
      {
        id: "nav-annonces",
        category: "Navigation",
        title: "Annonces & Alertes",
        subtitle: "Communications officielles et notifications urgentes",
        icon: Megaphone,
        href: "/dashboard/annonces",
        keywords: ["alertes", "messages", "panneau", "information"],
      },
      {
        id: "nav-documents",
        category: "Navigation",
        title: "Documents & Coffre-fort",
        subtitle: "Contrats prestataires et archives certifiées",
        icon: FolderOpen,
        href: "/dashboard/documents",
        keywords: ["contrats", "archives", "règlement", "notarial", "pdf"],
      },
      {
        id: "nav-rapports",
        category: "Navigation",
        title: "Rapports & Exports",
        subtitle: "Exportations périodiques Excel, CSV et bilans",
        icon: FileText,
        href: "/dashboard/rapports",
        keywords: ["export", "excel", "csv", "bilan"],
      },

      // Actions Rapides
      {
        id: "act-paiement",
        category: "Actions Rapides",
        title: "Enregistrer un paiement de charges",
        subtitle: "Générer une quittance officielle imprimable ou WhatsApp",
        icon: Receipt,
        href: "/dashboard/finances",
        keywords: ["encaisser", "cotisation", "quittance"],
      },
      {
        id: "act-relance",
        category: "Actions Rapides",
        title: "Relancer les impayés (Mise en demeure)",
        subtitle: "Sommation officielle de 15 jours et envoi WhatsApp",
        icon: ShieldAlert,
        href: "/dashboard/finances",
        keywords: ["retard", "recouvrement", "dette", "avocat", "sommation"],
      },
      {
        id: "act-ag",
        category: "Actions Rapides",
        title: "Convoquer une Assemblée Générale (AG)",
        subtitle: "Fixer la date, l'ordre du jour et lancer les convocations",
        icon: CalendarDays,
        href: "/dashboard/assemblees",
        keywords: ["réunion", "copropriétaires", "résolutions"],
      },
      {
        id: "act-incident",
        category: "Actions Rapides",
        title: "Signaler un incident avec preuve photo",
        subtitle: "Enregistrer une fuite, ampoules ou anomalie avec image",
        icon: Wrench,
        href: "/dashboard/maintenance",
        keywords: ["fuite", "photo", "dégât", "anomalie"],
      },
      {
        id: "act-resident",
        category: "Actions Rapides",
        title: "Ajouter un nouveau copropriétaire / résident",
        subtitle: "Créer la fiche résident et assigner le lot",
        icon: UserPlus,
        href: "/dashboard/residents",
        keywords: ["nouvel occupant", "propriétaire", "locataire"],
      },
      {
        id: "act-urgence",
        category: "Actions Rapides",
        title: "Numéros d'Urgence 24h/24",
        subtitle: "Sonelgaz (3303), Protection Civile (14), Astreinte Ascenseur",
        icon: PhoneCall,
        action: () => {
          onClose();
          if (onOpenEmergency) onOpenEmergency();
        },
        keywords: ["secours", "pompiers", "urgence", "police", "samu", "gaz"],
        badge: "Urgence",
      },

      // Copropriétaires d'exemple / Lots
      {
        id: "copro-1",
        category: "Copropriétaires & Lots",
        title: "M. Salim Amrani",
        subtitle: "Bloc A · Appartement A-12 (32 Tantièmes)",
        icon: User,
        href: "/dashboard/residents",
        keywords: ["amrani", "salim", "a12", "a-12", "bloc a"],
      },
      {
        id: "copro-2",
        category: "Copropriétaires & Lots",
        title: "Mme Karima Benali",
        subtitle: "Bloc B · Appartement B-04 (28 Tantièmes)",
        icon: User,
        href: "/dashboard/residents",
        keywords: ["benali", "karima", "b04", "b-04", "bloc b"],
      },
      {
        id: "copro-3",
        category: "Copropriétaires & Lots",
        title: "M. Reda Mansouri",
        subtitle: "Bloc C · Appartement C-08 (35 Tantièmes)",
        icon: User,
        href: "/dashboard/residents",
        keywords: ["mansouri", "reda", "c08", "c-08", "bloc c"],
      },
      {
        id: "copro-4",
        category: "Copropriétaires & Lots",
        title: "M. Mohamed Touati",
        subtitle: "Bloc C · Appartement C-02 (25 Tantièmes)",
        icon: User,
        href: "/dashboard/residents",
        keywords: ["touati", "mohamed", "c02", "c-02", "bloc c"],
      },
    ];

    return list;
  }, [role, onClose, onOpenEmergency]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = item.subtitle.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSub || matchCat || matchKeywords;
    });
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
        return;
      }

      if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected.action) {
          selected.action();
        } else if (selected.href) {
          router.push(selected.href);
          onClose();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recherche rapide"
      className="fixed inset-0 z-50 flex items-start justify-center bg-ink/50 backdrop-blur-xs p-4 pt-16 sm:pt-24 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-brand" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tText("Rechercher une page, un résident, un appartement ou une action...")}
            className="w-full bg-transparent text-sm text-ink placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500 sm:inline-block border border-stone-200">
            {tText("Échap")}
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500">
              <Search className="mx-auto h-7 w-7 text-stone-300 mb-2" />
              <p className="font-semibold text-ink">{tText("Aucun résultat trouvé")}</p>
              <p className="mt-1 text-stone-400">{tText("Essayez avec un autre mot-clé (ex: « finances », « ascenseur », « amrani »...)")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.href) {
                        router.push(item.href);
                        onClose();
                      }
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-start text-xs transition ${
                      isSelected ? "bg-stone-100 text-ink" : "text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                          isSelected
                            ? "bg-brand text-white shadow-xs"
                            : item.category === "Actions Rapides"
                            ? "bg-orange-50 text-brand"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink truncate">{tText(item.title)}</span>
                          {item.badge && (
                            <span className="rounded bg-brand/10 px-1.5 py-0.2 text-[9px] font-extrabold text-brand uppercase">
                              {tText(item.badge)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 truncate">{tText(item.subtitle)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden text-[10px] font-medium text-stone-400 sm:inline">
                        {tText(item.category)}
                      </span>
                      {isSelected && <ArrowRight className="h-3.5 w-3.5 text-brand rtl:rotate-180" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-4 py-2 text-[11px] text-stone-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-stone-200 bg-white px-1 py-0.5 text-[9px] font-bold">↑</kbd>{" "}
              <kbd className="rounded border border-stone-200 bg-white px-1 py-0.5 text-[9px] font-bold">↓</kbd> {tText("Naviguer")}
            </span>
            <span>
              <kbd className="rounded border border-stone-200 bg-white px-1 py-0.5 text-[9px] font-bold">↵</kbd> {tText("Ouvrir")}
            </span>
          </div>
          <span className="font-mono text-[10px] text-stone-400">City Syndic Spotlight</span>
        </div>
      </div>
    </div>
  );
}

