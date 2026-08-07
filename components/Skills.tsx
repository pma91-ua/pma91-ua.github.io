"use client";

import { useLanguage } from "@/lib/language-context";

export function Skills() {
  const { content } = useLanguage();
  return (
    <section id="skills" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-2xl font-bold">{content.skills.heading}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {content.skills.categories.map((category) => (
          <div key={category.category}>
            <h3 className="font-semibold text-neutral-500 dark:text-neutral-400">
              {category.category}
            </h3>
            <ul className="mt-3 space-y-2">
              {category.items.map((item) => (
                <li key={item.name} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {item.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
