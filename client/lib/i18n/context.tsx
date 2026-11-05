"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Locale, Translations } from "./types";
import { fr } from "./locales/fr";
import { ar } from "./locales/ar";
import { en } from "./locales/en";

const dictionaries: Record<Locale, Translations> = {
  fr,
  ar,
  en,
};

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  t: Translations;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (n: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18N_STORAGE_KEY = "city_locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  // Initialize from localStorage or document lang
  useEffect(() => {
    try {
      const saved = localStorage.getItem(I18N_STORAGE_KEY) as Locale | null;
      if (saved && (saved === "fr" || saved === "ar" || saved === "en")) {
        setLocaleState(saved);
      } else {
        // Check navigator
        const navLang = navigator.language.slice(0, 2);
        if (navLang === "ar") setLocaleState("ar");
        else if (navLang === "en") setLocaleState("en");
      }
    } catch {
      // ignore SSR or storage errors
    }
  }, []);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    try {
      localStorage.setItem(I18N_STORAGE_KEY, newLoc);
      document.cookie = `${I18N_STORAGE_KEY}=${newLoc}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  const isRTL = locale === "ar";
  const dir: "ltr" | "rtl" = isRTL ? "rtl" : "ltr";

  // Sync document attributes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir]);

  const t = dictionaries[locale] || fr;

  const formatCurrency = useMemo(() => {
    return (amount: number) => {
      const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }).format(amount || 0);

      if (locale === "ar") {
        return `${formatted} د.ج`;
      }
      return `${formatted} DZD`;
    };
  }, [locale]);

  const formatDate = useMemo(() => {
    return (date: string | number | Date, options?: Intl.DateTimeFormatOptions) => {
      try {
        const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
        if (isNaN(d.getTime())) return "";
        const loc = locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US";
        return new Intl.DateTimeFormat(loc, options || { day: "numeric", month: "short", year: "numeric" }).format(d);
      } catch {
        return String(date);
      }
    };
  }, [locale]);

  const formatNumber = useMemo(() => {
    return (n: number) => {
      const loc = locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-FR" : "en-US";
      return new Intl.NumberFormat(loc).format(n || 0);
    };
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      dir,
      isRTL,
      setLocale,
      t,
      formatCurrency,
      formatDate,
      formatNumber,
    }),
    [locale, dir, isRTL, t, formatCurrency, formatDate, formatNumber]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      locale: "fr",
      dir: "ltr",
      isRTL: false,
      setLocale: () => {},
      t: fr,
      formatCurrency: (amount: number) => `${new Intl.NumberFormat("fr-FR").format(amount || 0)} DZD`,
      formatDate: (date: string | number | Date) => String(date),
      formatNumber: (n: number) => String(n),
    };
  }
  return context;
}
