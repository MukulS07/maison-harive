import { isSupabaseConfigured } from "./supabase";

export function getStoreUrl(): string {
  return (
    process.env.MAISON_STORE_URL ||
    process.env.NEXT_PUBLIC_MAISON_STORE_URL ||
    "http://localhost:3000"
  );
}

export async function proxyToStore(
  endpoint: string,
  method: string,
  body?: unknown,
  search?: string
): Promise<Response | null> {
  // If Supabase is directly configured, we don't need to proxy
  if (isSupabaseConfigured()) {
    return null;
  }

  const storeUrl = getStoreUrl();
  const targetUrl = `${storeUrl}${endpoint}${search || ""}`;

  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(targetUrl, options);
    return res;
  } catch (err) {
    console.warn(`[Proxy Error] Unable to connect to main store at ${targetUrl}:`, err);
    return null;
  }
}
