"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n, Locale } from "@/lib/i18n";
import { Globe, Check } from "lucide-react";

const languages: { code: Locale; label: string; nativeName: string; flag: string }[] = [
  { code: "fr", label: "FR", nativeName: "Français", flag: "🇫🇷" },
  { code: "ar", label: "عربي", nativeName: "العربية", flag: "🇩🇿" },
  { code: "en", label: "EN", nativeName: "English", flag: "🇬🇧" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Changer de langue / Change language / تغيير اللغة"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
      >
        <span className="text-base leading-none" role="img" aria-label={currentLang.nativeName}>
          {currentLang.flag}
        </span>
        {!compact && <span className="font-medium">{currentLang.label}</span>}
        <Globe className="w-3.5 h-3.5 text-slate-400 ms-0.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-44 origin-top-right rounded-xl bg-white dark:bg-slate-900 p-1.5 shadow-xl ring-1 ring-black/5 dark:ring-white/10 z-50 border border-slate-100 dark:border-slate-800 animate-in fade-in-50 zoom-in-95 duration-100`}
        >
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {locale === "ar" ? "اختر اللغة" : locale === "fr" ? "Langue / Language" : "Select Language"}
          </div>
          <div className="space-y-0.5">
            {languages.map((lang) => {
              const active = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-start ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {active && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function LanguageSegmentedControl() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700/80 w-full">
      {languages.map((lang) => {
        const active = lang.code === locale;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLocale(lang.code)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
              active
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span className="text-sm">{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </button>
        );
      })}
    </div>
  );
}

