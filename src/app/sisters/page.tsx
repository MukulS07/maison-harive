import type { Metadata } from "next";
import { SistersPage } from "@/components/SistersPage";

export const metadata: Metadata = { title: "The Sisters" };

export default function Sisters() {
  return <SistersPage />;
}
