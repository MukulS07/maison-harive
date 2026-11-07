import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "The Archive · Products",
  description:
    "Shop royal jewellery — brooches, pendants, and sherwani buttons crafted with heritage techniques.",
};

export const revalidate = 30;

export default async function Archive() {
  // The Archive section is hidden for now
  redirect("/chambers");
}
