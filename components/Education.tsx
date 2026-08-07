"use client";

import { useLanguage } from "@/lib/language-context";

export function Education() {
  const { content } = useLanguage();
  return (
    <section id="education" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-2xl font-bold">{content.education.heading}</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {content.education.entries.map((entry) => (
          <li key={entry.title} className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
            <h3 className="font-semibold">{entry.title}</h3>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{entry.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
