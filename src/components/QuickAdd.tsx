"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { addToCart, type AddResult } from "@/lib/cart-actions";

type Variant = { label: string; stock: number };

/** Kart üstünde hızlı ekleme. Varyantlı üründe butonun üzerine gelince (ya da odak/dokunuşla) bedenler listelenir. */
export function QuickAdd({ productId, name, variants, stock }: { productId: string; name: string; variants?: Variant[]; stock?: number }) {
  const hasVariants = !!variants?.length;
  const allSoldOut = hasVariants ? variants.every((v) => v.stock === 0) : stock === 0;
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<AddResult | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2200);
    return () => clearTimeout(t);
  }, [feedback]);

  // Dokunmatikte hover yok: dışarı dokunma ya da Escape listeyi kapatır
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const add = (variant?: string) =>
    startTransition(async () => {
      setOpen(false);
      setFeedback(await addToCart(productId, variant));
    });

  const label = allSoldOut
    ? "Tükendi"
    : pending
      ? "Ekleniyor…"
      : feedback === "ok"
        ? "Sepete eklendi ✓"
        : feedback === "max"
          ? "Stok sınırında"
          : feedback === "invalid"
            ? "Eklenemedi"
            : "Sepete ekle";

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(e) => hasVariants && e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onFocus={() => hasVariants && setOpen(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      {hasVariants && open && (
        <div className="absolute inset-x-0 bottom-full z-20 pb-2">
          <div
            id={`qa-${productId}`}
            role="group"
            aria-label={`${name} için beden seç`}
            className="rounded-card border border-line bg-surface p-3 shadow-soft"
          >
            <p className="mb-2 text-xs font-medium text-muted">Beden seç</p>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  disabled={v.stock === 0 || pending}
                  title={v.stock === 0 ? "Tükendi" : v.stock <= 3 ? `Son ${v.stock} adet` : undefined}
                  onClick={() => add(v.label)}
                  className="grid h-9 min-w-9 place-items-center rounded-ctl border border-line bg-surface px-2 text-sm transition hover:border-ink hover:bg-ink hover:text-canvas active:scale-95 disabled:cursor-not-allowed disabled:text-muted/50 disabled:line-through disabled:hover:bg-surface disabled:hover:text-muted/50"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        disabled={allSoldOut || pending}
        aria-expanded={hasVariants ? open : undefined}
        aria-controls={hasVariants ? `qa-${productId}` : undefined}
        onClick={hasVariants ? () => setOpen(true) : () => add()}
        className="w-full rounded-ctl border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-canvas active:scale-[0.98] disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent disabled:hover:text-muted"
      >
        {label}
      </button>
      <span className="sr-only" aria-live="polite">
        {feedback === "ok" ? `${name} sepete eklendi` : ""}
      </span>
    </div>
  );
}
