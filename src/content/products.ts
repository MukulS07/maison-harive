/**
 * The product catalogue. Everything here is a placeholder until real
 * names, prices and photos arrive: edit this file only.
 */

export type ProductCategory = "buttons" | "brooches" | "kalangi" | "pendant";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price?: string;
  /** Path under /public, e.g. "/products/shield-of-legacy.jpg". */
  image?: string;
  /** Featured pieces hang on the "All Treasures" strand and fill the Collection grid. */
  featured?: boolean;
};

const PRICE = "[ PRICE ]";

/** The five named artefacts. Their categories are placeholders; set the real ones. */
const featured: Product[] = [
  { id: "shield-of-legacy", name: "Shield of Legacy", category: "brooches", price: PRICE, featured: true },
  { id: "arms-of-honour", name: "Arms of Honour", category: "brooches", price: PRICE, featured: true },
  { id: "crownbound", name: "Crownbound", category: "kalangi", price: PRICE, featured: true },
  { id: "phoenix-reign", name: "Phoenix Reign", category: "pendant", price: PRICE, featured: true },
  { id: "dominion", name: "Dominion", category: "buttons", price: PRICE, featured: true },
];

const numerals = ["I", "II", "III", "IV", "V"];

function placeholders(category: ProductCategory, label: string): Product[] {
  return numerals.map((n) => ({
    id: `${category}-${n.toLowerCase()}`,
    name: `[ ${label} ${n} ]`,
    category,
    price: PRICE,
  }));
}

export const products: Product[] = [
  ...featured,
  ...placeholders("buttons", "BUTTON"),
  ...placeholders("brooches", "BROOCH"),
  ...placeholders("kalangi", "KALANGI"),
  ...placeholders("pendant", "PENDANT"),
];

export type ArchiveSectionId = "treasures" | ProductCategory;

/** The Archive tabs, in order. */
export const archiveSections: { id: ArchiveSectionId; label: string; caption: string }[] = [
  { id: "buttons", label: "Buttons", caption: "Buttons for the sherwani and the bandhgala." },
  { id: "brooches", label: "Brooches", caption: "Worn at the heart, over the chest." },
  { id: "kalangi", label: "Kalangi", caption: "The jewel of the turban." },
  { id: "pendant", label: "Pendants", caption: "Worn close, carried always." },
  { id: "treasures", label: "All Treasures", caption: "Every piece in the Maison, on one strand." },
];

/**
 * Pieces shown for an Archive section. "All Treasures" shows the featured pieces.
 * A section shows its own placeholders until named pieces are moved into it
 * (clear `featured` on a named piece to list it under its category instead).
 */
export function productsFor(section: ArchiveSectionId): Product[] {
  if (section === "treasures") return products.filter((p) => p.featured);
  return products.filter((p) => p.category === section && !p.featured).slice(0, 5);
}

export const featuredProducts = products.filter((p) => p.featured);

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function toNumeral(index: number) {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][index] ?? String(index + 1);
}
