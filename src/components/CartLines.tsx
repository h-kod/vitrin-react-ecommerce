"use client";

import Image from "next/image";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { setQty } from "@/lib/cart-actions";
import { formatPrice } from "@/lib/format";

export type CartLine = { id: string; qty: number; name: string; variant?: string; max: number; price: number; image: string; href: string };

export function CartLines({ lines }: { lines: CartLine[] }) {
  const [, startTransition] = useTransition();
  // Sunucu cevabı gelene kadar UI yeni adedi gösterir; hata olursa server state'e geri döner.
  const [optimistic, applyQty] = useOptimistic(lines, (state, { id, qty }: { id: string; qty: number }) =>
    state.map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0),
  );

  const change = (id: string, qty: number) =>
    startTransition(async () => {
      applyQty({ id, qty });
      await setQty(id, qty);
    });

  const total = optimistic.reduce((sum, l) => sum + l.price * l.qty, 0);
  const stepper = "grid h-8 w-8 place-items-center rounded-ctl text-lg leading-none text-muted transition hover:bg-line hover:text-ink";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_300px] md:items-start">
      <ul className="divide-y divide-line rounded-card border border-line bg-surface px-5 shadow-soft">
        {optimistic.map((l) => (
          <li key={l.id} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sunken">
              <Image src={l.image} alt="" fill sizes="64px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Link href={l.href} className="font-medium leading-snug hover:underline">{l.name}</Link>
              <p className="mt-0.5 text-sm text-muted tabular-nums">
                {l.variant && <span className="mr-2 rounded-ctl bg-sunken px-2 py-0.5 text-xs text-ink">Beden {l.variant}</span>}
                {formatPrice(l.price)}
              </p>
            </div>
            <div className="flex items-center rounded-ctl bg-sunken p-0.5">
              <button type="button" onClick={() => change(l.id, l.qty - 1)} aria-label="Azalt" className={stepper}>−</button>
              <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">{l.qty}</span>
              <button type="button" onClick={() => change(l.id, l.qty + 1)} disabled={l.qty >= l.max} aria-label="Artır" className={`${stepper} disabled:cursor-not-allowed disabled:opacity-40`}>+</button>
            </div>
            <p className="hidden w-28 text-right font-semibold tabular-nums sm:block">{formatPrice(l.price * l.qty)}</p>
          </li>
        ))}
      </ul>

      <aside className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6 shadow-soft">
        <h2 className="font-semibold">Sipariş özeti</h2>
        <p className="flex justify-between text-sm text-muted">
          <span>Ara toplam</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </p>
        <p className="flex justify-between border-t border-line pt-4 text-lg font-semibold">
          <span>Toplam</span>
          <span className="tabular-nums">{formatPrice(total)}</span>
        </p>
        {/* ponytail: checkout henüz yok; ödeme adımı eklenince bu buton route'a bağlanır */}
        <button type="button" disabled className="rounded-ctl bg-ink px-6 py-3 text-sm font-semibold text-canvas opacity-50">
          Ödemeye geç (yakında)
        </button>
      </aside>
    </div>
  );
}
