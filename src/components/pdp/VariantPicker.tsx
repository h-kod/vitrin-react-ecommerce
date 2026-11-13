"use client";

import type { Product } from "@/lib/catalog";
import { useVariant } from "./VariantContext";

export function VariantPicker({ variants }: { variants: NonNullable<Product["variants"]> }) {
  const ctx = useVariant();
  if (!ctx) return null;

  return (
    <section>
      <h2 className="mb-3 text-sm font-medium text-muted">
        Beden{ctx.selected && <span className="ml-2 text-ink">{ctx.selected}</span>}
      </h2>
      <div role="radiogroup" aria-label="Beden" className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const out = v.stock === 0;
          const active = ctx.selected === v.label;
          return (
            <button
              key={v.label}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={out}
              title={out ? "Tükendi" : v.stock <= 3 ? `Son ${v.stock} adet` : undefined}
              onClick={() => ctx.setSelected(v.label)}
              className={`grid h-11 min-w-11 place-items-center rounded-ctl border px-3 text-sm transition active:scale-95 ${
                active
                  ? "border-accent bg-accent text-accent-ink"
                  : out
                    ? "cursor-not-allowed border-line text-muted/50 line-through"
                    : "border-line bg-surface hover:border-ink"
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
