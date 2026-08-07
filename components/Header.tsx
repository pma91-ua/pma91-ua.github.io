"use client";

import { useLanguage } from "@/lib/language-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {
  const { content } = useLanguage();
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <span className="font-semibold">{content.hero.name}</span>
        <nav className="flex flex-wrap items-center gap-3 text-xs sm:gap-6 sm:text-sm">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-emerald-600 dark:hover:text-emerald-400"
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
