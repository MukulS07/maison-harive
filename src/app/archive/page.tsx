import type { Metadata } from "next";
import { ArchivePage } from "@/components/archive/ArchivePage";
import { getStoreProducts } from "@/lib/products-store";

export const metadata: Metadata = {
  title: "The Archive · Products",
  description:
    "Shop royal jewellery — brooches, pendants, and sherwani buttons crafted with heritage techniques.",
};

export const revalidate = 30;

export default async function Archive() {
  const products = await getStoreProducts();
  return <ArchivePage products={products} />;
}
