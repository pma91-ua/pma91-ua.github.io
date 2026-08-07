"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import es from "@/content/es.json";
import en from "@/content/en.json";

type Locale = "es" | "en";

const DICTIONARIES: Record<Locale, SiteContent> = {
  es: es as SiteContent,
  en: en as SiteContent,
};

interface LanguageContextValue {
  locale: Locale;
  content: SiteContent;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "cv-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "es";
  return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = () => setLocale((l) => (l === "es" ? "en" : "es"));

  return (
    <LanguageContext.Provider value={{ locale, content: DICTIONARIES[locale], toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
