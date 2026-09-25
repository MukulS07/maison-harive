/**
 * Every piece of editable copy and every [ PLACEHOLDER ] lives here,
 * so the client can fill in real content in one place.
 */

export type ChamberId = "legacy" | "collection" | "atelier";

export const site = {
  brand: "Maison Harivé",
  logo: "MAISON HARIVÉ",
  heroWord: "MAISON",
  tagline: "Treasures beyond time",
  description:
    "A contemporary jewellery house for men, inspired by royal dynasties and rooted in Indian jewellery heritage.",

  /** Drop the real film at public/media/hero.mp4; the page switches to it automatically. */
  heroVideo: "/media/hero.mp4",

  /** The cinematic Stage intro that plays before Home (spec §1.0). */
  intro: {
    // Open question for the client: should this become "TREASURES BEYOND TIME"?
    subline: "THE CHAMBERS",
    words: ["EVERY PIECE, A ROYAL ARTEFACT", "WITH A STORY OF ITS OWN"],
    cueStart: "SCROLL TO BEGIN",
    cue: "SCROLL",
    skip: "SKIP INTRO",
  },

  /** Home page header pills. */
  nav: [
    { label: "The Maison", href: "/chambers/legacy" },
    { label: "The Sisters", href: "/sisters" },
    { label: "The Archive", href: "/archive" },
    { label: "The Concierge", href: "/concierge" },
  ],

  privateViewing: { label: "The Concierge", href: "/concierge" },

  chambers: {
    legacy: {
      id: "legacy",
      numeral: "I",
      eyebrow: "CHAMBER I",
      headerLabel: "I · THE LEGACY",
      title: "The Legacy",
      subline: "The story of the house",
      href: "/chambers/legacy",
    },
    collection: {
      id: "collection",
      numeral: "II",
      eyebrow: "CHAMBER II",
      headerLabel: "II · THE FOUNDER",
      title: "The Founder",
      subline: "Every masterpiece begins with a vision of immortality.",
      href: "/chambers/collection",
    },
    atelier: {
      id: "atelier",
      numeral: "III",
      eyebrow: "CHAMBER III",
      headerLabel: "III · NEW CHAPTER",
      title: "New Chapter",
      subline: "Unveiling a bold new horizon of craft and distinction.",
      href: "/chambers/atelier",
    },
  } satisfies Record<ChamberId, unknown>,

  legacy: {
    lead: "Treasures beyond time.",
    body: "Maison Harivé is a contemporary jewellery house inspired by royal dynasties. Bold, masculine, and rooted in Indian jewellery heritage, each piece sits between jewellery and collectable art.",
    portrait: "[ HERITAGE PORTRAIT / FILM ]",
    conceptEyebrow: "THE CONCEPT",
    concept: "Every piece, a royal artefact with its own story.",
  },

  collection: {
    /** Filter pills (placeholder categories). */
    filters: ["All pieces", "Rings", "Cuffs", "Pendants", "Chains"],
    nextArtefact: "[ NEXT ARTEFACT ]",
    photo: "[ PRODUCT PHOTO ]",
  },

  atelier: {
    lead: "View the Maison in private.",
    footage: "[ ATELIER / CRAFTSMAN FOOTAGE ]",
    address: "[ ATELIER ADDRESS ]",
    hours: "[ VISITING HOURS ]",
  },

  sisters: {
    eyebrow: "THE FOUNDERS",
    title: "The Sisters",
    divider: "WORDS FROM THE FOUNDERS",
  },

  founders: [
    {
      name: "HARSHI GILARA",
      role: "FOUNDER",
      portrait: "[ PORTRAIT · HARSHI ]",
      image: undefined as string | undefined,
      story: "[ How Harshi started: the moment the idea of the Maison was born. ]",
      origin: "[ Where it began: the city, the first workshop. ]",
    },
    {
      name: "RITVI GILARA",
      role: "FOUNDER",
      portrait: "[ PORTRAIT · RITVI ]",
      image: undefined as string | undefined,
      story: "[ How Ritvi started: her path into jewellery. ]",
      origin: "[ Where it began: the city, the first workshop. ]",
    },
  ],

  archive: {
    eyebrow: "MAISON HARIVÉ · THE SHOP",
    title: "Products · Men",
    bagCount: 0,
  },
};

export const chamberOrder: ChamberId[] = ["legacy", "collection", "atelier"];
