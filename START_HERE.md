# How to start with Claude Code

1. Make a new, empty folder for the website and unzip this package into it. `CLAUDE.md` must sit at the top level of the folder.
2. Open a terminal in that folder and run `claude`. It reads `CLAUDE.md` automatically.
3. Paste this as your first message:

```
Read CLAUDE.md, docs/DESIGN_SPEC.md and styles/tokens.css, and look through the mockups in design-reference/.
Then do Step 1 of the build order only: set up the Next.js + TypeScript + Tailwind + Framer Motion project in this folder,
wire the tokens into Tailwind, load Cinzel and Cormorant Garamond with next/font, and create the SiteHeader and BackButton
components. Run the dev server, confirm it builds, and tell me what you did before starting Step 2.
```

4. After that, move forward one step at a time: "Now do Step 2", "Now do Step 3", and so on.

## Helpful follow-up prompts

- "Open the intro and the home page and compare them to design-reference/Stage.mockup.html (scenes 1–3) and Main.mockup.html. List anything that doesn't match, then fix it."
- "Make the Chambers left-panel slide feel slower and more royal, like a heavy door."
- "Test every page at 390px wide and fix the layout."
- "Here is our real hero video: I've put it at public/media/hero.mp4. Switch the home page from the fallback to the video."

## What's in this package

| File | What it is |
|---|---|
| `CLAUDE.md` | Project brief: stack, routes, build order and rules |
| `docs/DESIGN_SPEC.md` | Every page's layout, copy, sizes and animations |
| `styles/tokens.css` | Colours, fonts, spacing and motion values, plus the gold "video text" effect |
| `design-reference/` | The approved mockups (read as reference; they won't open directly in a browser) |

## Still needed from the client

- The hero video
- Photos of the sisters, and their stories
- Product photos, names and prices for each section
- The atelier address and visiting hours
- The final wording in places that still say "Vault" (for example "Every artefact in the Vault")
