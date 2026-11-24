# BCD → 7-Segment Decoder

Final project for Organización Computacional (IS-237), UNADECA. By Joseph Cordova and Nelson.

A combinational circuit, built only from logic gates, that converts a 4-bit BCD input (A B C D) into the 7 segment signals (a–g) for digits 0–9 and shows **E** for invalid inputs (10–15). It is simplified with Karnaugh maps.

**Presentation website:** https://two-bit-dev.github.io/bcd-7seg-decoder/

## Repo layout

| Path | What |
|---|---|
| `PLAN_BCD.md` | Project plan, tasks, timeline |
| `docs/NELSON.md` | Step-by-step guide for building the Logisim circuit |
| `docs/img/` | Circuit block diagram, QR code |
| `web/` | Presentation website (React + Vite) |
| `circuit/` | Logisim-evolution `.circ` file (coming) |

## Simplified expressions (with don't-cares)

| Segment | Expression |
|---|---|
| a | A + C + BD + B'D' |
| b | B' + C'D' + CD |
| c | B + C' + D |
| d | A + B'D' + B'C + CD' + BC'D |
| e | B'D' + CD' |
| f | A + C'D' + BC' + BD' |
| g | A + B'C + BC' + CD' |
| INVALID | AB + AC |

"E" override: a, d, e, f, g = seg + INVALID; b, c = seg · INVALID'.

## Running the website locally

```bash
cd web
npm install
npm run dev
```

Keys: ↑/↓ change section, 0–9 or ←/→ change the input.

### Adding the Logisim screenshots

1. Put the images in `web/public/img/screenshots/`.
2. List them in `web/src/screenshots.js`, e.g. `{ file: 'full-circuit.png', caption: 'Full circuit' }`.
3. Push to `main`. GitHub Actions rebuilds and redeploys the site.
