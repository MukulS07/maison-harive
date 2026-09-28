import { NextResponse } from "next/server";
import { type ProductCategory } from "@/content/products";
import {
  getStoreProducts,
  getStoreProductById,
  createStoreProduct,
  updateStoreProduct,
  deleteStoreProduct,
} from "@/lib/products-store";
import { corsHeaders, handleOptions } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  return handleOptions(request);
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ProductCategory | null;
    const featured = searchParams.get("featured");
    const id = searchParams.get("id");
    const query = searchParams.get("q")?.toLowerCase();

    if (id) {
      const item = await getStoreProductById(id);
      if (!item) {
        return NextResponse.json({ error: "Product not found" }, { status: 404, headers });
      }
      return NextResponse.json({ product: item }, { headers });
    }

    let result = await getStoreProducts();

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
          p.category.toLowerCase().includes(query) ||
          (p.price && p.price.toLowerCase().includes(query))
      );
    }

    return NextResponse.json(
      {
        total: result.length,
        products: result,
      },
      { headers }
    );
  } catch (err) {
    console.error("[GET /api/products error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400, headers });
    }

    const created = await createStoreProduct({
      id: body.id,
      name: body.name.trim(),
      category: body.category,
      price: body.price?.trim() || "Inquire",
      tagline: body.tagline?.trim(),
      typeLabel: body.typeLabel?.trim(),
      image: body.image?.trim() || "/products/the-citadel-pendant.webp",
      featured: Boolean(body.featured),
    });

    return NextResponse.json({ success: true, product: created }, { status: 201, headers });
  } catch (err) {
    console.error("[POST /api/products error]", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500, headers });
  }
}

export async function PUT(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400, headers });
    }

    const updated = await updateStoreProduct(body.id, {
      name: body.name !== undefined ? body.name.trim() : undefined,
      category: body.category !== undefined ? body.category : undefined,
      price: body.price !== undefined ? body.price.trim() : undefined,
      tagline: body.tagline !== undefined ? body.tagline.trim() : undefined,
      typeLabel: body.typeLabel !== undefined ? body.typeLabel.trim() : undefined,
      image: body.image !== undefined ? body.image.trim() : undefined,
      featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404, headers });
    }

    return NextResponse.json({ success: true, product: updated }, { headers });
  } catch (err) {
    console.error("[PUT /api/products error]", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500, headers });
  }
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400, headers });
    }

    await deleteStoreProduct(id);
    return NextResponse.json({ success: true, message: `Product ${id} removed` }, { headers });
  } catch (err) {
    console.error("[DELETE /api/products error]", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500, headers });
  }
}
