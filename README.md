# Ambru.pro — Landing

Landing page for **Ambru** (Ambru Cosmin Claudiu): marketing, systems, and AI.

Built from `brand-kit.md` with finalized media assets. Stack: Vite, vanilla JS, GSAP ScrollTrigger, Lenis.

## Setup

```bash
npm install
```

## Preview (development)

```bash
npm run dev
```

Opens the local Vite server. Default: `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Media

Assets live in `public/`:

- `brand-scroll-background.mp4` — fixed cinematic background, scrubbed on scroll (desktop)
- `brand-hero-reference.png` — poster / mobile fallback
- `brand-material-reference.png`, `brand-workspace-reference.png`, `brand-secondary-reference.png`, `brand-banner-reference.png` — section imagery

On mobile or `prefers-reduced-motion`, the site uses the static poster instead of video scrubbing.

## Contact form

The form opens a `mailto:contact@ambru.pro` draft. Change the address in `main.js` if needed.

## Project notes

- Brand source of truth: `brand-kit.md`
- Do not replace media with newly generated assets unless intentional
- Keep structure flat; only `public/` is required by Vite for static files
