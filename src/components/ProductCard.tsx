import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { QuickAdd } from "./QuickAdd";

/** Standart ürün kartı: görsel, marka/ad/fiyat, altta her zaman görünen "Sepete ekle". */
export function ProductCard({ product }: { product: Product }) {
  const href = `/${product.sector}/${product.slug}`;
  return (
    // Kart bir <Link> değil: iç içe interaktif öğe olmasın diye görsel/metin ayrı linkler, QuickAdd kardeşi
    <article className="group flex h-full flex-col gap-3">
      <div className="card-media relative aspect-[4/5] overflow-hidden rounded-card bg-sunken">
        {/* Görsel PDP'deki aynı isimli görsele morph olur */}
        <ViewTransition name={`product-${product.id}`} share="morph" default="none">
          <div className="absolute inset-0">
            <Link href={href} prefetch aria-label={product.name} className="block h-full w-full">
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </Link>
          </div>
        </ViewTransition>
      </div>
      <Link href={href} prefetch>
        <p className="text-xs text-muted">{product.brand}</p>
        <h3 className="font-display mt-0.5 font-medium leading-snug">
          <span className="link-underline">{product.name}</span>
        </h3>
        <p className="mt-1 text-sm font-semibold tabular-nums">{formatPrice(product.price)}</p>
      </Link>
      <div className="mt-auto pt-1">
        <QuickAdd productId={product.id} name={product.name} variants={product.variants} stock={product.stock} />
      </div>
    </article>
  );
}
