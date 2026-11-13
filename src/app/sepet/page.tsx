import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CartLines, type CartLine } from "@/components/CartLines";
import { maxQty, parseKey, readCart } from "@/lib/cart";
import { getProductById } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sepet" };

export default function CartPage() {
  return (
    <main className="flex flex-col gap-8">
      <h1 className="font-display text-4xl font-semibold">Sepet</h1>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-card bg-sunken" aria-hidden />}>
        <CartContents />
      </Suspense>
    </main>
  );
}

async function CartContents() {
  const cart = await readCart();
  const lines = Object.entries(cart).flatMap<CartLine>(([key, qty]) => {
    const { id, variant } = parseKey(key);
    const p = getProductById(id);
    return p ? [{ id: key, qty, name: p.name, variant, max: maxQty(id, variant), price: p.price, image: p.image, href: `/${p.sector}/${p.slug}` }] : [];
  });

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-card bg-sunken p-10">
        <p className="text-lg font-medium">Sepetin şimdilik boş.</p>
        <Link href="/" className="rounded-ctl bg-ink px-6 py-3 text-sm font-semibold text-canvas hover:opacity-85">
          Alışverişe başla
        </Link>
      </div>
    );
  }
  return <CartLines lines={lines} />;
}
