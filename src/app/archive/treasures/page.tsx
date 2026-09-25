import type { Metadata } from "next";
import { TreasuresView } from "@/components/treasures/TreasuresView";

export const metadata: Metadata = { title: "All Treasures · Maison Harivé" };

export default function ArchiveTreasuresPage() {
  return <TreasuresView />;
}
