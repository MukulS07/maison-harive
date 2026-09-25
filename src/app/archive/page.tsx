import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive/ArchivePage";

export const metadata: Metadata = { title: "The Archive · Products · Men" };

export default function Archive() {
  return <ArchivePage />;
}
