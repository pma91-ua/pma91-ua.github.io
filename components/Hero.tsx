"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";

export function Hero() {
  const { content } = useLanguage();
  return (
    <section
      id="about"
      className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:flex-row sm:text-left"
    >
      <Image
        src="/profile-photo.jpg"
        alt={content.hero.photoAlt}
        width={160}
        height={160}
        className="h-40 w-40 shrink-0 rounded-full object-cover"
        priority
      />
      <div>
        <p className="text-sm uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {content.hero.greeting}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{content.hero.name}</h1>
        <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-300">{content.hero.bio}</p>
        <a
          href="/cv-pablo-mira-amante.pdf"
          download
          className="mt-6 inline-block rounded-full bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          {content.hero.downloadCv}
        </a>
      </div>
    </section>
  );
}
