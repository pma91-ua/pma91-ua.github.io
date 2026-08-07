"use client";

import { useLanguage } from "@/lib/language-context";

export function Experience() {
  const { content } = useLanguage();
  return (
    <section id="experience" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-2xl font-bold">{content.experience.heading}</h2>
      <ol className="mt-8 space-y-6 border-l border-neutral-200 pl-6 dark:border-neutral-800">
        {content.experience.entries.map((entry) => (
          <li key={`${entry.role}-${entry.place}`} className="relative">
            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-600" />
            <p className="text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {entry.period}
            </p>
            <h3 className="font-semibold">
              {entry.role} · {entry.place}
            </h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{entry.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
