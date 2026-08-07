# Currículum Web — Pablo Mira Amante

Web currículum personal, construida con Next.js (App Router, export estático) y Tailwind CSS. Bilingüe (ES/EN) con tema claro/oscuro.

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:3000
npm test          # tests unitarios (Vitest)
npm run build     # genera la versión estática en out/
```

## Despliegue

En cada push a `main`, el workflow `.github/workflows/deploy.yml` construye el sitio y lo publica en GitHub Pages.

**Paso manual único tras crear el repo:** en GitHub, ir a *Settings → Pages → Build and deployment → Source* y seleccionar **GitHub Actions**.
