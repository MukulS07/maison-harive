# King's Maison — Website Build Brief

You are building the frontend for **King's Maison**, a contemporary jewellery house for men, inspired by royal dynasties and rooted in Indian jewellery heritage. It is founded by the sisters **Harshi Gilara** and **Ritvi Gilara**. The site should feel like walking into a royal treasury at night: black, candle-lit gold, slow and cinematic.

Read these files before writing code:

0. `design.md` is the design system (feel, colour, type, components, motion). The same rules are packaged as a Claude Code skill in `.claude/skills/kings-maison-ui/SKILL.md` (a copy of `skills.md`), which loads automatically for UI work.

1. `docs/DESIGN_SPEC.md` gives the page-by-page layout, copy, and interactions. It is the source of truth.
2. `styles/tokens.css` holds the colours, fonts, spacing and motion values. Use these tokens and never hard-code new colours.
3. `design-reference/*.mockup.html` are the approved visual mockups. Use them to match layout, sizes, and wording.
   - They were made in a design tool and depend on a runtime script (`support.js`) that is not included, so they will not open correctly in a browser. Read them as markup: the inline styles give exact positions, sizes and colours at a 1440 × 900 desktop frame.
   - Do not copy their structure. Rebuild everything as clean, responsive components.

## The website has exactly 4 pages, in this order

1. **Page 1 · Hero:** "Enter the Maison" (`/`). It opens with the short Stage intro (spotlights, words, gold flash), which dissolves into the hero. The ENTER button goes to Page 2.
2. **Page 2 · The three split panels:** The Chambers (`/chambers`). The left panel slides open to the right, the middle panel slides down, and the right panel slides open to the left. Each opens a full page, and the top-left back button returns to the three panels. "The Women Behind the Door" button goes to Page 3.
3. **Page 3 · The two sisters:** Harshi Gilara and Ritvi Gilara (`/sisters`). The ARCHIVE button goes to Page 4.
4. **Page 4 · The Archive:** the shop, Products · Men (`/archive`), with the necklace menu.

The chamber pages (Legacy, Collection, Atelier) are part of Page 2, not separate pages in the main flow.

## Tech stack

This stack is a recommendation. Change it only if the user asks.

- **Next.js** (App Router) with **TypeScript**
- **Tailwind CSS**, with its theme extended from `styles/tokens.css` (CSS variables)
- **Framer Motion** for all page transitions, panel expansions, and the shop necklace animation
- **next/font** to load *Cinzel* (400/600/700) and *Cormorant Garamond* (400/500, plus italics)
- No UI kit. Every component is custom.

## Routes

| Route | Page | Mockup file |
|---|---|---|
| `/` (first visit) | **Cinematic intro**: spotlights, rising words, gold flash; dissolves into Home | `Stage.mockup.html` (scenes 1–3 only) |
| `/` | Home: "Enter the Maison" | `Main.mockup.html` (desktop), `Mobile.mockup.html` (mobile layout only; it still shows the old wording and mansion) |
| `/chambers` | Three-panel page | `Chambers.mockup.html`, `SlideMotion.mockup.html` |
| `/chambers/legacy` | Opened left panel | `Legacy.mockup.html` |
| `/chambers/collection` | Opened middle panel | `Collection.mockup.html` |
| `/chambers/atelier` | Opened right panel | `Atelier.mockup.html` |
| `/sisters` | Founders page | `Sisters.mockup.html` |
| `/archive` | Shop: Products · Men | `Shop.mockup.html` |

The site opens with the **Stage intro**, which plays before the Home page. `Knockout.mockup.html` is an **alternative home design**; do not build it unless the user asks. `DESIGN_SPEC.md` §8 describes it.

## Build order

1. Set up the project: tokens, fonts, global styles, and a shared `<SiteHeader>` and `<BackButton>`.
2. Build `<VideoTextHero>`, the reusable "text filled with the video" effect (see spec §1.3), and the Home page.
3. Build the **Stage intro** (spec §1.0) that plays in front of the Home page and dissolves into it.
4. Build the Chambers page and its three open transitions (the hardest part, spec §2).
5. Build the three chamber detail pages.
6. Build the Sisters page.
7. Build the Archive shop with the **necklace menu** (spec §5).
8. Responsive pass (mobile at 390 px), `prefers-reduced-motion` pass, and accessibility pass.

Work one step at a time. After each step, run the dev server and confirm it builds before moving on.

## Rules

- Everything is a placeholder until real assets arrive. Anything in `[ SQUARE BRACKETS ]` in the spec (photos, prices, product names, addresses) must come from one data file, `src/content/site.ts`, so the client can fill it in one place.
- Keep all product data in `src/content/products.ts`.
- The hero video goes at `public/media/hero.mp4`. Until it exists, fall back to the animated gold gradient described in the spec so the page never looks broken.
- Every animation must respect `prefers-reduced-motion`: fade instead of slide, and no looping motion.
- Every clickable element must be a real `<a>` or `<button>`, reachable by keyboard, with a visible gold focus ring.
- Mobile is required. Use the layouts in spec §7.
