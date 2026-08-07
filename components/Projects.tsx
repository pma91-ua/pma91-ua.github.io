"use client";

import { useLanguage } from "@/lib/language-context";
import type { Project } from "@/lib/content";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-200 p-5 dark:border-neutral-800">
      <div>
        <h3 className="font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {project.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const { content } = useLanguage();
  return (
    <section id="projects" className="mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-2xl font-bold">{content.projects.heading}</h2>
      <div className="mt-8 space-y-10">
        {content.projects.groups.map((group) => (
          <div key={group.groupTitle}>
            <h3 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">
              {group.groupTitle}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.items.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
