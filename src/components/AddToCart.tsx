"use client";

import { useEffect, useState, useTransition } from "react";
import { addToCart, type AddResult } from "@/lib/cart-actions";
import { Magnetic } from "./Magnetic";
import { useVariant } from "./pdp/VariantContext";

type Props = {
  productId: string;
  /** Varyantsız ürünün stoğu */
  stock?: number;
  /** Varyantlı ürünün beden → stok haritası; verilirse beden seçilmeden eklenemez */
  stockByVariant?: Record<string, number>;
};

export function AddToCart({ productId, stock, stockByVariant }: Props) {
  const [pending, startTransition] = useTransition();
  const variant = useVariant()?.selected ?? undefined;
  const [result, setResult] = useState<{ key: string; status: AddResult } | null>(null);

  // Geri bildirim kısa süre görünür, sonra buton sıfırlanır
  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => setResult(null), 2500);
    return () => clearTimeout(t);
  }, [result]);

  const key = variant ?? "";
  const total = stockByVariant ? Object.values(stockByVariant).reduce((a, b) => a + b, 0) : (stock ?? 0);
  const available = stockByVariant ? (variant ? stockByVariant[variant] : undefined) : stock;
  const soldOut = total === 0;
  const missingVariant = !!stockByVariant && !variant;
  const current = result?.key === key ? result.status : null;

  const label = soldOut
    ? "Tükendi"
    : missingVariant
      ? "Beden seç"
      : pending
        ? "Ekleniyor…"
        : current === "ok"
          ? "Sepete eklendi ✓"
          : current === "max"
            ? "Stok sınırında"
            : "Sepete ekle";

  const status =
    soldOut ? "Stokta yok"
    : missingVariant ? "Beden seçin"
    : available === 0 ? "Stokta yok"
    : (available ?? 0) <= 3 ? `Son ${available} adet`
    : "Stokta";
  const tone = missingVariant ? "text-muted" : status === "Stokta" ? "text-accent" : "text-danger";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Magnetic>
        <button
          type="button"
          disabled={soldOut || pending || missingVariant}
          onClick={() =>
            startTransition(async () => {
              const status = await addToCart(productId, variant);
              setResult({ key, status });
            })
          }
          className="rounded-ctl bg-accent px-7 py-3 text-sm font-semibold text-accent-ink transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted"
        >
          {label}
        </button>
      </Magnetic>
      <p className={`flex items-center gap-2 text-sm font-medium ${tone}`} aria-live="polite">
        <span className="h-2 w-2 rounded-full bg-current" />
        {status}
      </p>
    </div>
  );
}
