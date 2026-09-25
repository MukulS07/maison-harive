# King's Maison — Design Spec

All measurements are for a **1440 × 900 desktop** frame, matching the mockups in `/design-reference`. Scale them fluidly; §7 covers mobile. Colour and font names refer to `styles/tokens.css`.

---

## 0. Global elements

### 0.1 Site header
- 88 px tall, with side padding of 56 px and a bottom hairline in `--km-line`.
- Three zones: left (240 px), centre, right (240 px).
- **Logo:** "KING'S MAISON" in Cinzel 600, 18 px, tracking 0.3em, ivory.
- Each page decides what goes in each zone; the page sections below say which.

### 0.2 Back button
- A 44 px circle with a 1 px gold border and a left-arrow icon in `--km-gold-bright`, followed by an italic Cormorant label at 17 px (for example "The Chambers").
- It always sits in the header's left zone.

### 0.3 Buttons
- **Primary:** gold fill (`--km-gold`), dark text (`--km-on-gold`), Cinzel 700 at 13–14 px, tracking 0.28–0.32em, padding 16 × 34, radius 2 px, shadow `--km-glow`.
- **Secondary:** transparent, with a 1 px gold border and ivory text.

### 0.4 Pills (section tabs, filters)
- Padding 9 × 18, radius 999 px, Cormorant 17 px.
- Inactive: border `rgba(201,164,92,.3)`.
- Active: border `.6` plus fill `rgba(201,164,92,.15)`.

### 0.5 Eyebrow labels
- Cinzel 12–13 px, tracking 0.45em, gold, uppercase (for example "CHAMBER I").

### 0.6 Image placeholders
- `--km-surface` fill inside a double gold frame: an outer 1 px gold border, 12 px padding, then an inner 1 px border at 40% gold.
- A centred caption such as `[ PORTRAIT · HARSHI ]` in Cinzel 12 px, tracking 0.25em, `--km-muted`.

### 0.7 Video-textured text
Big headlines are filled with moving gold. Use `.km-gold-text` from `tokens.css` everywhere **except** the home hero, which uses the real video (§1.3).

---

## 1.0 Stage intro — plays first on `/`  (mockup: `Stage.mockup.html`)

The site opens with a short cinematic intro that the visitor moves through by scrolling (or clicking the scroll cue). It ends in a gold flash that dissolves into the Home page. Build it as a full-screen `<StageIntro>` overlay on top of Home.

**Build scenes 1–3 only.** The mockup file also contains a fourth "reveal" scene (a jewel pedestal with 01/02/03 options). That scene was **removed** from the design; do not build it.

