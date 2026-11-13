"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { CART_COOKIE, cartKey, maxQty, parseKey, readCart, MAX_QTY, type Cart } from "./cart";
import { getProductById } from "./catalog";

async function writeCart(cart: Cart) {
  (await cookies()).set(CART_COOKIE, JSON.stringify(cart), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });
  refresh(); // header'daki sepet rozeti ve sepet sayfası aynı turda güncellensin
}

export type AddResult = "ok" | "max" | "invalid";

/** İstemciden gelen id/varyant güvenilmez; stok sınırı burada uygulanır. */
export async function addToCart(productId: string, variant?: string): Promise<AddResult> {
  const product = getProductById(productId);
  if (!product) return "invalid";
  const v = product.variants?.length ? variant : undefined; // varyantsız üründe varyant yok sayılır
  const max = maxQty(productId, v);
  if (max === 0) return "invalid";

  const key = cartKey(productId, v);
  const cart = await readCart();
  if ((cart[key] ?? 0) >= max) return "max";
  cart[key] = (cart[key] ?? 0) + 1;
  await writeCart(cart);
  return "ok";
}

/** Yalnızca sepette olan satırın adedini değiştirir (yeni satır eklemek için addToCart). 0 → satır silinir. */
export async function setQty(key: string, qty: number) {
  const cart = await readCart();
  if (!(key in cart)) return;
  const { id, variant } = parseKey(key);
  const n = Math.floor(Number(qty));
  const next = Number.isFinite(n) ? Math.min(Math.max(0, n), maxQty(id, variant), MAX_QTY) : cart[key];
  if (next === 0) delete cart[key];
  else cart[key] = next;
  await writeCart(cart);
}
