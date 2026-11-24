# BCD to 7-Segment Decoder: Project Plan

**Course:** Organización Computacional (IS-237), UNADECA
**Team:** Joseph Cordova & Nelson
**Repo:** https://github.com/Two-Bit-dev/bcd-7seg-decoder
**Deadline:** Today, 6:00 PM
**Weight:** 25% of final grade

---

## Goal

Design a combinational circuit that takes a 4-bit BCD input (A B C D, A = MSB) and lights the 7 segments (a–g) to show digits 0–9. It also shows an **"E"** for invalid inputs (10–15). We'll build it **with gates only**, simplify it with **Karnaugh maps**, and present everything through an **interactive presentation website**.

```
     a
   ─────
  |     |
f |     | b
   ──g──
  |     |
e |     | c
   ─────
     d
```

---

## Tasks (GitHub issues)

| # | Issue | Owner | Due |
|---|---|---|---|
| 1 | Logisim: decoder for 0–9 (3 NOT, 9 AND, 7 OR) | Nelson | 2:30 PM |
| 2 | Logisim: INVALID detector + "E" override | Nelson | 3:30 PM |
| 3 | Test all 16 inputs, count gates, send circuit screenshots for the site | Nelson | 3:30 PM |
| 4 | Presentation website (sections below) | Joseph | 4:30 PM |
| 5 | Host on GitHub Pages + QR code | Joseph | 4:30 PM |
| 6 | Written documentation (truth table, expressions, diagram, process) | Joseph | 5:00 PM |
| 7 | K-maps for all 7 segments (each person explains some) | Both | 12:30 PM |

Nelson's step-by-step guide: [`docs/NELSON.md`](docs/NELSON.md)

---

## What we're building

### 1. Core circuit (Nelson)
- [ ] Truth table: 4 inputs → 7 outputs (inputs 10–15 = don't care)
- [ ] 7 Karnaugh maps, one per segment
- [ ] Simplified Boolean expressions
- [ ] Gate-only circuit in **Logisim-evolution**, no decoder chip or Hex Digit Display
- [ ] Test all 16 inputs

### 2. Error detection (Nelson)
- [ ] Invalid input detector: **`INVALID = A·B + A·C`**
- [ ] Override so the display shows **"E"** (a, d, e, f, g on; b, c off):
  - a, d, e, f, g: `seg + INVALID`
  - b, c: `seg · INVALID'`
- [ ] Answer for "what happens with 1100?": without the override it shows a **9** (it was a don't-care); with it, **E**.

### 3. Efficiency showdown (proves "diseño eficiente")
Each segment built separately (textbook count):

| Method | Gates | Gate inputs | Literals |
|---|---|---|---|
| Canonical SOP (minterms) | 60 | 245 | 196 |
| K-map, no don't-cares | 37 | 99 | 73 |
| K-map **with** don't-cares | **26** | **58** | **42** |

**60 → 26 gates (57% fewer).** Sharing the AND terms between segments brings our real circuit to **19 gates** (+3 detector, +8 override = 30 total).

### 4. Presentation website (Joseph), which is also our slides
Stack: plain HTML + CSS + JavaScript, inline SVG, no build step, hosted on GitHub Pages from `docs/`.

Sections, in the order we present:
1. Problem and goal
2. Truth table (16 rows)
3. K-maps per segment with groupings highlighted
4. Simplified expressions
5. Circuit diagram + Nelson's Logisim screenshots
6. Efficiency chart (table above)
7. Live demo: 4 toggles → display, active K-map cell and term highlighted, 10–15 show "E"
8. Worked examples, including 1100
- [ ] QR code on the site so classmates can try it on their phones

---

## Simplified expressions (with don't-cares, verified for 0–9)

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

> Draw each K-map ourselves to confirm these. We need to be able to explain every grouping.

---

## Who does what

| Joseph | Nelson | Both |
|---|---|---|
| Presentation website | Logisim circuit | K-maps (each explains some segments) |
| Documentation | Error detector ("E") | Present through the website |
| QR code / hosting | Testing all 16 inputs + screenshots | Practice the defense |

---

## Timeline (today)

| Time | Task |
|---|---|
| 11:30 – 12:30 | Truth table + K-maps, confirm expressions |
| 12:30 – 2:30 | Nelson: Logisim decoder · Joseph: website |
| 2:30 – 3:30 | Nelson: error detector, tests, screenshots · Joseph: website |
| 3:30 – 4:30 | Add screenshots to site, GitHub Pages + QR |
| 4:30 – 5:15 | Documentation |
| 5:15 – 6:00 | Rehearse the defense on the website + buffer |

---

## Deliverables (from the rubric)

- [ ] **Working circuit** in the simulator, passing every test case (30%)
- [ ] **Clear use of course concepts:** truth table, Boolean algebra, K-maps (25%)
- [ ] **Documentation:** truth table, Boolean expressions, circuit diagram, design process (15%)
- [ ] **Oral defense:** both of us explain confidently (20%)
- [ ] **Teamwork:** balanced participation, on time (10%)

## Presentation flow (10–15 min, through the website)

1. Problem and goal (1–2 min)
2. Truth table and Boolean expressions (3–4 min)
3. K-maps + efficiency chart (2–3 min)
4. Live demo: Logisim + website toggles + "E" for invalid input (3–4 min)
5. Q&A (3–5 min)
