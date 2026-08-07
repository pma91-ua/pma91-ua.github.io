# Currículum Web — Pablo Mira Amante

**Fecha:** 2026-08-07
**Estado:** Aprobado por el usuario, pendiente de plan de implementación

## Objetivo

Construir una web currículum profesional a partir de `CV Pablo Mira Amante 2026.pdf`, para alojar en GitHub Pages en el repositorio `pma91-ua.github.io` (sirviendo en `https://pma91-ua.github.io/`).

## Privacidad de datos

El PDF original contiene DNI, dirección exacta y fecha de nacimiento. **Ninguno de estos tres datos aparece en la web ni en el PDF descargable.** Datos de contacto públicos: email, teléfono, ciudad (sin calle/CP).

## Stack técnico

- **Next.js (App Router)** con `output: 'export'` → build estático puro (HTML/CSS/JS), sin servidor ni SSR en producción.
- **Tailwind CSS** para estilos, incluyendo tema claro/oscuro vía estrategia de clase (`dark:`).
- **Sin backend ni formularios con terceros** — contacto por enlaces directos (`mailto:`, `tel:`, GitHub).
- **Despliegue:** GitHub Actions (`next build` → export a `out/` → `actions/deploy-pages`) en cada push a `main`. Requiere un paso manual único: activar "GitHub Actions" como fuente de Pages en la configuración del repo después de crearlo/subirlo.
- **Repo:** `pma91-ua.github.io` (repo raíz de usuario).

## Internacionalización

- Diccionarios de contenido en JSON separados por idioma: `content/es.json`, `content/en.json`.
- Toggle de idioma en el header. Selección persistida en `localStorage`. Español por defecto.
- Todo el texto visible (nav, secciones, labels, bio) vive en estos diccionarios — no hay texto hardcodeado en los componentes.

## Tema claro/oscuro

- Respeta `prefers-color-scheme` del sistema por defecto.
- Toggle manual en el header, persistido en `localStorage`.
- Paleta neutra (blanco roto / gris casi negro) + un único color de acento para links, CTAs y tags de skill, consistente en ambos temas.

## Estructura de secciones (orden fijo)

1. **Header** — fijo, nombre, nav por anclas, toggle idioma, toggle tema.
2. **Hero / Sobre mí** — foto (la del PDF original), bio corta (redactada, ver abajo), botón de descarga del CV en PDF.
3. **Proyectos** — grid de tarjetas con tags de tecnología y enlace externo:
   - 3 juegos de Game Jams (itch.io): Chromatophobia, Chess Unbound, A Gloomy Manor.
   - Proyectos personales en curso: simulador de ecosistema (NEAT + animación procedural), Modpack de Minecraft (GitHub), hosting local de IA open source (Ollama/Odysseus/Docker).
   - Proyectos de universidad (GitHub): DSS (estilo Wolah con IA), Sistema Distribuido Kafka (EV charging), Tokenizador/Indexador, Buscador de Explotación de Información.
4. **Experiencia** — timeline de los 3 trabajos de verano (peón agrícola, aprendiz electrónica, aprendiz informática).
5. **Formación** — Bachillerato ciencias y tecnología, grado en Ingeniería Informática (162 créditos, cursando), quinto curso de Tuba tenor (música), carnet de conducir B, inglés (C1 pendiente de examen), valenciano (nivel alto, nativo).
6. **Skills** — agrupadas por categoría con nivel (Avanzado/Intermedio): Sistemas operativos, Lenguajes de programación, Herramientas/IA (Claude Code, Ollama, hosting local de LLMs), Motores de videojuegos (Godot, Unity).
7. **Contacto** — email, teléfono, ciudad, enlaces a GitHub.

## Contenido a redactar (no viene literal en el CV)

- **Bio del hero** (2-3 frases): se redactará a partir de los hechos del CV (estudiante de Ingeniería Informática, desarrollo de videojuegos, experiencia con IA/Linux, sistemas distribuidos) y se presentará al usuario para aprobación antes de darla por definitiva, en ambos idiomas.
- **Traducción al inglés** de todo el contenido (bio, descripciones de proyectos, experiencia, formación, skills).

## CV descargable

Se hara uso del curriculum disponible en la carpeta raiz del proyecto y se servirá como archivo estático (`/cv-pablo-mira-amante.pdf`) y enlazada desde el botón de descarga del hero.

## Fuera de alcance

- Formulario de contacto con backend/terceros.
- Blog o páginas adicionales más allá del currículum de una sola página.
- Analítica de visitas.
- Dominio personalizado (se usa el subdominio `github.io` por defecto).

## QA / validación

No hay tests automatizados de contenido (sitio estático de una página). Validación antes de publicar:

- `next build` sin errores como gate en el workflow de CI antes de desplegar.
- Revisión responsive manual (móvil, tablet, desktop).
- Contraste y legibilidad correctos en ambos temas (claro/oscuro).
- Toggle de idioma probado en todas las secciones.
- Todos los enlaces externos (itch.io, GitHub, mailto, tel) verificados manualmente.
