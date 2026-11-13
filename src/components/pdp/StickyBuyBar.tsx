"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { addToCart, type AddResult } from "@/lib/cart-actions";
import { useVariant } from "./VariantContext";

type Props = { productId: string; name: string; price: string; image: string; needsVariant: boolean; soldOut: boolean };

/** Satın alma kutusu ekrandan yukarı çıkınca beliren yapışkan çubuk. Beden seçilmemişse kutuya geri kaydırır. */
export function StickyBuyBar({ productId, name, price, image, needsVariant, soldOut }: Props) {
  const variant = useVariant()?.selected ?? undefined;
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ key: string; status: AddResult } | null>(null);

  useEffect(() => {
    const box = document.getElementById("buy-box");
    if (!box) return;
    // Yalnızca kutu görünümün ÜSTÜNE çıktığında göster (aşağıdayken zaten görünür olacak)
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(box);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => setResult(null), 2500);
    return () => clearTimeout(t);
  }, [result]);

  const key = variant ?? "";
  const missing = needsVariant && !variant;
  const current = result?.key === key ? result.status : null;
  const label = soldOut
    ? "Tükendi"
    : missing
      ? "Beden seç"
      : pending
        ? "Ekleniyor…"
        : current === "ok"
          ? "Sepete eklendi ✓"
          : current === "max"
            ? "Stok sınırında"
            : "Sepete ekle";

  const onClick = () => {
    if (missing) {
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("buy-box")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
      return;
    }
    startTransition(async () => setResult({ key, status: await addToCart(productId, variant) }));
  };

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      style={{ transitionTimingFunction: "var(--ease)" }}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/90 backdrop-blur-xl transition-transform duration-500 ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
        <div className="relative hidden h-12 w-10 shrink-0 overflow-hidden rounded-sm bg-sunken sm:block">
          <Image src={image} alt="" fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{name}</p>
          <p className="text-sm tabular-nums text-muted">{price}</p>
        </div>
        <button
          type="button"
          disabled={soldOut || pending}
          onClick={onClick}
          className="btn-jiggle shrink-0 rounded-ctl bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-sunken disabled:text-muted"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
