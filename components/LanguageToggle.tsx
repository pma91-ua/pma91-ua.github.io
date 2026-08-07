"use client";

import { useLanguage } from "@/lib/language-context";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label="Toggle language"
      className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
    >
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
