# Presentation website

React + Vite. Design ported from the Claude Design file "BCD Decoder Presentation".

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

- `src/logic.js`: truth table, expressions, efficiency numbers (single source of truth)
- `src/sections.jsx`: the 10 presentation sections
- `src/screenshots.js`: file names for Nelson's Logisim screenshots (`public/img/screenshots/`)

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.
