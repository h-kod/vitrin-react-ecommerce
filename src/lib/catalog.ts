import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { products, type Product } from "@/data/products";

export type { Product };

export async function getProducts(sector: string, filters: Record<string, string> = {}) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog", `catalog-${sector}`);
  return products.filter(
    (p) => p.sector === sector && Object.entries(filters).every(([k, v]) => p.attrs[k] === v),
  );
}

export async function getProduct(sector: string, slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog", `product-${sector}-${slug}`);
  return products.find((p) => p.sector === sector && p.slug === slug) ?? null;
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id) ?? null;
}

export function facetValues(list: Product[], key: string) {
  return [...new Set(list.map((p) => p.attrs[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
}

/** Stok request-time okunur (statik kabuğa girmez, Suspense ile stream edilir). Değer `Product.stock` ile aynı kaynaktır. */
export async function getStock(id: string) {
  await connection();
  await new Promise((r) => setTimeout(r, 600)); // envanter servisi gecikmesi simülasyonu
  return getProductById(id)?.stock ?? 0;
}
