"use client";

import { useLanguage } from "@/lib/language-context";

export function Contact() {
  const { content } = useLanguage();
  return (
    <section id="contact" className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h2 className="text-2xl font-bold">{content.contact.heading}</h2>
      <div className="mt-6 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-center sm:gap-8">
        <a
          href={`mailto:${content.contact.email}`}
          className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400"
        >
          {content.contact.email}
        </a>
        <a
          href={`tel:${content.contact.phone.replace(/\s+/g, "")}`}
          className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400"
        >
          {content.contact.phone}
        </a>
        <span className="text-neutral-600 dark:text-neutral-300">{content.contact.city}</span>
        <a
          href={content.contact.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400"
        >
          {content.contact.githubLabel}
        </a>
      </div>
    </section>
  );
}
