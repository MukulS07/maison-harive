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
      numeral: "II",
      eyebrow: "CHAMBER II",
      headerLabel: "II · NEW CHAPTER",
      title: "New Chapter",
      subline: "Unveiling a bold new horizon of craft and distinction.",
      href: "/chambers/atelier",
    },
  } satisfies Record<ChamberId, unknown>,

  legacy: {
    lead: "Heritage, seen through a new lens.",
    body:
      "Born into the fifth generation of the Rambhajos family, jewellery has always been a part of Harshi and Ritvi’s world. Growing up in Jaipur, surrounded by a living legacy of treasures, stories and generations of craft, shaped their understanding of jewellery from the very beginning. Maison Harive emerged from this heritage, carrying the soul of Jaipur into a new expression. The sisters bring together the richness of Indian craftsmanship with the elegance, restraint and spirit of French culture. Rooted in where they come from, yet inspired by where the world is going, Maison Harive is their own interpretation of heritage.\n\nA new house, where Jaipur meets France, and an old legacy finds a new language.",
    portrait: "[ HERITAGE PORTRAIT / FILM ]",
    image: "/media/heritage-portrait.jpg",
    conceptEyebrow: "THE CONCEPT",
    concept: "Every piece, a royal artefact with its own story.",
  },

  collection: {
    /** Real catalogue categories */
    filters: ["All Pieces", "Buttons", "Brooches", "Kalangi", "Pendants"],
    nextArtefact: "Next Artefact",
    photo: "/media/heritage-portrait.jpg",
  },

  atelier: {
    lead: "Unveiling a bold new horizon of craft and distinction.",
    video: "/media/video-output-4098CE0C-7E21-476B-88F5-EED370891E88-1.mp4",
    body:
      "Maison Harivé is a new house born from an old world of treasures, stories and heritage.\n\nInspired by the grandeur of Jaipur and the elegance of France, it reimagines the jewels and symbols of another time for a new generation.\n\nEach creation is imagined as a treasure discovered within the house carrying a story, a symbol and a sense of mystery. Founded by two sisters, Maison Harivé is where an inherited legacy finds a language of its own.\n\nA new house. A new chapter. Treasures, reimagined.",
    viewingTitle: "View the Maison in private.",
    viewingSubtitle: "Arrange an exclusive private viewing with our curators.",
    footage: "MAISON HARIVÉ · THE ATELIER FILM",
    address: "Jaipur & Paris",
    hours: "By Private Appointment",
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
      story:
        "Born and raised in Jaipur, Harshi Gilara grew up in the fifth generation of the Rambhajos family in a world where jewellery, tradition, family and enterprise were woven into everyday life.\n\nShe holds a degree in Accounting & Finance, an advanced degree in Digital Marketing, and a Master’s from IE Business School, Madrid. Her education shaped the business perspective she would later bring to a career spanning jewellery, entrepreneurship, sustainability and technology.\n\nHarshi spent seven years working with Rambhajos as Chief Marketing Officer, gaining an intimate understanding of the jewellery business while being part of a family enterprise deeply rooted in Jaipur. Being part of a family business also meant learning far beyond a defined role — understanding people, relationships, responsibility and the many moving parts behind a growing institution.\n\nHer entrepreneurial journey later expanded beyond jewellery. She went on to build and lead ventures across sustainability, technology and consumer businesses, gaining experience in building brands, understanding markets and creating businesses from the ground up.\n\nYet jewellery remained the world closest to her roots.\n\nMaison Harivé was born from a desire to create something that was distinctly her own not a continuation of the family business, but a new expression of everything she had grown up around.\n\nThe values came from Jaipur.\nThe experience came from generations.\nThe vision came from looking beyond them.\n\nMaison Harivé brings together the richness of Indian heritage with a contemporary, global sensibility creating a house where treasures inspired by another time can be imagined for a new generation.\n\nFor Harshi, the Maison is ultimately about creating without losing connection to where it all began.\n\nHonouring the roots. Reimagining the legacy. Creating what comes next.",
      origin: "",
    },
    {
      name: "RITVI GILARA",
      role: "FOUNDER",
      portrait: "[ PORTRAIT · RITVI ]",
      image: undefined as string | undefined,
      story:
        "Born and raised in Jaipur, Ritvi Gilara grew up surrounded by the same world of jewellery, heritage and family that would eventually inspire Maison Harivé. But her way of seeing the world has always been distinctly her own.\n\nCurious by nature and endlessly imaginative, Ritvi has always been drawn to creating, exploring and understanding things beyond their obvious form. Her mind moves naturally between disciplines — from art and design to business, technology and new ideas always looking for another way to approach what already exists.\n\nA graduate of Rhode Island School of Design, Ritvi spent her time exploring an expansive range of creative practices, from traditional handwork and sculpture to painting, fine art and digital forms of creation. Years of experimentation refined not only her artistic skills, but also the way she thinks with an openness to ideas, materials and possibilities from entirely different worlds.\n\nHer creativity, however, has never existed separately from business.\n\nAfter returning to Jaipur, Ritvi joined Rambhajos, bringing her creative perspective into a family enterprise built over generations. Her role has extended far beyond design. She has worked across creative and technical aspects of the business, constantly exploring new ways to evolve, modernise and strengthen the legacy her family has built.\n\nShe is often the person bringing the next idea to the table a new possibility, a different direction, an unexplored opportunity. Her instinct is not simply to ask what exists, but what could exist.\n\nThat same curiosity lies at the heart of Maison Harivé.\n\nFor Ritvi, the Maison is a space where imagination can meet heritage without being restricted by it. A place where stories from another time can become new forms, where traditional symbols can be looked at differently, and where creativity is allowed to lead.\n\nQuietly warm, deeply emotional and naturally humble, Ritvi brings a softer dimension to the Maison. Her sensitivity to people, beauty and detail is reflected in the way she creates with curiosity, feeling and an instinct to make things meaningful.\n\nOutside the world of design and business, Ritvi finds joy in the simpler things: creating art, discovering new ideas, spending time with the people she loves, and singing another expression of the creative world she carries within her.\n\nMaison Harivé is, in many ways, an extension of that world.\n\nA curious mind. An artist’s eye. A legacy waiting to be reimagined.",
      origin: "",
    },
  ],

  archive: {
    eyebrow: "MAISON HARIVÉ · THE SHOP",
    title: "Products · Men",
    tagline:
      "Every treasure from the MAISON comes with a special note, a gift to keep, and its Certificate of Authenticity",
    bagCount: 0,
  },
};

export const chamberOrder: ChamberId[] = ["legacy", "atelier"];
