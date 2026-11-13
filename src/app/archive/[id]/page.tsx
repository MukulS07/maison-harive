import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "The Archive",
  description: "Maison Harivé Archive Collection.",
};

export default function ProductPage() {
  // The Archive section is hidden for now
  redirect("/chambers");
}
