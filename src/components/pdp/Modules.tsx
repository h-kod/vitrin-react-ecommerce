import { getStock, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { AddToCart } from "@/components/AddToCart";
import { VariantPicker } from "./VariantPicker";

// Sektör modülleri: hangisinin render edileceğini `sectors[slug].modules` belirler.

const h2 = "mb-3 text-sm font-medium text-muted";

export function Variants({ product }: { product: Product }) {
  if (!product.variants?.length) return null;
  return <VariantPicker variants={product.variants} />;
}

export function Specs({ product }: { product: Product }) {
  if (!product.specs) return null;
  return (
    <section>
      <h2 className={h2}>Teknik özellikler</h2>
      <dl className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface text-sm">
        {Object.entries(product.specs).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 px-4 py-3">
            <dt className="text-muted">{k.replaceAll("_", " ")}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function UnitPrice({ product }: { product: Product }) {
  if (!product.unit) return null;
  const { kind, size } = product.unit;
  return (
    <p className="mt-1 text-sm text-muted">
      Birim fiyat: {formatPrice(product.price / size)} / {kind}
    </p>
  );
}

export function DeliverySlot() {
  // ponytail: statik slot listesi; kapasite servisi bağlanınca request-time olur
  const slots = ["Bugün 18:00–20:00", "Yarın 10:00–12:00", "Yarın 14:00–16:00"];
  return (
    <section>
      <h2 className={h2}>Teslimat slotu</h2>
      <ul className="flex flex-wrap gap-2 text-sm">
        {slots.map((s) => (
          <li key={s} className="rounded-ctl border border-line bg-surface px-4 py-2 hover:border-ink">{s}</li>
        ))}
      </ul>
    </section>
  );
}

/** Stok + sepete ekle. Varyantlı üründe stok bedenlerden gelir; yalnızca varyantsız ürün request-time stok servisine gider. */
export async function Stock({ product }: { product: Product }) {
  if (product.variants?.length) {
    const stockByVariant = Object.fromEntries(product.variants.map((v) => [v.label, v.stock]));
    return <AddToCart productId={product.id} stockByVariant={stockByVariant} />;
  }
  return <AddToCart productId={product.id} stock={await getStock(product.id)} />;
}

export function StockSkeleton() {
  return <div className="h-12 w-56 animate-pulse rounded-ctl bg-sunken" aria-label="Stok kontrol ediliyor" />;
}

/** Satın alma kararına yakın güven sinyalleri. Demo metin: gerçek bir politikayı temsil etmez. */
export function TrustRow() {
  const items = ["500 TL üzeri ücretsiz kargo", "14 gün içinde iade", "Güvenli ödeme"];
  return (
    <ul className="grid gap-2 text-sm text-muted sm:grid-cols-3">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-2">
          <span aria-hidden className="text-accent">✓</span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** İlerleyici bilgi gösterimi: ikincil bilgi, ilgilenen kullanıcı açana kadar kapalı. */
export function Info({ product }: { product: Product }) {
  const row = "group/acc py-4";
  const summary =
    "flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden";
  const plus = <span aria-hidden className="text-xl leading-none text-muted transition-transform duration-300 group-open/acc:rotate-45">+</span>;
  return (
    <div className="divide-y divide-line border-y border-line">
      <details className={row}>
        <summary className={summary}>Teslimat ve iade{plus}</summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Siparişler 1–3 iş gününde kargoya verilir. Kullanılmamış ürünleri teslimattan sonra 14 gün içinde ücretsiz iade edebilirsin.
        </p>
      </details>
      <details className={row}>
        <summary className={summary}>Ürün bilgisi{plus}</summary>
        <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-y-1 text-sm">
          <dt className="text-muted">Marka</dt>
          <dd>{product.brand}</dd>
          <dt className="text-muted">Ürün kodu</dt>
          <dd className="font-mono">{product.id.toUpperCase()}</dd>
        </dl>
      </details>
    </div>
  );
}