**Background:** `--km-black-deep` (#070605) with about 40 floating gold dust particles (1–3.4 px dots in `#f3dfae`, drifting upward 140 px and fading over 8–18 s, with random start delays).

**Scene 1 · Darkness and spotlights**
- Four soft spotlight beams shine down from the top, centred at x = 480, 640, 800 and 960 (in a 1440-wide frame). Each is a trapezoid 60 px wide at the top that spreads outward to about 380 px at y = 700.
  - Fill: a vertical gradient from `#fff6e0` at 55% opacity down to transparent at 75%.
  - Apply a Gaussian blur of about 18 px.
  - Add a bright blurred light source at the top of each beam.
  - The group flickers gently, like old stage lamps (opacity 1 → 0.82 → 0.95 over 5 s).
- Centred logo: **KING'S MAISON** in `.km-gold-text`, Cinzel 700, 60 px, tracking 0.14em. Below it, "THE CHAMBERS" in Cinzel 16 px, tracking 0.55em, ivory. Ask the client whether this subline should become "TREASURES BEYOND TIME" now that the intro sits before Home.
- A scroll cue at the bottom centre: "SCROLL TO BEGIN" (Cinzel 11 px, tracking 0.4em) above a 44 px thin gold line, with a small gold drop of light falling down the line on a 2 s loop. The cue is a `<button>` that also advances the scene.

**Scene 2 · The words rise**
- The logo fades out, and the beams dim to 45%.
- Two lines rise 26 px into place and fade in, centred at y ≈ 410: **"EVERY PIECE, A ROYAL ARTEFACT"** / **"WITH A STORY OF ITS OWN"** in Cinzel 15 px, tracking 0.5em, colour `#d9b56a`.
- The scroll cue now reads "SCROLL".

**Scene 3 · Gold flash, then Home**
- The whole screen fills with a warm gold bloom (a radial gradient: `#fff6dc` at the centre, then `#efcf8a`, `#8a5a1c`, and `#070605` at the edges) over 550 ms.
- After about 850 ms the overlay fades out and reveals the **Home page** underneath. Its load animation (§1.2) starts as the flash clears.

**Controls and behaviour**
- Scrolling down (a wheel or trackpad delta over 8) advances one scene. Lock input for 900 ms between scenes so one flick doesn't skip everything. On touch devices, swiping up advances.
- Scrolling up goes back one scene (scene 2 → 1).
- A small "SKIP INTRO" text button sits bottom-right (Cinzel 11 px, muted) and jumps straight to Home.
- Show the intro only once per session (remember it in `sessionStorage`). Returning to `/` from inside the site goes straight to Home.
- With `prefers-reduced-motion`, skip the beams and dust animation and cross-fade the scenes.
- Transitions: opacity at 1.1 s, and transforms at 1.3 s with `--km-ease-royal`.

---

## 1. Home — `/`  (mockup: `Main.mockup.html`)

### 1.1 Layout
1. **Background:** a full-bleed looping video (`public/media/hero.mp4`) set to `autoplay muted loop playsInline`, `object-fit: cover`, with a scrim of `--km-scrim` over it.
   - Fallback when there is no video: a div with `.km-gold-motion`.
2. **Header (§0.1):**
   - Left: the logo.
   - Centre: five pills — The Collection (active), Artefacts, Heritage, The Atelier, Contact, with an 8 px gap.
   - Right: "Private Viewing" in italic, `--km-gold-bright`.
3. **Hero stack**, centred and starting 210 px from the top:
   - "Enter the": Cormorant italic, 64 px, ivory.
   - **"MAISON"**: Cinzel 700, 220 px, line-height 0.95, tracking 0.06em, **filled with the video** (§1.3). Pull it up 10 px under "Enter the".
   - "TREASURES BEYOND TIME": Cinzel 14 px, tracking 0.5em, gold, 18 px below.
   - **ENTER** primary button, 56 px below, linking to `/chambers`.
4. There is **no mansion illustration.** It was removed on purpose.

### 1.2 Motion
- On load, fade in the header (400 ms), then "Enter the" (600 ms, rising 12 px), then MAISON (900 ms, letter-spacing easing from 0.2em to 0.06em), then the tagline and button. Stagger each by 150 ms.
- The ENTER button gets a slow pulse of its glow (4 s loop).

### 1.3 Text filled with the video (key effect)
The letters of "MAISON" show the same video playing behind them, but brighter than the dimmed background.

Implementation:
1. Layer 1 is the background video with the dark scrim over it.
2. Layer 2 is a **second `<video>` element** with the same source, kept in sync with layer 1 (sync `currentTime` on `play` and every few seconds). Apply `filter: brightness(1.35) contrast(1.1) saturate(1.2)` and clip it to the text using an inline SVG `<clipPath>` that contains `<text>MAISON</text>` in Cinzel 700. Use `clip-path: url(#maisonClip)`.
3. Keep the SVG text size responsive: set the SVG `viewBox` to the text size and scale the SVG with the container.
4. Fallback: if clipping with SVG text fails, or before the video loads, use `.km-gold-text` on a normal `<h1>`.
5. Keep an accessible `<h1>` ("Enter the Maison"). The SVG is decorative, so give it `aria-hidden`.

---

## 2. The Chambers — `/chambers`  (mockups: `Chambers.mockup.html`, `SlideMotion.mockup.html`)

### 2.1 Layout
1. **Header:**
   - Left: "← The Gate", linking to `/`.
   - Centre: the logo.
   - Right: a pill button **"The Women Behind the Door →"** with a gold border, a light gold fill and italic text, linking to `/sisters`.
2. **Three equal panels** fill the space below the header. Each is 480 px wide on desktop.
3. **Dividers:** 1 px solid gold vertical lines between the panels. Each line has a small 10 px diamond (a rotated square with a gold border and black fill) at its vertical centre.
4. **Panel background:** `.km-gold-motion`, or a looping video per panel later, under a scrim of 0.76 (left and right panels) or 0.58 (middle panel, so the featured one is brighter).

Each panel contains, from top to bottom:

| Element | Style |
|---|---|
| Huge outlined numeral (I / II / III) | Cinzel 240 px, fill transparent, `-webkit-text-stroke: 1px rgba(201,164,92,.35)`, top 40 px |
| Eyebrow "CHAMBER I" | §0.5, about 330 px from the panel top |
| Title | `.km-gold-text`, Cinzel 700, 46 px |
| Subline | Cormorant italic 22 px, `--km-ivory-soft` |
| Arrow control | See the table below |

| Panel | Title | Subline | Arrow control |
|---|---|---|---|
| Left | The Legacy | The story of the house | 64 px outline circle with a **→ arrow**, bottom-right of the panel next to the divider, labelled "SLIDE OPEN" |
| Middle | The Collection | Every artefact in the Vault | **Filled gold** 64 px circle with a **↓ arrow** and glow, bottom-centre, labelled "DESCEND" above it |
| Right | The Atelier | Craft & private viewing | 64 px outline circle with a **← arrow**, bottom-left of the panel, labelled "SLIDE OPEN" |

Change the Collection subline's wording "the Vault" if the client wants "the Maison" everywhere.

### 2.2 Transitions (the signature interaction)
Build this with Framer Motion `layout` animations in a shared layout. Duration is `--km-dur-slide` (1100 ms) with easing `--km-ease-royal`.

- **Left panel opens to the right.** The left panel stays anchored at `left: 0` and its width animates from 33.3% to 100%. The middle and right panels are pushed right and squeezed into 180 px strips, dimmed, with their titles turned vertical (`writing-mode: vertical-rl`) before they slide off-screen. The moving edge is the divider line: make it 3 px `--km-gold-bright` with a glow while moving, and draw 4–5 thin horizontal gold light-streaks trailing behind it (fading from transparent to gold). This state is shown in `SlideMotion.mockup.html`. The Legacy content fades in (opacity 0 → 1, starting 40% into the move).
- **Middle panel opens downward.** The middle panel expands to full width while its content drops in from above (translateY −40 px → 0). The side panels fade and slide out to their own sides. The URL becomes `/chambers/collection`.
- **Right panel opens to the left.** This mirrors the left panel: it stays anchored at `right: 0`, its width grows leftwards, the streaks trail to the right, and the other two panels are pushed off to the left.
- **Back button (top-left on every detail page).** It reverses the same animation back to the three-panel view.

Implementation suggestion: a single client component `<ChambersStage>` that holds `open: null | 'legacy' | 'collection' | 'atelier'`, synced with the route (`/chambers/[chamber]`). Keep the panels mounted and use `layoutId` per panel so the expansion is continuous.

---

## 3. Chamber detail pages

All three share these elements:
- **Header:**
  - Left: back button "The Chambers".
  - Centre: an eyebrow such as "I · THE LEGACY".
  - Right: "Private Viewing" linking to `/chambers/atelier`, or the logo.
- A 1 px gold line on the edge the panel slid in from: the left edge for Legacy, the right edge for Atelier.

### 3.1 The Legacy — `/chambers/legacy`  (`Legacy.mockup.html`)
1. **Hero (900 px tall):**
   - Background is the gold motion or video under a scrim of 0.72.
   - Left column, 640 px wide, starting at x 120 and y 200:
     - Eyebrow "CHAMBER I".
     - Title "The Legacy" in `.km-gold-text`, Cinzel 108 px.
     - "Treasures beyond time." in italic, 32 px.
     - A paragraph at 22 px with line-height 1.55: *"King's Maison is a contemporary jewellery house inspired by royal dynasties. Bold, masculine, and rooted in Indian jewellery heritage, each piece sits between jewellery and collectable art."*
     - Two buttons: "SEE THE COLLECTION" (primary) and "WATCH THE FILM" (secondary).
   - Right: a 460 × 620 double-framed placeholder, `[ HERITAGE PORTRAIT / FILM ]`.
2. **Concept band (400 px, centred):**
   - Eyebrow "THE CONCEPT".
   - Italic 52 px: "Every piece, a royal artefact with its own story."
   - A row of five piece names in Cinzel 14 px, tracking 0.25em, separated by small gold diamonds: SHIELD OF LEGACY · ARMS OF HONOUR · CROWNBOUND · PHOENIX REIGN · DOMINION. Each links to the shop.

### 3.2 The Collection — `/chambers/collection`  (`Collection.mockup.html`)
1. **Hero band (440 px):**
   - Motion background under a scrim of 0.66.
   - Centred eyebrow "CHAMBER II".
   - Title "The Collection" in `.km-gold-text`, 100 px.
   - Filter pills: All pieces (active), Rings, Cuffs, Pendants, Chains. These categories are placeholders, so keep them in `site.ts`.
2. A short 40 px gold vertical line hangs from the centre of the band's bottom edge.
3. **Grid:** 3 columns, 1280 px wide, with a 32 px column gap and a 40 px row gap. Each card has:
   - A 340 px tall image box with a 1 px gold border (45%) and a huge outlined numeral inside.
   - The caption `[ PRODUCT PHOTO ]`.
   - A row with the name (Cinzel 20 px, tracking 0.12em) and `[ PRICE ]` (gold) on the right.
   - "View the artefact →" in italic muted text.
   - Six cards: Shield of Legacy, Arms of Honour, Crownbound, Phoenix Reign, Dominion, `[ NEXT ARTEFACT ]`.

### 3.3 The Atelier — `/chambers/atelier`  (`Atelier.mockup.html`)
1. **Left half (640 px):** a video of the atelier or craftsman at a scrim of 0.5, with the caption `[ ATELIER / CRAFTSMAN FOOTAGE ]`. A 1 px gold divider separates it from the right half.
2. **Right half**, starting at x 740:
   - Eyebrow "CHAMBER III".
   - Title "The Atelier" in `.km-gold-text`, 88 px.
   - "View the Maison in private." in italic, 28 px.
   - **Form** in a 2-column grid: Name, Phone or email, Preferred date, Piece of interest (a select with the five pieces).
     - Inputs have a transparent background and only a bottom border in `--km-gold` at 60%. Labels are Cinzel 11 px, tracking 0.3em, gold.
   - Primary button "REQUEST A PRIVATE VIEWING".
   - Footer row: `[ ATELIER ADDRESS ]` · `[ VISITING HOURS ]`.
3. The form is frontend-only for now. Validate it, then show a gold confirmation state.

---

## 4. The Sisters — `/sisters`  (`Sisters.mockup.html`)

1. **Header:**
   - Left: back button "The Chambers".
   - Centre: eyebrow "THE WOMEN BEHIND THE DOOR".
   - Right: the logo, linking to `/`.
2. **Top band (340 px):**
   - Motion background under a scrim of 0.7.
   - Centred eyebrow "THE FOUNDERS".
   - Title **"The Sisters"** in `.km-gold-text`, 112 px.
3. **Two halves** (720 px each), with content centred in each:
   - A 380 × 480 double-framed portrait.
   - The name in `.km-gold-text`, Cinzel 700, 38 px, tracking 0.12em: **HARSHI GILARA** on the left and **RITVI GILARA** on the right.
   - "FOUNDER" as an eyebrow.
   - Two italic paragraphs, 21 px, 460 px wide, centred: how she started, and where it began. These are placeholders in `site.ts`.
4. **Centre divider:**
   - A 1 px gold line, 760 px tall.
   - Partway down the line breaks, and the words **"WORDS FROM THE FOUNDERS"** run vertically in the gap (Cinzel 14 px, tracking 0.4em, `--km-gold-bright`, `writing-mode: vertical-rl`).
   - A small gold diamond sits at each end of the gap.
5. **ARCHIVE →**: a primary button centred at the bottom, linking to `/archive`.

**Motion:** the portraits rise in from 30 px below with a 200 ms stagger (Harshi first). The divider line draws downward (scaleY 0 → 1) and then the vertical words fade in.

---

## 5. The Archive (shop) — `/archive`  (`Shop.mockup.html`)

### 5.1 Layout
1. **Header:**
   - Left: back button "The Sisters".
   - Centre: eyebrow "THE ARCHIVE".
   - Right: a search icon button and a bag icon with a count (Cinzel 13 px).
2. **Top band (290 px):**
   - Motion background under a scrim of 0.72.
   - Eyebrow "KING'S MAISON · THE SHOP".
   - Title **"Products · Men"** in `.km-gold-text`, 92 px.
3. **Section tabs:** a 5-column grid, 1096 px wide, centred, with a 24 px gap, at y ≈ 296:
   - ALL TREASURES · BUTTONS · BROOCHES · KALANGI · PENDANTS
   - Cinzel 15 px, tracking 0.28em, weight 600.
   - Each tab has a bottom hairline and a **12 px gold ring (the "hook")** centred under it at y ≈ 350.

### 5.2 The necklace menu (signature interaction)
This replaces a normal dropdown. **Hovering, focusing, or tapping a tab hangs a gold necklace from that tab's hook, and that section's products are the jewels on the strand.**

1. **Active tab:** its text and hairline turn `--km-gold-bright`, and its hook ring fills with gold and glows (`box-shadow 0 0 18px rgba(255,200,110,.9)`).
2. **Geometry**, in a 1440-wide coordinate space; draw it in one SVG that scales with the container:
   - Hook point: `(hookX, 356)`, where `hookX = 272 + index × 224`.
   - The draped strand is a quadratic Bézier `M260 460 Q720 820 1180 460`.
   - Two side strands run from the hook to each end of the drape: `M hookX 360 Q (hookX+260)/2 460 260 460` and `M hookX 360 Q (hookX+1180)/2 460 1180 460`.
   - Chain style: stroke `--km-gold` 2 px (the drape uses `--km-gold-bright` at 2.4 px), round caps, `stroke-dasharray: 6 4`, with the dash offset animated to −40 over 3 s on a loop so the links look like they shimmer.
3. **Five jewels** hang on the drape at x = 260, 490, 720, 950, 1180. Each jewel's top y is on the curve: `y = 460 + 720·t·(1−t)`, where `t = (x−260)/920`.
   - Each jewel is a 1 px × 14 px bail line, then a 12 px ring, then a round medallion: 108 px across, or **132 px for the centre (featured) jewel**.
   - The medallion has a 1 px gold border, 6 px padding, an inner circle with a 40% gold border and a dark radial fill, and holds the product photo (a huge outlined numeral until photos exist).
   - Below it: the product name (Cinzel 13 px, tracking 0.18em) and the price (italic, gold).
4. **Motion:**
   - The whole necklace sways gently: rotate ±0.6° around the hook point on a 7 s loop.
   - **Switching tabs:** the chain re-hooks. Animate the side strands' start point to the new hookX (500 ms spring). The old jewels drop and fade out (translateY 20 px, 200 ms), and the new jewels drop in one after another from the hook (60 ms stagger, spring with a small overshoot, as if they were just hung).
   - **Hovering a jewel:** it dips 8 px, scales to 1.08, and its medallion glows (`--km-glow-strong`). Clicking opens the product page, which is a placeholder route for now.
5. **The necklace stays open** on the last-hovered tab. It does not close when the mouse leaves; this is intentional, so customers can move down to the products. The default tab is All Treasures.
6. **Below the necklace**, centred at y ≈ 900:
   - A one-line italic caption for the active section.
   - A link "SEE EVERY PIECE IN {SECTION} →".

| Tab | Caption |
|---|---|
| All Treasures | Every piece in the Maison, on one strand. |
| Buttons | Buttons for the sherwani and the bandhgala. |
| Brooches | Worn at the heart, over the chest. |
| Kalangi | The jewel of the turban. |
| Pendants | Worn close, carried always. |

**Products:** All Treasures uses Shield of Legacy, Arms of Honour, Crownbound, Phoenix Reign and Dominion. The other sections have five placeholders each (`[ BUTTON I ]` and so on). All of this lives in `products.ts`.

**Accessibility:** tabs are real `<button>`s with `aria-pressed`. Arrow keys move between tabs. The jewels are links with the product name as their accessible name.

---

## 6. Content and data files

**`src/content/site.ts`** holds:
- the brand name ("King's Maison") and the tagline "Treasures beyond time";
- the nav tabs;
- the chamber titles and sublines;
- the founders' names and bios (placeholders);
- the atelier address and hours;
- the filter categories.

**`src/content/products.ts`** is typed as `{ id, name, category: 'buttons'|'brooches'|'kalangi'|'pendant', price?, image?, featured? }[]`. "All Treasures" shows the featured pieces.

---

## 7. Mobile (390 px) and tablet

- **Home:** use the `Mobile.mockup.html` layout, but with the new wording and **no mansion**.
  - The header has the logo on the left and a 44 px round menu button on the right.
  - The tabs become a horizontally scrollable pill row under the header.
  - "Enter the" is 38 px and **MAISON** about 72 px; the ENTER button is centred below the tagline.
- **Chambers:** the three panels **stack vertically**, each about 33vh. Tapping a panel expands it to full height (the middle panel expands downward; the top and bottom panels grow toward the middle). Keep the numerals, titles and arrows, rotated so they point to where the panel opens.
- **Detail pages:** two-column layouts become a single column, with the image first.
- **Sisters:** the two sisters stack. The vertical "Words from the Founders" divider becomes a horizontal line with the words centred in it.
- **Archive:** the tabs become a scrollable row. The necklace becomes a **horizontal swipeable strand**: a gentle arc across the screen with 3 jewels visible and swipe for more. The hook-and-strand motion still plays when a tab is tapped.

---

## 8. Alternative design (reference only — do not build unless asked)

- **`Knockout.mockup.html`:** an alternate home page. It has a pure black background, and the video appears only inside the giant MAISON letters (a knockout mask). Scrolling down shows "Where would you like to go?", the section links, and ENTER.
