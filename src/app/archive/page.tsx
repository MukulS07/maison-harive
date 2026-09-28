import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive/ArchivePage";

export const metadata: Metadata = {
  title: "The Archive · Products · Men",
  description:
    "Shop royal jewellery for men — brooches, pendants, kalangi, and sherwani buttons crafted with heritage techniques.",
};

export default function Archive() {
  return <ArchivePage />;
}
