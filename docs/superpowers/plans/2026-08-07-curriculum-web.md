# Currículum Web (Pablo Mira Amante) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (ES/EN), light/dark, single-page CV website from `CV Pablo Mira Amante 2026.pdf`, deployable as a static site to GitHub Pages at `https://pma91-ua.github.io/`.

**Architecture:** Next.js (App Router) with `output: 'export'` producing pure static HTML/CSS/JS — no server, no API routes. Two React Context providers (`ThemeProvider`, `LanguageProvider`) supply theme and locale to presentational section components, which read all copy from JSON dictionaries. GitHub Actions builds and deploys `out/` to GitHub Pages on every push to `main`.

**Tech Stack:** Next.js 15 (App Router, TypeScript), React 19, Tailwind CSS 3 (class-based dark mode), Vitest + React Testing Library for unit tests, GitHub Actions (`actions/deploy-pages`).

## Global Constraints

- Static export only — `output: 'export'` in `next.config.ts`. No server components requiring a runtime, no API routes, no `next/image` optimization (`images.unoptimized: true`).
- Never reintroduce DNI, exact street address, or birth date anywhere in the site or its content files — the approved spec (`docs/superpowers/specs/2026-08-07-curriculum-web-design.md`) restricts public personal data to name, city, email, and phone.
- Every user-facing string lives in `content/es.json` or `content/en.json` — never hardcode copy inside a component.
- Accent color is Tailwind `emerald` (`emerald-600` in light mode / `emerald-400` in dark mode) — used consistently for links, CTAs, and tags. No other accent colors.
- Dark mode uses Tailwind's `class` strategy toggled on `<html>` — not the `media` strategy — so the manual toggle can override system preference.
- No contact form, no analytics, no custom domain, no blog/extra pages (per spec's "Fuera de alcance").
- Repo name is `pma91-ua.github.io` (GitHub user/root site) — final URL has no subpath.

---

## File Structure

```
package.json                         # deps + scripts (dev/build/test)
tsconfig.json                        # TS config, @/* path alias
next.config.ts                       # output: 'export', images.unoptimized
tailwind.config.ts                   # darkMode: 'class', content globs
postcss.config.js
vitest.config.ts                     # jsdom environment, react plugin
vitest.setup.ts                      # jest-dom matchers + matchMedia polyfill
.gitignore

app/
  layout.tsx                         # RootLayout: providers, fonts, no-FOUC script
  page.tsx                           # Home: composes Header + all sections
  globals.css                        # tailwind directives + body base styles

content/
  es.json                            # Spanish copy (source of truth for shape)
  en.json                            # English copy (same shape as es.json)

lib/
  content.ts                         # SiteContent TypeScript types
  theme-context.tsx                  # ThemeProvider, useTheme
  language-context.tsx               # LanguageProvider, useLanguage

components/
  Header.tsx
  ThemeToggle.tsx
  LanguageToggle.tsx
  Hero.tsx
  Projects.tsx
  Experience.tsx
  Education.tsx
  Skills.tsx
  Contact.tsx

tests/
  content.test.ts                    # es/en structural parity
  theme-context.test.tsx
  language-context.test.tsx

public/
  profile-photo.jpg                  # cropped from CV PDF, 480x480
  cv-pablo-mira-amante.pdf           # copy of the redacted CV (download target)

.github/workflows/deploy.yml         # build + deploy to GitHub Pages
README.md
```

---

### Task 1: Project scaffolding (Next.js, TypeScript, Tailwind, Vitest, static export)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `.gitignore`
- Create: `app/globals.css`
- Create: `app/layout.tsx` (temporary minimal version — replaced in Task 13)
- Create: `app/page.tsx` (temporary minimal version — replaced in Task 13)

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm test` scripts. `out/` directory after build. Path alias `@/*` → project root, used by every later task's imports.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "curriculum-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "jsdom": "^24.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: completes without errors, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 5: Create `tailwind.config.ts` and `postcss.config.js`**

`tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
};

export default config;
```

`postcss.config.js`:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 7: Create temporary `app/layout.tsx` and `app/page.tsx`**

These prove the toolchain works end-to-end. Task 13 replaces both with the final versions that wire in providers and all sections.

`app/layout.tsx`:
```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:
```tsx
export default function Home() {
  return <div className="p-8 text-2xl font-bold text-emerald-600">CV en construcción</div>;
}
```

- [ ] **Step 8: Create `vitest.config.ts` and `vitest.setup.ts`**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
```

- [ ] **Step 9: Create `.gitignore`**

```
node_modules/
.next/
out/
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 10: Verify the build**

Run: `npm run build`
Expected: succeeds, creates `out/index.html` containing "CV en construcción".

Run: `npx vitest --version`
Expected: prints a version number (confirms the test runner is installed and configured, even with zero test files so far).

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.js vitest.config.ts vitest.setup.ts .gitignore app/
git commit -m "chore: scaffold Next.js static-export project with Tailwind and Vitest"
```

---

### Task 2: Content data model (types + ES/EN dictionaries + parity test)

**Files:**
- Create: `lib/content.ts`
- Create: `content/es.json`
- Create: `content/en.json`
- Test: `tests/content.test.ts`

**Interfaces:**
- Consumes: nothing from prior tasks (pure data layer).
- Produces: `SiteContent` TypeScript type (exported from `lib/content.ts`), plus `Project`, `ExperienceEntry`, `EducationEntry`, `SkillItem`, `SkillCategory`, `NavItem`, `ProjectLink` types. `content/es.json` and `content/en.json` both conform to `SiteContent` and are consumed via `useLanguage()` starting in Task 5.

- [ ] **Step 1: Write the failing test**

`tests/content.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import es from "../content/es.json";
import en from "../content/en.json";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(shape);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, shape(v)])
    );
  }
  return typeof value;
}

describe("content parity", () => {
  it("es.json and en.json expose the same structure", () => {
    expect(shape(es)).toEqual(shape(en));
  });

  it("every project group has at least one item", () => {
    for (const group of es.projects.groups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("contact info excludes DNI, exact address, and birth date fields", () => {
    const contactKeys = Object.keys(es.contact);
    expect(contactKeys).not.toContain("dni");
    expect(contactKeys).not.toContain("address");
    expect(contactKeys).not.toContain("birthDate");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/content.test.ts`
Expected: FAIL — `content/es.json` and `content/en.json` do not exist yet.

- [ ] **Step 3: Create `lib/content.ts`**

```ts
export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
}

export interface ProjectGroup {
  groupTitle: string;
  items: Project[];
}

export interface ExperienceEntry {
  period: string;
  role: string;
  place: string;
  description: string;
}

export interface EducationEntry {
  title: string;
  detail: string;
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  meta: {
    title: string;
    languageName: string;
  };
  nav: NavItem[];
  hero: {
    greeting: string;
    name: string;
    bio: string;
    downloadCv: string;
    photoAlt: string;
  };
  projects: {
    heading: string;
    groups: ProjectGroup[];
  };
  experience: {
    heading: string;
    entries: ExperienceEntry[];
  };
  education: {
    heading: string;
    entries: EducationEntry[];
  };
  skills: {
    heading: string;
    categories: SkillCategory[];
  };
  contact: {
    heading: string;
    email: string;
    phone: string;
    city: string;
    githubUrl: string;
    githubLabel: string;
  };
}
```

- [ ] **Step 4: Create `content/es.json`**

```json
{
  "meta": {
    "title": "Pablo Mira Amante — Currículum",
    "languageName": "Español"
  },
  "nav": [
    { "label": "Sobre mí", "href": "#about" },
    { "label": "Proyectos", "href": "#projects" },
    { "label": "Experiencia", "href": "#experience" },
    { "label": "Formación", "href": "#education" },
    { "label": "Skills", "href": "#skills" },
    { "label": "Contacto", "href": "#contact" }
  ],
  "hero": {
    "greeting": "Hola, soy",
    "name": "Pablo Mira Amante",
    "bio": "Estudiante de Ingeniería Informática (162 créditos superados) con experiencia práctica en desarrollo de videojuegos, sistemas distribuidos y despliegue de IA en local. Combino una base técnica sólida en C/C++, Python y Java con curiosidad por explorar cada capa del stack, desde Assembly hasta interfaces de usuario. Usuario avanzado de Linux y entusiasta de las herramientas de IA aplicadas al desarrollo.",
    "downloadCv": "Descargar CV (PDF)",
    "photoAlt": "Foto de Pablo Mira Amante"
  },
  "projects": {
    "heading": "Proyectos",
    "groups": [
      {
        "groupTitle": "Game Jams",
        "items": [
          {
            "title": "Chromatophobia",
            "description": "Videojuego desarrollado durante una Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Jugar en itch.io", "url": "https://huguito2004.itch.io/chromatophobia" }]
          },
          {
            "title": "Chess Unbound",
            "description": "Videojuego desarrollado durante una Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Jugar en itch.io", "url": "https://sokamonta.itch.io/chess-unbound" }]
          },
          {
            "title": "A Gloomy Manor",
            "description": "Videojuego desarrollado durante una Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Jugar en itch.io", "url": "https://sokamonta.itch.io/a-gloomy-manor" }]
          }
        ]
      },
      {
        "groupTitle": "Proyectos personales",
        "items": [
          {
            "title": "Simulador de ecosistema",
            "description": "Videojuego en desarrollo que simula un ecosistema aplicando animación procedural, biodiversidad y toma de decisiones de los agentes mediante el algoritmo NEAT.",
            "tags": ["NEAT", "Animación procedural", "En curso"],
            "links": []
          },
          {
            "title": "Modpack de Minecraft",
            "description": "Modpack completo y personalizado enfocado en optimizar la generación de chunks en el servidor (alojado en mi propio ordenador) para mejorar el rendimiento, con shaders personalizados basados en uno ya existente.",
            "tags": ["Java", "Optimización", "Self-hosted"],
            "links": [{ "label": "Ver en GitHub", "url": "https://github.com/pma91-ua/Modpack-proyect/" }]
          },
          {
            "title": "Hosting local de IA open source",
            "description": "Despliegue de modelos de IA open source en un ordenador propio usando Ollama, Odysseus y Docker, con pruebas de optimización y rendimiento en un equipo con 12 GB de VRAM y 32 GB de RAM, con el objetivo de tener acceso desde el exterior.",
            "tags": ["Ollama", "Docker", "Self-hosted AI"],
            "links": []
          }
        ]
      },
      {
        "groupTitle": "Proyectos de universidad",
        "items": [
          {
            "title": "Plataforma de apuntes con IA",
            "description": "Página web estilo Wolah para subir apuntes de universidad, con un visor de IA integrado para generar tests, resúmenes y esquemas automáticamente.",
            "tags": ["IA", "Web", "Trabajo en equipo"],
            "links": [{ "label": "Ver en GitHub", "url": "https://github.com/pma91-ua/DSS-2025-G03-E04" }]
          },
          {
            "title": "Sistema distribuido de carga de coches eléctricos",
            "description": "Sistema distribuido basado en Kafka que simula peticiones para dar servicio a cargadores de coches eléctricos.",
            "tags": ["Kafka", "Sistemas distribuidos"],
            "links": [{ "label": "Ver en GitHub", "url": "https://github.com/pma91-ua/PracSD-EVCharging" }]
          },
          {
            "title": "Tokenizador, indexador y buscador",
            "description": "Desarrollo de un buscador completo con indexador y tokenizador propios, con el objetivo de hacerlo lo más eficiente posible.",
            "tags": ["Recuperación de información", "Eficiencia"],
            "links": [
              { "label": "Tokenizador e indexador", "url": "https://github.com/pma91-ua/Tokenizador-eIndexador_EI" },
              { "label": "Buscador", "url": "https://github.com/pma91-ua/BuscadorExplotacionInformacion" }
            ]
          }
        ]
      }
    ]
  },
  "experience": {
    "heading": "Experiencia",
    "entries": [
      {
        "period": "Verano",
        "role": "Peón agrícola",
        "place": "Parcelas agrícolas familiares",
        "description": "Recogida de fruta y hortalizas."
      },
      {
        "period": "Verano",
        "role": "Aprendiz",
        "place": "Empresa familiar de diseño y fabricación de equipos electrónicos",
        "description": "Tareas básicas de soldadura, montaje y programación."
      },
      {
        "period": "Verano",
        "role": "Aprendiz",
        "place": "Empresa familiar de informática",
        "description": "Venta, montaje y desmontaje de ordenadores."
      }
    ]
  },
  "education": {
    "heading": "Formación",
    "entries": [
      {
        "title": "Grado en Ingeniería Informática",
        "detail": "Cursando — 162 créditos superados. Matrícula del curso 2026-2027 ya realizada."
      },
      {
        "title": "Bachillerato de Ciencias y Tecnología",
        "detail": "Titulación académica completada."
      },
      {
        "title": "Educación profesional de música — Tuba tenor",
        "detail": "Quinto curso."
      },
      {
        "title": "Carnet de conducir B",
        "detail": "Obtenido."
      },
      {
        "title": "Inglés",
        "detail": "Pendiente de examen del C1 (conversación y escritura)."
      },
      {
        "title": "Valenciano",
        "detail": "Nivel alto (conversación y escritura). Hablante nativo."
      }
    ]
  },
  "skills": {
    "heading": "Skills",
    "categories": [
      {
        "category": "Sistemas operativos",
        "items": [
          { "name": "Windows", "level": "Avanzado" },
          { "name": "Linux", "level": "Avanzado" },
          { "name": "Unix BSD", "level": "Intermedio" }
        ]
      },
      {
        "category": "Lenguajes de programación",
        "items": [
          { "name": "C / C++", "level": "Avanzado" },
          { "name": "Python", "level": "Avanzado" },
          { "name": "GDScript", "level": "Avanzado" },
          { "name": "Java", "level": "Intermedio" },
          { "name": "Assembly", "level": "Intermedio" },
          { "name": "SQL", "level": "Intermedio" }
        ]
      },
      {
        "category": "IA y herramientas",
        "items": [
          { "name": "Claude Code", "level": "Avanzado" },
          { "name": "Ollama / hosting local de IA", "level": "Avanzado" },
          { "name": "Docker", "level": "Intermedio" }
        ]
      },
      {
        "category": "Motores de videojuegos",
        "items": [
          { "name": "Godot", "level": "Avanzado" },
          { "name": "Unity", "level": "Intermedio" }
        ]
      }
    ]
  },
  "contact": {
    "heading": "Contacto",
    "email": "pmiramante@outlook.es",
    "phone": "645 64 36 70",
    "city": "Alicante",
    "githubUrl": "https://github.com/pma91-ua",
    "githubLabel": "GitHub"
  }
}
```

- [ ] **Step 5: Create `content/en.json`**

```json
{
  "meta": {
    "title": "Pablo Mira Amante — Resume",
    "languageName": "English"
  },
  "nav": [
    { "label": "About", "href": "#about" },
    { "label": "Projects", "href": "#projects" },
    { "label": "Experience", "href": "#experience" },
    { "label": "Education", "href": "#education" },
    { "label": "Skills", "href": "#skills" },
    { "label": "Contact", "href": "#contact" }
  ],
  "hero": {
    "greeting": "Hi, I'm",
    "name": "Pablo Mira Amante",
    "bio": "Computer Engineering student (162 credits completed) with hands-on experience in game development, distributed systems, and self-hosted AI deployment. I combine a solid technical foundation in C/C++, Python, and Java with curiosity for every layer of the stack, from Assembly to user interfaces. Advanced Linux user and enthusiast of AI tooling applied to software development.",
    "downloadCv": "Download CV (PDF)",
    "photoAlt": "Photo of Pablo Mira Amante"
  },
  "projects": {
    "heading": "Projects",
    "groups": [
      {
        "groupTitle": "Game Jams",
        "items": [
          {
            "title": "Chromatophobia",
            "description": "Game built during a Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Play on itch.io", "url": "https://huguito2004.itch.io/chromatophobia" }]
          },
          {
            "title": "Chess Unbound",
            "description": "Game built during a Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Play on itch.io", "url": "https://sokamonta.itch.io/chess-unbound" }]
          },
          {
            "title": "A Gloomy Manor",
            "description": "Game built during a Game Jam.",
            "tags": ["Godot", "Game Jam"],
            "links": [{ "label": "Play on itch.io", "url": "https://sokamonta.itch.io/a-gloomy-manor" }]
          }
        ]
      },
      {
        "groupTitle": "Personal projects",
        "items": [
          {
            "title": "Ecosystem simulator",
            "description": "Game in progress simulating an ecosystem with procedural animation, biodiversity, and agent decision-making via the NEAT algorithm.",
            "tags": ["NEAT", "Procedural animation", "In progress"],
            "links": []
          },
          {
            "title": "Minecraft modpack",
            "description": "Full custom modpack focused on optimizing server-side chunk generation (self-hosted on my own computer) for better performance, with custom shaders based on an existing one.",
            "tags": ["Java", "Optimization", "Self-hosted"],
            "links": [{ "label": "View on GitHub", "url": "https://github.com/pma91-ua/Modpack-proyect/" }]
          },
          {
            "title": "Local open-source AI hosting",
            "description": "Deployment of open-source AI models on a personal machine using Ollama, Odysseus, and Docker, benchmarking performance and optimization on a 12 GB VRAM / 32 GB RAM setup, with the goal of exposing access externally.",
            "tags": ["Ollama", "Docker", "Self-hosted AI"],
            "links": []
          }
        ]
      },
      {
        "groupTitle": "University projects",
        "items": [
          {
            "title": "AI-powered notes platform",
            "description": "Wolah-style website for uploading university notes, with an integrated AI viewer that automatically generates tests, summaries, and outlines.",
            "tags": ["AI", "Web", "Team project"],
            "links": [{ "label": "View on GitHub", "url": "https://github.com/pma91-ua/DSS-2025-G03-E04" }]
          },
          {
            "title": "EV charging distributed system",
            "description": "Kafka-based distributed system simulating requests to serve electric vehicle charging stations.",
            "tags": ["Kafka", "Distributed systems"],
            "links": [{ "label": "View on GitHub", "url": "https://github.com/pma91-ua/PracSD-EVCharging" }]
          },
          {
            "title": "Tokenizer, indexer, and search engine",
            "description": "Full search engine built with a custom indexer and tokenizer, aimed at making it as efficient as possible.",
            "tags": ["Information retrieval", "Efficiency"],
            "links": [
              { "label": "Tokenizer & indexer", "url": "https://github.com/pma91-ua/Tokenizador-eIndexador_EI" },
              { "label": "Search engine", "url": "https://github.com/pma91-ua/BuscadorExplotacionInformacion" }
            ]
          }
        ]
      }
    ]
  },
  "experience": {
    "heading": "Experience",
    "entries": [
      {
        "period": "Summer",
        "role": "Farm laborer",
        "place": "Family agricultural land",
        "description": "Fruit and vegetable harvesting."
      },
      {
        "period": "Summer",
        "role": "Apprentice",
        "place": "Family business — electronics design & manufacturing",
        "description": "Basic soldering, assembly, and programming tasks."
      },
      {
        "period": "Summer",
        "role": "Apprentice",
        "place": "Family IT business",
        "description": "Computer sales, assembly, and disassembly."
      }
    ]
  },
  "education": {
    "heading": "Education",
    "entries": [
      {
        "title": "B.Sc. in Computer Engineering",
        "detail": "In progress — 162 credits completed. Already enrolled for the 2026-2027 academic year."
      },
      {
        "title": "Science & Technology Baccalaureate",
        "detail": "Completed."
      },
      {
        "title": "Professional Music Education — Tenor Tuba",
        "detail": "5th year."
      },
      {
        "title": "Driving license (Category B)",
        "detail": "Obtained."
      },
      {
        "title": "English",
        "detail": "C1 exam pending (conversation and writing)."
      },
      {
        "title": "Valencian (Catalan)",
        "detail": "Advanced level (conversation and writing). Native speaker."
      }
    ]
  },
  "skills": {
    "heading": "Skills",
    "categories": [
      {
        "category": "Operating systems",
        "items": [
          { "name": "Windows", "level": "Advanced" },
          { "name": "Linux", "level": "Advanced" },
          { "name": "Unix BSD", "level": "Intermediate" }
        ]
      },
      {
        "category": "Programming languages",
        "items": [
          { "name": "C / C++", "level": "Advanced" },
          { "name": "Python", "level": "Advanced" },
          { "name": "GDScript", "level": "Advanced" },
          { "name": "Java", "level": "Intermediate" },
          { "name": "Assembly", "level": "Intermediate" },
          { "name": "SQL", "level": "Intermediate" }
        ]
      },
      {
        "category": "AI & tooling",
        "items": [
          { "name": "Claude Code", "level": "Advanced" },
          { "name": "Ollama / local AI hosting", "level": "Advanced" },
          { "name": "Docker", "level": "Intermediate" }
        ]
      },
      {
        "category": "Game engines",
        "items": [
          { "name": "Godot", "level": "Advanced" },
          { "name": "Unity", "level": "Intermediate" }
        ]
      }
    ]
  },
  "contact": {
    "heading": "Contact",
    "email": "pmiramante@outlook.es",
    "phone": "645 64 36 70",
    "city": "Alicante, Spain",
    "githubUrl": "https://github.com/pma91-ua",
    "githubLabel": "GitHub"
  }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run tests/content.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add lib/content.ts content/es.json content/en.json tests/content.test.ts
git commit -m "feat: add bilingual content model with structural parity test"
```

---

### Task 3: Static assets — profile photo and downloadable CV

**Files:**
- Create: `public/profile-photo.jpg`
- Create: `public/cv-pablo-mira-amante.pdf`

**Interfaces:**
- Produces: `/profile-photo.jpg` (480x480 JPEG) referenced by Task 7 (`Hero`). `/cv-pablo-mira-amante.pdf` referenced by Task 7's download button.

- [ ] **Step 1: Extract and crop the profile photo from the CV PDF**

The CV PDF embeds a single 1200x1600 portrait photo on page 1. Extract it and crop a centered 900x900 head-and-shoulders square, then downscale to a web-friendly 480x480 JPEG:

```bash
mkdir -p /tmp/cv-photo-extract
pdfimages -j "CV Pablo Mira Amante 2026.pdf" /tmp/cv-photo-extract/photo
magick /tmp/cv-photo-extract/photo-000.ppm -crop 900x900+150+350 +repage -resize 480x480 -quality 85 public/profile-photo.jpg
```

(This exact crop geometry was tested against this specific PDF and centers the face and shoulders correctly.)

- [ ] **Step 2: Verify the photo**

Run: `identify public/profile-photo.jpg`
Expected: `public/profile-photo.jpg JPEG 480x480 480x480+0+0 8-bit sRGB ...`

- [ ] **Step 3: Copy the CV PDF as the downloadable asset**

```bash
cp "CV Pablo Mira Amante 2026.pdf" public/cv-pablo-mira-amante.pdf
```

- [ ] **Step 4: Verify the PDF copy**

Run: `file public/cv-pablo-mira-amante.pdf`
Expected: `public/cv-pablo-mira-amante.pdf: PDF document, ...`

- [ ] **Step 5: Commit**

```bash
git add public/profile-photo.jpg public/cv-pablo-mira-amante.pdf
git commit -m "feat: add cropped profile photo and downloadable CV asset"
```

---

### Task 4: Theme context (light/dark) with toggle

**Files:**
- Create: `lib/theme-context.tsx`
- Create: `components/ThemeToggle.tsx`
- Test: `tests/theme-context.test.tsx`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: `ThemeProvider({ children }): JSX.Element`, `useTheme(): { theme: "light" | "dark"; toggleTheme: () => void }`. `ThemeToggle(): JSX.Element` (no props — reads `useTheme()` itself). Consumed by Task 6 (`Header`) and Task 13 (`app/layout.tsx` wraps the tree in `ThemeProvider`).

- [ ] **Step 1: Write the failing test**

`tests/theme-context.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/lib/theme-context";

function Consumer() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("defaults to light when there is no stored preference and the system prefers light", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("light");
  });

  it("toggles the theme, persists it, and updates the html class", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
    expect(window.localStorage.getItem("cv-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("reads a previously stored theme on mount", () => {
    window.localStorage.setItem("cv-theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("dark");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/theme-context.test.tsx`
Expected: FAIL — `lib/theme-context.tsx` does not exist yet.

- [ ] **Step 3: Implement `lib/theme-context.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "cv-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/theme-context.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement `components/ThemeToggle.tsx`**

```tsx
"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/theme-context.tsx components/ThemeToggle.tsx tests/theme-context.test.tsx
git commit -m "feat: add theme context with light/dark toggle"
```

---

### Task 5: Language context (ES/EN) with toggle

**Files:**
- Create: `lib/language-context.tsx`
- Create: `components/LanguageToggle.tsx`
- Test: `tests/language-context.test.tsx`

**Interfaces:**
- Consumes: `SiteContent` type from `lib/content.ts` (Task 2), `content/es.json` and `content/en.json` (Task 2).
- Produces: `LanguageProvider({ children }): JSX.Element`, `useLanguage(): { locale: "es" | "en"; content: SiteContent; toggleLocale: () => void }`. `LanguageToggle(): JSX.Element`. `useLanguage()` is the hook every section component (Tasks 6–12) uses to read copy.

- [ ] **Step 1: Write the failing test**

`tests/language-context.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/lib/language-context";

function Consumer() {
  const { locale, content, toggleLocale } = useLanguage();
  return <button onClick={toggleLocale}>{locale}:{content.hero.name}</button>;
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to Spanish content", () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("es:Pablo Mira Amante");
  });

  it("toggles to English and persists the choice", () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("en:Pablo Mira Amante");
    expect(window.localStorage.getItem("cv-locale")).toBe("en");
  });

  it("reads a previously stored locale on mount", () => {
    window.localStorage.setItem("cv-locale", "en");
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByRole("button")).toHaveTextContent("en:Pablo Mira Amante");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/language-context.test.tsx`
Expected: FAIL — `lib/language-context.tsx` does not exist yet.

- [ ] **Step 3: Implement `lib/language-context.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/language-context.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement `components/LanguageToggle.tsx`**

```tsx
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
```

- [ ] **Step 6: Commit**

```bash
git add lib/language-context.tsx components/LanguageToggle.tsx tests/language-context.test.tsx
git commit -m "feat: add language context with ES/EN toggle"
```

---

### Task 6: Header component

**Files:**
- Create: `components/Header.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.nav` and `content.hero.name`; `ThemeToggle` (Task 4); `LanguageToggle` (Task 5).
- Produces: `Header(): JSX.Element` (no props). Consumed by Task 13 (`app/page.tsx`).

- [ ] **Step 1: Implement `components/Header.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it renders without errors**

Temporarily import `<Header />` in `app/page.tsx` above the existing placeholder text, run `npm run dev`, open `http://localhost:3000`, confirm the header shows the name, six nav links, and both toggle buttons, and that clicking the toggles changes theme/language. Then remove the temporary import (Task 13 wires it in permanently).

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add sticky header with nav, language toggle, and theme toggle"
```

---

### Task 7: Hero section

**Files:**
- Create: `components/Hero.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.hero.*`; static assets `/profile-photo.jpg` and `/cv-pablo-mira-amante.pdf` (Task 3).
- Produces: `Hero(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Hero.tsx`**

```tsx
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
        <p className="text-sm uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          {content.hero.greeting}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{content.hero.name}</h1>
        <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-300">{content.hero.bio}</p>
        <a
          href="/cv-pablo-mira-amante.pdf"
          download
          className="mt-6 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {content.hero.downloadCv}
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add hero section with photo, bio, and CV download"
```

---

### Task 8: Projects section

**Files:**
- Create: `components/Projects.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.projects.*`; `Project` and `ProjectGroup` types from `lib/content.ts` (Task 2).
- Produces: `Projects(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Projects.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat: add projects section grouped by game jams, personal, and university"
```

---

### Task 9: Experience section

**Files:**
- Create: `components/Experience.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.experience.*`.
- Produces: `Experience(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Experience.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Experience.tsx
git commit -m "feat: add experience timeline section"
```

---

### Task 10: Education section

**Files:**
- Create: `components/Education.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.education.*`.
- Produces: `Education(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Education.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Education.tsx
git commit -m "feat: add education section"
```

---

### Task 11: Skills section

**Files:**
- Create: `components/Skills.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.skills.*`.
- Produces: `Skills(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Skills.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Skills.tsx
git commit -m "feat: add skills section grouped by category"
```

---

### Task 12: Contact section

**Files:**
- Create: `components/Contact.tsx`

**Interfaces:**
- Consumes: `useLanguage()` (Task 5) for `content.contact.*`.
- Produces: `Contact(): JSX.Element` (no props). Consumed by Task 13.

- [ ] **Step 1: Implement `components/Contact.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/Contact.tsx
git commit -m "feat: add contact section with email, phone, city, and GitHub link"
```

---

### Task 13: Assemble final layout and page

**Files:**
- Modify: `app/layout.tsx` (replace Task 1's temporary version)
- Modify: `app/page.tsx` (replace Task 1's temporary version)

**Interfaces:**
- Consumes: `ThemeProvider` (Task 4), `LanguageProvider` (Task 5), `Header` (Task 6), `Hero` (Task 7), `Projects` (Task 8), `Experience` (Task 9), `Education` (Task 10), `Skills` (Task 11), `Contact` (Task 12).
- Produces: the complete rendered page at `/`.

- [ ] **Step 1: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pablo Mira Amante — Currículum",
  description:
    "Estudiante de Ingeniería Informática — desarrollo de videojuegos, sistemas distribuidos e IA.",
};

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("cv-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${inter.className} bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50`}
      >
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The inline script runs before React hydrates and sets the `dark` class synchronously, preventing a flash of the wrong theme on load.

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Education />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Run the full test suite and build**

Run: `npm test`
Expected: all tests pass (content parity, theme context, language context).

Run: `npm run build`
Expected: succeeds, `out/index.html` contains "Pablo Mira Amante" and all six section headings.

- [ ] **Step 4: Manual smoke check**

Run: `npm run dev`, open `http://localhost:3000`, and confirm:
- All six sections render in order: Sobre mí, Proyectos, Experiencia, Formación, Skills, Contacto.
- Clicking the language toggle switches every section's text to English and back.
- Clicking the theme toggle switches background/text colors and persists after a page reload.
- The "Descargar CV" button downloads `cv-pablo-mira-amante.pdf`.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx
git commit -m "feat: wire full page — header, all sections, theme init script"
```

---

### Task 14: GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: `npm run build` (Task 1), which must produce `out/`.
- Produces: automatic deployment to GitHub Pages on every push to `main`.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create `README.md`**

```markdown
# Currículum Web — Pablo Mira Amante

Web currículum personal, construida con Next.js (App Router, export estático) y Tailwind CSS. Bilingüe (ES/EN) con tema claro/oscuro.

## Desarrollo local

\`\`\`bash
npm install
npm run dev       # http://localhost:3000
npm test          # tests unitarios (Vitest)
npm run build     # genera la versión estática en out/
\`\`\`

## Despliegue

En cada push a `main`, el workflow `.github/workflows/deploy.yml` construye el sitio y lo publica en GitHub Pages.

**Paso manual único tras crear el repo:** en GitHub, ir a *Settings → Pages → Build and deployment → Source* y seleccionar **GitHub Actions**.
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci: add GitHub Pages deployment workflow"
```

- [ ] **Step 4: Push to GitHub — requires explicit confirmation first**

This step publishes the repository publicly and is hard to reverse. **Before running any command in this step, confirm with the user**: the exact GitHub account/remote to push to (expected: a new repo named `pma91-ua.github.io` under the `pma91-ua` account), and that they're ready for it to go public. Do not create the remote repo or push without that confirmation, even if the rest of the plan has been pre-approved.

Once confirmed:
```bash
git remote add origin https://github.com/pma91-ua/pma91-ua.github.io.git
git push -u origin main
```

Then in the GitHub repo settings, enable *Pages → Source → GitHub Actions* (one-time manual step, cannot be scripted). Wait for the Actions run to finish, then verify `https://pma91-ua.github.io/` loads.

---

### Task 15: Final QA pass

**Files:** none (verification only).

**Interfaces:** none — this task only exercises the finished site.

- [ ] **Step 1: Build and serve the static output locally**

```bash
npm run build
npx serve out
```

- [ ] **Step 2: Responsive check**

Open the served URL and resize the browser (or use dev tools device toolbar) at three widths: ~375px (mobile), ~768px (tablet), ~1280px (desktop). Confirm: no horizontal scrollbar, nav wraps cleanly on narrow widths, project cards reflow from 1 to 2 columns, hero stacks vertically on mobile and side-by-side from `sm:` up.

- [ ] **Step 3: Theme contrast check**

Toggle dark mode and check every section: body text, headings, links, and skill/tag pills all remain legible (no dark-on-dark or light-on-light text).

- [ ] **Step 4: Language toggle check**

Toggle to English and step through all six sections top to bottom, confirming every string switched (headings, nav, bio, project descriptions, experience/education entries, skill categories, contact labels) with none left in the other language.

- [ ] **Step 5: Link check**

Click every external link (3 itch.io game links, 6 GitHub project links, GitHub profile link) and confirm each opens the correct page in a new tab. Confirm the `mailto:` link opens a mail client addressed to `pmiramante@outlook.es`, and the CV download button downloads a valid, openable PDF matching the current source `CV Pablo Mira Amante 2026.pdf`.

- [ ] **Step 6: Final commit**

If any QA step required a fix, commit it now with a message describing the fix (e.g., `fix: correct dark-mode contrast on skill tags`). If no fixes were needed, this task requires no commit.
