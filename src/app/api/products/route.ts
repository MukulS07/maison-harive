import { NextResponse } from "next/server";
import { products, type ProductCategory } from "@/content/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as ProductCategory | null;
  const featured = searchParams.get("featured");
  const id = searchParams.get("id");
  const query = searchParams.get("q")?.toLowerCase();

  let result = products;

  if (id) {
    const item = products.find((p) => p.id === id);
    if (!item) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product: item });
  }

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  if (featured === "true") {
    result = result.filter((p) => p.featured);
  }

  if (query) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.tagline && p.tagline.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    total: result.length,
    products: result,
  });
}
