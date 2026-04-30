# Lanehart Electrical Contractors — Site Rework

A modern, brand-aligned single-page rebuild of [lanehart.com](https://lanehart.com). Built with Vite, GSAP + ScrollTrigger, Lenis smooth scrolling, and SplitType for typographic reveals.

## Stack

- **Vite 5** — dev server / build tool
- **GSAP 3 + ScrollTrigger** — animation
- **Lenis** — silky smooth scroll
- **SplitType** — line/word typographic reveals
- **No frameworks.** Pure HTML/CSS/JS for absolute control over the design.

## Design language

- **Palette** — Lanehart green `#00703C` (PMS 349) on warm-paper `#F3EFE7`, with `#F4BC16` gold accents and a deep `#0A0F0D` ink for the hero / partner sections.
- **Type** — `Big Shoulders Display` for editorial industrial headlines, `Newsreader` italic for editorial accents, `Hanken Grotesk` for body. (Deliberately avoiding the AI-monoculture defaults Inter / Geist / Fraunces / Space Grotesk.)
- **Sections** — Hero (logo + blurred video bg) → Marquee → About + Stats → Services → Who We Work With → Contact → Footer, all numbered editorially.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Notes

- Hero video pulls from Pexels (free for commercial use). Replace `<source>` URLs in `index.html` with your own footage when ready — ideally a slow-motion electrician/lighting/EV-charging clip.
- The 22 builder logos in **Who We Work With** load directly from `lanehart.com/wp-content/uploads/...`. Keep them remote, mirror them locally, or swap them for higher-resolution versions any time.
- The logo in the hero is the official `LEC-horizontal-pms-349_white_trans1.png` served from Lanehart's CDN.
- Smooth scroll respects `prefers-reduced-motion` — counters, parallax and stagger collapse to instant for users who request reduced motion.
