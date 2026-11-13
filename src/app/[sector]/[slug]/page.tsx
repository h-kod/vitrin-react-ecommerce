import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { StickyBuyBar } from "@/components/pdp/StickyBuyBar";
import { VariantProvider } from "@/components/pdp/VariantContext";
import { DeliverySlot, Info, Specs, Stock, StockSkeleton, TrustRow, UnitPrice, Variants } from "@/components/pdp/Modules";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getSector } from "@/sectors";

type Props = PageProps<"/[sector]/[slug]">;

export function generateStaticParams() {
  return products.map((p) => ({ sector: p.sector, slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector, slug } = await params;
  const product = await getProduct(sector, slug);
  return { title: product?.name ?? "Bulunamadı", description: product?.description };
}

// Kabuk statik; ürün içeriği params'a bağlı olduğu için Suspense içinde gelir.
export default function ProductPage({ params }: Props) {
  return (
    <main className="flex flex-col gap-8">
      <Suspense fallback={<PdpSkeleton />}>
        <ProductContent params={params} />
      </Suspense>
    </main>
  );
}

async function ProductContent({ params }: Pick<Props, "params">) {
  const { sector: sectorSlug, slug } = await params;
  const sector = getSector(sectorSlug);
  const product = sector && (await getProduct(sectorSlug, slug));
  if (!sector || !product) notFound();

  const has = (m: (typeof sector.modules)[number]) => sector.modules.includes(m);
  const related = products.filter((p) => p.sector === sector.slug && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-ink">Ana sayfa</Link> <span className="mx-1">/</span>
        <Link href={`/${sector.slug}`} className="hover:text-ink">{sector.name}</Link> <span className="mx-1">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <ViewTransition name={`product-${product.id}`} share="morph" default="none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-sunken shadow-soft md:sticky md:top-24">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ViewTransition>

        <VariantProvider key={product.id}>
        <div className="flex flex-col gap-7">
          <div>
            <p className="text-sm text-muted">{product.brand}</p>
            <h1 className="font-display mt-1 text-4xl font-semibold leading-tight">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
            {has("unitPrice") && <UnitPrice product={product} />}
          </div>

          <p className="leading-relaxed text-muted">{product.description}</p>

          {/* Satın alma kutusu: yapışkan çubuk bunun ekrandan çıkışını izler */}
          <div id="buy-box" className="flex scroll-mt-28 flex-col gap-7">
            {has("variants") && <Variants product={product} />}

            {/* Stok request-time: ürün bilgisi anında gelir, bu blok sonradan stream edilir */}
            <Suspense fallback={<StockSkeleton />}>
              <Stock product={product} />
            </Suspense>
            <TrustRow />
          </div>

          {has("deliverySlot") && <DeliverySlot />}
          {has("specs") && <Specs product={product} />}
          <Info product={product} />
        </div>
        <StickyBuyBar
          productId={product.id}
          name={product.name}
          price={formatPrice(product.price)}
          image={product.image}
          needsVariant={has("variants")}
          soldOut={product.variants?.length ? product.variants.every((v) => v.stock === 0) : product.stock === 0}
        />
        </VariantProvider>
      </div>

      {/* Benzer ürünler: kararsız kullanıcıyı sektörde tutar; sayfayı uzattığı için yapışkan çubuk da anlam kazanır */}
      <section aria-labelledby="benzer" className="flex flex-col gap-6 pt-6">
        <h2 id="benzer" className="font-display text-3xl font-semibold">Bunlar da ilgini çekebilir</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PdpSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-2" aria-hidden>
      <div className="aspect-[4/5] animate-pulse rounded-card bg-sunken" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-20 animate-pulse rounded-ctl bg-sunken" />
        <div className="h-9 w-2/3 animate-pulse rounded-ctl bg-sunken" />
        <div className="h-7 w-32 animate-pulse rounded-ctl bg-sunken" />
        <div className="h-20 animate-pulse rounded-card bg-sunken" />
      </div>
    </div>
  );
}
