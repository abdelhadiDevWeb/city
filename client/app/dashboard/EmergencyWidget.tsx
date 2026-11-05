"use client";

import { useI18n } from "@/lib/i18n";
import {
  AlertTriangle,
  Building2,
  Check,
  Copy,
  Flame,
  LifeBuoy,
  MessageCircle,
  Phone,
  PhoneCall,
  Shield,
  ShieldAlert,
  Siren,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui";

type EmergencyContact = {
  nom: string;
  service: string;
  numero: string;
  disponible: string;
  icon: typeof Siren;
  color: string;
  isNational?: boolean;
};

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    nom: "Protection Civile",
    service: "Pompiers, Secours & Incendie",
    numero: "14",
    disponible: "24h/24 · Gratuit",
    icon: Flame,
    color: "bg-red-50 text-red-600 border-red-200",
    isNational: true,
  },
  {
    nom: "Sonelgaz Urgence",
    service: "Fuite de Gaz & Panne Électricité",
    numero: "3303",
    disponible: "24h/24 · National",
    icon: Siren,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    isNational: true,
  },
  {
    nom: "SAMU Médical",
    service: "Urgences Médicales & Ambulances",
    numero: "115",
    disponible: "24h/24 · National",
    icon: LifeBuoy,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    isNational: true,
  },
  {
    nom: "Police / Sûreté",
    service: "Intervention & Sécurité Publique",
    numero: "17",
    disponible: "24h/24 · Gratuit",
    icon: Shield,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    isNational: true,
  },
  {
    nom: "Astreinte Ascenseurs",
    service: "SARL Otis Algérie (Contrat Résidence)",
    numero: "0560123456",
    disponible: "Astreinte 24/7 · Blocage cabine",
    icon: Wrench,
    color: "bg-stone-50 text-stone-700 border-stone-200",
  },
  {
    nom: "Plomberie Colonnes",
    service: "Plomberie Express (Fuite générale)",
    numero: "0661987654",
    disponible: "Intervention d'urgence sous 2h",
    icon: Wrench,
    color: "bg-stone-50 text-stone-700 border-stone-200",
  },
  {
    nom: "Poste de Sécurité",
    service: "Gardiennage & Accueil Résidence",
    numero: "0555443322",
    disponible: "Poste central Hall principal",
    icon: Building2,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function EmergencyWidget({
  isOpenExternal,
  onCloseExternal,
}: {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}) {
  const { tText, locale } = useI18n();
  const notify = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (onCloseExternal && !val) onCloseExternal();
    setInternalOpen(val);
  };

  function copyToClipboard(numero: string, nom: string) {
    void navigator.clipboard.writeText(numero);
    setCopiedNumber(numero);
    notify(`${tText("Numéro copié")} : ${nom} (${numero})`);
    setTimeout(() => setCopiedNumber(null), 2500);
  }

  return (
    <aside aria-label={tText("Numéros d'urgence & astreinte 24h/24")} className="fixed bottom-5 end-5 z-40 max-w-[calc(100vw-2rem)]">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 rounded-full border border-red-300 bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-red-600/30 transition hover:bg-red-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          title={tText("Numéros d'urgence & astreinte 24h/24")}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          <Siren className="h-4 w-4" aria-hidden />
          <span className="tracking-wide">{tText("Urgences 24/7")}</span>
        </button>
      )}

      {/* Floating Emergency Popover Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={tText("Numéros d'urgence & astreinte 24h/24")}
          className="w-[320px] sm:w-[380px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-2xl animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 bg-red-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                <Siren className="h-4 w-4 text-white" />
              </span>
              <div>
                <h2 className="text-xs font-black uppercase tracking-wide">{tText("Urgences 24/7")}</h2>
                <p className="text-[10px] text-white/80">{locale === "ar" ? "أرقام النجدة والمداومة للإقامة" : locale === "en" ? "Emergency & residence on-call numbers" : "Secours d'urgence & astreinte résidence"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick numbers list */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100 p-2">
            {EMERGENCY_CONTACTS.map((item) => {
              const Icon = item.icon;
              const isCopied = copiedNumber === item.numero;
              return (
                <div key={item.numero + item.nom} className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-ink text-xs truncate">{tText(item.nom)}</span>
                        {item.isNational && (
                          <span className="rounded bg-red-100 px-1 py-0.2 text-[9px] font-bold text-red-700">
                            {locale === "ar" ? "وطني" : locale === "en" ? "National" : "National"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 truncate">{tText(item.service)}</p>
                      <p className="text-[10px] font-semibold text-emerald-700">{tText(item.disponible)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.numero, item.nom)}
                      className="rounded-lg border border-stone-200 bg-white p-1.5 text-stone-500 hover:bg-stone-100 hover:text-ink transition"
                      title={tText("Copier")}
                    >
                      {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <a
                      href={`tel:${item.numero}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                      title={`${tText("Appeler")} ${item.nom}`}
                    >
                      <Phone className="h-3 w-3" />
                      <span>{item.numero}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer banner */}
          <div className="border-t border-stone-200 bg-stone-50 p-3 text-center text-[10px] text-stone-500">
            {locale === "ar" ? (
              <>في حالات الخطر المباشر، اتصل فوراً بـ <strong className="text-red-700">14 (الحماية المدنية)</strong> أو <strong className="text-amber-700">3303 (الغاز والكهرباء)</strong>.</>
            ) : locale === "en" ? (
              <>In case of immediate danger, call <strong className="text-red-700">14 (Civil Protection)</strong> or <strong className="text-amber-700">3303 (Gas & Electricity)</strong> first.</>
            ) : (
              <>En cas de danger immédiat, composez en priorité le <strong className="text-red-700">14 (Protection Civile)</strong> ou le <strong className="text-amber-700">3303 (Gaz)</strong>.</>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

