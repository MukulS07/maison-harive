import { NextResponse } from "next/server";
import { products as defaultProducts } from "@/content/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local first.",
      });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ success: false, message: "Could not create Supabase client." }, { status: 500 });
    }

    const rows = defaultProducts.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price || "Inquire",
      tagline: p.tagline || "",
      type_label: p.typeLabel || "",
      image: p.image || "/products/the-citadel-pendant.webp",
      featured: Boolean(p.featured),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("products").upsert(rows);
    if (error) {
      console.error("[Seed error]", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: rows.length });
  } catch (err) {
    console.error("[Seed exception]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
