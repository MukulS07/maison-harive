import type { Metadata } from "next";
import { TreasuresView } from "@/components/treasures/TreasuresView";

export const metadata: Metadata = { title: "All Treasures · Maison Harivé" };

export default function TreasuresPage() {
  return <TreasuresView />;
}
