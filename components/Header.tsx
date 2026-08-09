"use client";

import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { content } = useLanguage();
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-col">
          <span className="font-semibold">{content.hero.name}</span>
          <div className="hidden gap-3 text-xs text-neutral-600 dark:text-neutral-400 sm:flex">
            <a href={`mailto:${content.contact.email}`} className="hover:text-emerald-700 dark:hover:text-emerald-400">
              {content.contact.email}
            </a>
            <a
              href={`tel:+34${content.contact.phone.replace(/\s+/g, "")}`}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {content.contact.phone}
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-xs sm:gap-6 sm:text-sm">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-emerald-700 dark:hover:text-emerald-400"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
