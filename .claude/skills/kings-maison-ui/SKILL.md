---
name: kings-maison-ui
description: Build or change any page, section, or component of the King's Maison website (a black-and-gold royal jewellery site) in its exact visual style. Use this whenever the task touches the King's Maison / King's Vault frontend, including new pages, product pages, menus, animations, buttons, forms, mobile layouts, or fixing anything that "doesn't look right" or "doesn't feel premium", even if the user doesn't mention the design system.
---

# King's Maison UI

This skill is for building the King's Maison website so that every new piece looks and moves like the approved design. The full visual rules are in `design.md` and the page layouts are in `docs/DESIGN_SPEC.md`. Read both before starting a new page. This file is the working checklist and a set of ready-made recipes.

## Before writing any code

1. Read `design.md`, at least sections 1, 5 and 6, and the relevant part of `docs/DESIGN_SPEC.md`.
2. If a mockup exists in `design-reference/`, read its markup for exact sizes and wording.
3. Ask: **"What would this be in a palace treasury?"** Pick the metaphor first, then the UI. For example:
   - a list of options becomes chambers, windows, or doors;
   - a dropdown becomes a necklace hanging from a hook;
   - a loading state becomes a lamp slowly brightening.

## Non-negotiables

- Use colours only from `styles/tokens.css`. The background is `--km-black` (#0a0806), never pure black or white.
- **Cinzel** is for logos, titles, labels and buttons (uppercase and widely tracked for labels). **Cormorant Garamond** is for body, taglines and italics.
- Build structure from **1 px gold hairlines and small gold diamonds**. Don't use drop shadows, rounded cards or boxed panels.
- Big titles use `.km-gold-text`, the moving-gold fill.
- The brand name is **King's Maison**. Never write "King's Vault" in new UI.
- Motion is slow and heavy: use `--km-ease-royal` with 600–1400 ms for anything large. Nothing bouncy except jewels "hanging".
- Every animation needs a `prefers-reduced-motion` fallback (a fade only, with no idle loops).
- Every interactive element is a real `<a>` or `<button>`, works with the keyboard, and has the gold focus ring. Hover features must also work on focus and tap.
- Missing content goes in `src/content/site.ts` or `products.ts`, shown as `[ BRACKETED CAPS ]` placeholders. Never invent prices, dates, or facts about the founders.

## Recipes

The Tailwind class names below assume the theme maps the tokens as follows: colours `black`, `surface`, `gold`, `gold-bright`, `ivory`, `ivory-soft`, `muted` and `on-gold`, and fonts `font-display` (Cinzel) and `font-body` (Cormorant Garamond).

### Moving-gold title
```tsx
<h1 className="km-gold-text font-display font-bold tracking-[0.03em] leading-none text-[clamp(56px,8vw,112px)]">
  The Legacy
</h1>
```

### Eyebrow, then title, then italic line (the standard heading stack)
```tsx
<div className="flex flex-col items-center gap-3.5">
  <p className="font-display text-[13px] tracking-[0.45em] text-gold uppercase">Chamber I</p>
  <h1 className="km-gold-text font-display font-bold text-[clamp(56px,8vw,108px)] leading-none">The Legacy</h1>
  <p className="font-body italic text-[28px] text-ivory">Treasures beyond time.</p>
</div>
```

### Primary gold button
```tsx
<a href="/chambers"
   className="inline-block px-[34px] py-4 bg-gold text-on-gold font-display font-bold text-sm tracking-[0.32em] rounded-[2px]
              shadow-[0_0_40px_rgba(255,200,110,.5)] transition-colors hover:bg-gold-bright
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold-bright">
  ENTER
</a>
```

### Vertical divider with diamond
```tsx
<div className="relative w-px self-stretch bg-gold" aria-hidden>
  <span className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold bg-black" />
</div>
```

### Double-framed image placeholder
```tsx
<div className="border border-gold p-3 aspect-[3/4]">
  <div className="h-full border border-gold/40 bg-surface grid place-items-center">
    <span className="font-display text-xs tracking-[0.25em] text-muted">[ PORTRAIT · HARSHI ]</span>
  </div>
</div>
```

### Outlined watermark numeral
```css
.km-numeral { color: transparent; -webkit-text-stroke: 1px rgba(201,164,92,.35); font-family: var(--km-font-display); }
```

### Rise-in on enter (Framer Motion)
```tsx
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay: i * 0.15, ease: [0.2, 0.7, 0.1, 1] } }),
};
// <motion.h1 variants={rise} initial="hidden" animate="show" custom={1} />
```

### Slide-open panel with glowing edge
- Keep the panel anchored to the edge it opens from, and animate its width from 33.33% to 100% with `layout`, 1.1 s, `--km-ease-royal`.
- The moving edge is a 3 px `--km-gold-bright` bar with `box-shadow: 0 0 28px rgba(255,200,110,.8)`.
- Draw 4–5 thin streaks behind it, each a horizontal `linear-gradient(90deg, transparent, rgba(232,199,127,.8))`.
- The neighbouring panels shrink to about 180 px, dim, rotate their titles with `writing-mode: vertical-rl`, then leave the screen.

### Necklace menu (hover or tap a tab to hang products from it)
- Use one SVG in a 1440 × 1000 coordinate space that scales with the container.
- Hook at `x = 272 + i·224`, `y = 356`.
- The drape is `M260 460 Q720 820 1180 460`, and a jewel's top sits at `y = 460 + 720·t·(1−t)`, where `t = (x−260)/920`.
- The chain uses a dash pattern of `6 4`, with `stroke-dashoffset` animated to −40 over 3 s on a loop.
- The necklace sways ±0.6° around the hook over 7 s.
- On a tab change, re-hook the strands with a spring, and hang the new jewels one by one (60 ms stagger).

### Idle life for dark screens
Pick **one** of these per screen:
- a drifting gold background (`.km-gold-motion`);
- 30–40 rising dust dots;
- a lamp flicker (opacity 1 → .85 → .95 over 4–5 s).

## Checklist before saying "done"

- [ ] Only token colours are used, and there is no white, no pure black, and no gradient backgrounds.
- [ ] Cinzel and Cormorant are used in the right roles, labels are uppercase and tracked, and the logo reads "KING'S MAISON".
- [ ] The layout is symmetrical, structured by hairlines, and generous with black space.
- [ ] Motion is slow, eased with `--km-ease-royal`, and has a reduced-motion fallback.
- [ ] Keyboard, focus ring and tap all work, and every visual trick has a real HTML fallback.
- [ ] It looks right at 390 px, 768 px and 1440 px.
- [ ] It was compared side by side with its `design-reference/` mockup, if one exists.
- [ ] Placeholders come from the content files, with no invented facts.
