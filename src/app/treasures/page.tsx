import type { Metadata } from "next";
import { TreasuresView } from "@/components/treasures/TreasuresView";

export const metadata: Metadata = {
  title: "All Treasures · Maison Harivé",
  description:
    "Browse the full collection of Maison Harivé treasures — featured royal jewellery pieces for men.",
};

export default function TreasuresPage() {
  return <TreasuresView />;
}
