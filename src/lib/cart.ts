import { cookies } from "next/headers";
import { getProductById } from "./catalog";

export const CART_COOKIE = "vitrin_cart";
export const MAX_QTY = 99;

/** Sepet anahtarı → adet. Anahtar: `productId` ya da varyantlı üründe `productId:varyant`. Oturum yok; sepet httpOnly cookie'de yaşar. */
export type Cart = Record<string, number>;

export const cartKey = (id: string, variant?: string) => (variant ? `${id}:${variant}` : id);

export function parseKey(key: string) {
  const i = key.indexOf(":");
  return i === -1 ? { id: key } : { id: key.slice(0, i), variant: key.slice(i + 1) };
}

/** Bir sepet satırının alabileceği en yüksek adet. 0 = geçersiz satır (ürün/varyant yok, ya da varyantlı ürün varyantsız). */
export function maxQty(id: string, variant?: string) {
  const product = getProductById(id);
  if (!product) return 0;
  if (!product.variants?.length) return variant ? 0 : Math.min(product.stock ?? MAX_QTY, MAX_QTY);
  const v = product.variants.find((x) => x.label === variant);
  return v ? Math.min(v.stock, MAX_QTY) : 0;
}

/** Cookie istemci tarafından değiştirilebilir: geçersiz satırları atar, adetleri stokla sınırlar. */
export async function readCart(): Promise<Cart> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object") return {};

  const cart: Cart = {};
  for (const [key, qty] of Object.entries(parsed)) {
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty <= 0) continue;
    const { id, variant } = parseKey(key);
    const max = maxQty(id, variant);
    if (max > 0) cart[key] = Math.min(qty, max);
  }
  return cart;
}
