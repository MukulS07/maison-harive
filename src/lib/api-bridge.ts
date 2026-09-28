export function getStoreBaseUrl(): string {
  return (
    process.env.MAISON_STORE_URL ||
    process.env.NEXT_PUBLIC_MAISON_STORE_URL ||
    "http://localhost:3000"
  );
}
