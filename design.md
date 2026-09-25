# King's Maison — Design System

This is the visual language of the King's Maison website: what it should feel like, and the exact values that create that feeling. Page-by-page layouts are in `docs/DESIGN_SPEC.md`. This file covers the rules that every page shares.

---

## 1. The idea

**Walking into a royal treasury at night.** The room is dark, candle-lit gold moves slowly across the surfaces, and every piece is revealed with ceremony.

King's Maison is a contemporary jewellery house for men, inspired by royal dynasties and rooted in Indian jewellery heritage. It was founded by the sisters Harshi and Ritvi Gilara. The pieces sit between jewellery and collectable art, so the website behaves more like a private museum than a shop.

### Principles
1. **Darkness first.** Black is the stage and gold is the light. Most of every screen is black, so what glows means something.
2. **Reveal, don't show.** Content arrives by sliding, dropping, or being lit. Nothing just appears.
3. **Ceremony in motion.** Movements are slow and heavy, like a vault door or a curtain. They are never bouncy or playful.
4. **Hairlines, not boxes.** Structure comes from 1 px gold lines, dividers and frames. There are no cards with shadows and no rounded boxes.
5. **Every interaction is a metaphor.** Menus are necklaces, pages are chambers, and buttons are doorways. Before designing anything new, ask: "What would this be in a palace treasury?"

---

## 2. Colour

