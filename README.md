# Portfolio

A static site built with Astro, drawn as a transit-style network map of projects and roles. It uses GSAP and Lenis for motion (both off under reduced motion), Simple Icons for brand logos, Lucide for interface icons and Geist for type. Everything is bundled and self-hosted, so the site sets no cookies and makes no third-party requests.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/ locally
```

## Edit the content

Content is split across two files:

- `src/data/content.ts` holds `profile` (name, links, résumé path) and `claims`, one entry per case study in order. Each entry has the one-line promise (`statement`), a `grade` (`use`, `measured` or `modelled`), the section text, `results` and `limits`. Inline markup: `` `code` ``, `*em*`, `**strong**`.
- `src/data/network.ts` holds the map (`lines` and `stations`, with hand-placed coordinates for the wide and tall layouts), per-project presentation in `work` (line, featured flag, headline metrics, tech, images), the `route` timeline, `recognition` and the `toolkit`.

To add a project, add a claim to `content.ts`, a `work` entry and a station to `network.ts` (and its id to a line's `stops`), then point `figure.id` at a component in `src/components/figures/`. Cover art for projects without screenshots is drawn in `src/components/Cover.astro`. Tech ids map to logos in `src/lib/icons.ts`.

The résumé is served from `public/Jeya-Viknan-Resume.pdf`; replace that file to update it. Project images live in `public/work/`, and the social preview image is `public/og.png`.

## Before publishing

Set the domain so canonical URLs and the social preview image resolve to absolute addresses:

```bash
SITE_URL=https://your-domain.example npm run build
```

`dist/` can then be served by any static host.
