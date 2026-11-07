import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "The Sisters",
  description:
    "Meet Harshi and Ritvi Gilara — the founders of Maison Harivé, a contemporary jewellery house rooted in Jaipur heritage.",
};

export default function Sisters() {
  // Hidden for now
  redirect("/chambers");
}
