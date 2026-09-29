import fs from "fs";
import path from "path";
import { products as defaultProducts, type Product, type ProductCategory } from "@/content/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

function ensureLocalFile(): Product[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(defaultProducts, null, 2), "utf-8");
      return defaultProducts;
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Products Store] Error reading local file:", err);
    return defaultProducts;
  }
}

function saveLocal(items: Product[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.error("[Products Store] Error writing local file:", err);
  }
}

export async function getStoreProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          name: row.name,
          category: row.category as ProductCategory,
          price: row.price || "Inquire",
          tagline: row.tagline || undefined,
          typeLabel: row.type_label || undefined,
          image: row.image || undefined,
          featured: row.featured || false,
        }));
      }
    }
  }

  return ensureLocalFile();
}

export async function getStoreProductById(id: string): Promise<Product | null> {
  const all = await getStoreProducts();
  return all.find((p) => p.id === id) || null;
}

export async function createStoreProduct(input: Partial<Product> & { name: string; category: ProductCategory }): Promise<Product> {
  const id = input.id || input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const newProduct: Product = {
    id,
    name: input.name,
    category: input.category,
    price: input.price || "Inquire",
    tagline: input.tagline || "",
    typeLabel: input.typeLabel || input.category.toUpperCase(),
    image: input.image || "/products/the-citadel-pendant.webp",
    featured: Boolean(input.featured),
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("products").upsert({
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        tagline: newProduct.tagline,
        type_label: newProduct.typeLabel,
        image: newProduct.image,
        featured: newProduct.featured,
        updated_at: new Date().toISOString(),
      });
    }
  }

  const local = ensureLocalFile();
  const index = local.findIndex((p) => p.id === id);
  if (index >= 0) {
    local[index] = newProduct;
  } else {
    local.unshift(newProduct);
  }
  saveLocal(local);

  return newProduct;
}

export async function updateStoreProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const updatedAt = new Date().toISOString();

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const cleanedUpdates: Record<string, unknown> = { updated_at: updatedAt };
      if (updates.name !== undefined) cleanedUpdates.name = updates.name;
      if (updates.category !== undefined) cleanedUpdates.category = updates.category;
      if (updates.price !== undefined) cleanedUpdates.price = updates.price;
      if (updates.tagline !== undefined) cleanedUpdates.tagline = updates.tagline;
      if (updates.typeLabel !== undefined) cleanedUpdates.type_label = updates.typeLabel;
      if (updates.image !== undefined) cleanedUpdates.image = updates.image;
      if (updates.featured !== undefined) cleanedUpdates.featured = updates.featured;

      const { data, error } = await supabase
        .from("products")
        .update(cleanedUpdates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[Products Store] Supabase update failed:", error);
      } else if (data) {
        const updated: Product = {
          id: data.id,
          name: data.name,
          category: data.category as ProductCategory,
          price: data.price || "Inquire",
          tagline: data.tagline || undefined,
          typeLabel: data.type_label || undefined,
          image: data.image || undefined,
          featured: data.featured || false,
        };

        const local = ensureLocalFile();
        const idx = local.findIndex((p) => p.id === id);
        if (idx >= 0) local[idx] = updated;
        else local.unshift(updated);
        saveLocal(local);

        return updated;
      }
    }
  }

  // Local fallback — only reached when Supabase is unconfigured or the row lives solely in the local file.
  const local = ensureLocalFile();
  const index = local.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const cleanedUpdates: Partial<Product> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (v !== undefined) {
      (cleanedUpdates as Record<string, unknown>)[k] = v;
    }
  }

  const updated: Product = {
    ...local[index],
    ...cleanedUpdates,
    id, // protect ID
  };

  local[index] = updated;
  saveLocal(local);
  return updated;
}

export async function deleteStoreProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("products").delete().eq("id", id);
    }
  }

  const local = ensureLocalFile();
  const filtered = local.filter((p) => p.id !== id);
  saveLocal(filtered);
  return true;
}
