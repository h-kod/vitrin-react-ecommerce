import Link from "next/link";
import { readCart } from "@/lib/cart";

const BAG = (
  <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 7h12l-1 13H7L6 7Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

const base =
  "relative flex h-10 min-w-10 items-center justify-center gap-2 rounded-ctl border border-line bg-surface px-3 text-ink transition hover:border-ink";

/** Sepet Suspense yedeği: aynı boyut, sayı yok (yerleşim zıplamasın). */
export function CartFallback() {
  return (
    <span className={base} aria-label="Sepet">
      {BAG}
      <span className="hidden text-sm font-medium sm:inline">Sepet</span>
    </span>
  );
}

// cookies() okur → request-time; layout'ta Suspense içinde render edilir.
export async function CartBadge() {
  const cart = await readCart();
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <Link href="/sepet" aria-label={count > 0 ? `Sepet, ${count} ürün` : "Sepet"} className={base}>
      {BAG}
      <span className="hidden text-sm font-medium sm:inline">Sepet</span>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.7rem] font-semibold text-accent-ink tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