| Token | Hex | Use |
|---|---|---|
| `--km-black` | `#0a0806` | Page background (a warm black, never pure #000) |
| `--km-black-deep` | `#070605` | Cinematic scenes (intro, knockout) |
| `--km-surface` | `#15100a` | Image placeholders, framed areas |
| `--km-surface-raised` | `#1a130c` | Ledges, cornices, raised details |
| `--km-gold` | `#c9a45c` | **Primary gold**: lines, borders, buttons, labels |
| `--km-gold-bright` | `#e8c77f` | Hover, active, focus, glowing edges |
| `--km-gold-pale` | `#fbe7b8` | Highlights inside gradients |
| `--km-gold-deep` | `#7a5418` | Shadows inside gradients |
| `--km-ivory` | `#efe6d2` | Headlines and primary text |
| `--km-ivory-soft` | `#d8cdb4` | Body copy |
| `--km-muted` | `#a89878` | Captions, placeholders, hints |
| `--km-on-gold` | `#140e06` | Text on gold buttons |

**Lines:** `rgba(201,164,92,0.30)` for quiet dividers and `0.60` for active ones.
**Scrims over video:** `rgba(8,6,4,0.55)` light, `0.72` heavy.
**Gem accents** (illustrations only, never UI): emerald `#1f7a4d`, ruby `#9b1b2a`, sapphire `#1d3f8a`, amber `#b86b12`.

**Rules**
- Use gold for meaning (action, active state, structure), never as decoration everywhere.
- Never use a white background or pure white text. Ivory is the lightest text colour.
- Gold gradients are allowed only inside the moving-gold text effect and inside jewel illustrations. Never put gradient washes on backgrounds or buttons.

---

## 3. Typography

| Role | Font | Size (desktop) | Style |
|---|---|---|---|
| Hero word ("MAISON") | Cinzel 700 | 220 px | Tracking 0.06em, video- or gold-filled |
| Page title | Cinzel 700 | 88–112 px | Moving-gold fill |
| Section title | Cormorant Garamond italic | 52–60 px | Ivory |
| Panel title | Cinzel 700 | 46 px | Moving-gold fill |
| Lead line | Cormorant italic | 28–32 px | Ivory |
| Body | Cormorant Garamond | 21–22 px | Line-height 1.55, `--km-ivory-soft` |
| Nav / pills | Cormorant Garamond | 17 px | Ivory |
| Label / button | Cinzel 600–700 | 13–15 px | UPPERCASE, tracking 0.28–0.32em |
| Eyebrow | Cinzel | 12–13 px | UPPERCASE, tracking 0.45em, gold |
| Micro hint | Cinzel | 11 px | UPPERCASE, tracking 0.4em, muted |

**Pairing rule.** Cinzel is carved stone: logos, titles, labels, anything engraved. Cormorant is handwriting on paper: stories, taglines, anything spoken. A title in Cinzel is almost always followed by a line in Cormorant italic.

**Moving-gold text.** Big titles are filled with a slowly drifting gold light (`.km-gold-text` in `tokens.css`). On the home page, the word MAISON is filled with the actual hero video instead.

---

## 4. Layout

- The desktop frame is 1440 × 900, and each page is designed to fit one screen before scrolling.
- The header is 88 px tall with 56 px side gutters and a hairline under it.
- Header zones: left is always the way back (back button or logo), the centre is where you are (logo or eyebrow), and the right is the next door (Private Viewing, The Women Behind the Door, the bag).
- Compositions are **symmetrical** and centred like a palace façade. Use asymmetry only for split pages (text on one side, image on the other).
- **Vertical gold dividers** are the signature structure. They split chambers and sisters, and a small gold diamond (a 10 px rotated square) marks the midpoint or the ends of a break.
- Be generous with black space. When in doubt, remove an element instead of shrinking it.

---

## 5. Components

### Buttons
- **Primary:** gold fill, dark text, Cinzel 700 at 13–14 px, tracking 0.3em, 16 × 34 padding, 2 px radius, soft gold glow `0 0 40px rgba(255,200,110,.5)`.
- **Secondary:** transparent with a 1 px gold border and ivory text.
- **Round arrow button:** a 64 px circle with a 1 px gold border and an arrow pointing the way the page will move. Make it gold-filled with a glow when it is the featured action.
- **Back button:** a 44 px gold-bordered circle with ← and an italic label.

### Pills
- 999 px radius, Cormorant 17 px, border at 30% gold.
- Active state: border at 60% and fill at 15% gold.

### Frames (for photos and video)
- A double frame: an outer 1 px gold border, 12 px padding, then an inner 1 px border at 40% gold, filled with `--km-surface`.
- Portraits are 3:4, and heritage imagery is tall.

### Outlined numerals
- Huge Roman numerals (I, II, III…) with a transparent fill and a 1 px gold stroke at about 35%. They sit behind content as a watermark to number chambers and products.

### Form fields
- Transparent, with only a bottom border in 60% gold.
- Labels are Cinzel 11 px, tracking 0.3em, gold.
- Input text is Cormorant 20 px, ivory.

### Placeholders
- Any missing content is shown as `[ SQUARE BRACKETS IN CAPS ]` in Cinzel 11–12 px, muted, so it is obvious what the client still needs to supply.

---

## 6. Motion

| Token | Value | Use |
|---|---|---|
| `--km-ease-royal` | `cubic-bezier(.2,.7,.1,1)` | Slides, reveals: fast start, long heavy settle |
| `--km-dur-fast` | 250 ms | Colour and hover changes |
| `--km-dur-base` | 600 ms | Fades, small rises |
| `--km-dur-slide` | 1100 ms | Chamber panels opening |
| `--km-dur-cinematic` | 1400 ms | Intro scenes, logo glides |

**Motion vocabulary**
- **Rise:** fade in while moving up 12–30 px. Used for headings and text.
- **Stagger:** 120–200 ms between siblings.
- **Slide open:** a panel grows from its own edge. Its leading edge glows and leaves gold light-streaks behind it.
- **Drop:** content falls in from above, for downward reveals.
- **Hang:** jewels drop onto the necklace one by one with a small spring overshoot.
- **Idle life:** very slow loops keep dark screens alive. These include drifting gold light, rising dust, flickering lamps, a swaying necklace, and chain links shimmering. Keep them subtle: under 1° of rotation and around 10% opacity change.
- **Flash:** a warm gold bloom used once, as the doorway between the intro and Home.

**Never:** bouncy easing on large elements, spinning, parallax on text, or motion faster than 200 ms for anything bigger than a button.

**Reduced motion:** replace slides and drops with plain fades, and stop all idle loops.

---

## 7. Imagery and illustration

- **Video:** dark, slow and candle-lit. Think close-ups of gold catching light, fabric, hands at work. Always put a scrim over it.
- **Photography:** a single piece on black velvet or stone, with low-key lighting and warm highlights.
- **Illustration:** fine gold line art in 1–1.5 px strokes. Indian royal motifs include domes, chhatris, jharokhas, jaali lattice, and kalangi plumes. Jewels are drawn as a gold ring, a dark bezel and a coloured gem with a tiny twinkling highlight.
- **Icons:** 1.5 px stroke, 24 px grid, round caps, in `currentColor`. Keep to simple shapes: arrows, search, bag, menu (two lines), replay.

---

## 8. Voice

- Short, regal and quiet. Aim for statements, not sales talk.
- Examples: "Treasures beyond time." "Every piece, a royal artefact with its own story." "View the Maison in private." "The jewel of the turban."
- Use British spelling (jewellery, colour).
- Avoid exclamation marks, emoji, and words like "shop now", "deal" or "sale".

---

## 9. Accessibility

- Ivory and gold on the warm black both pass WCAG AA for their sizes. Never place muted text below 16 px on a video.
- Focus ring: 2 px `--km-gold-bright` outline with a 3 px offset on every interactive element.
- Every visual trick needs a real fallback:
  - video-filled text keeps a real `<h1>`;
  - the necklace jewels are real links;
  - the chamber arrows are real buttons with labels.
- Hover-only features also work on focus and tap.

---

## 10. Do and don't

| Do | Don't |
|---|---|
| Lead with black space and a single glowing focus | Fill the screen with many equal-weight items |
| Use hairlines and diamonds for structure | Use shadows, rounded cards, or boxed sections |
| Turn navigation into a palace metaphor | Use standard dropdowns, carousels, or hamburger drawers on desktop |
| Keep the logo "KING'S MAISON" | Use the old name "King's Vault" in new work |
| Animate slowly, with weight | Use quick, bouncy, or springy UI motion on large elements |
