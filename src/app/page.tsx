import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { HeroSlider } from "@/components/HeroSlider";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner } from "@/components/PromoBanner";
import { banners, perks, slides } from "@/data/campaigns";
import { products } from "@/data/products";
import { sectorList } from "@/sectors";

const featured = ["m4", "e4", "g4", "m5", "m2", "e2", "g2", "e6"].flatMap((id) => products.find((p) => p.id === id) ?? []);

export default function Home() {
  return (
    <main className="flex flex-col gap-20 sm:gap-28">
      {/* Hero: yalnızca görsel; metin yok. Sayfa başlığı ekran okuyucular için korunur. */}
      <section aria-label="Kampanyalar" className="flex flex-col gap-10">
        <h1 className="sr-only">Üç sektör. Tek vitrin.</h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-stretch">
          <div className="min-w-0 lg:col-span-8">
            <HeroSlider slides={slides} />
          </div>
          {/* Sağ kolon slider'ın yüksekliğini ikiye böler: banner'lar eşit yükseklikte, üst/alt kenarlar hizalı */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-2">
            {banners.map((b) => (
              <PromoBanner key={b.id} banner={b} sizes="(min-width: 1024px) 380px, 50vw" />
            ))}
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {perks.map((p) => (
            <li key={p.id} className="rounded-card border border-line bg-surface px-5 py-4">
              <p className="font-display font-semibold">{p.title}</p>
              <p className="mt-0.5 text-sm text-muted">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <Marquee items={sectorList.map((s) => s.name)} />

      {/* Sektörler: kartlar kaydırdıkça üst üste biner */}
      <section aria-labelledby="dunyalar" className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 id="dunyalar" className="font-display text-4xl font-semibold leading-none sm:text-6xl">
            Sektörlere göz at.
          </h2>
          <p className="max-w-md text-muted">Her sektörün vitrininden öne çıkan ürünleri keşfet.</p>
        </div>
        <div className="flex flex-col gap-[22vh] pb-[8vh]">
          {sectorList.map((s, i) => {
            const cover = products.find((p) => p.id === s.cover);
            const shelf = products.filter((p) => p.sector === s.slug);
            return (
              <article
                key={s.slug}
                style={{ top: `calc(5rem + ${i} * 1rem)` }}
                className="group sticky grid grid-cols-1 gap-6 rounded-card border border-line bg-surface p-4 shadow-soft md:grid-cols-12 md:items-center md:gap-10 md:p-6"
              >
                <Link
                  href={`/${s.slug}`}
                  prefetch
                  aria-label={`${s.name} sektörüne git`}
                  className="card-media relative isolate block aspect-[16/11] overflow-clip rounded-card bg-sunken md:col-span-7"
                >
                  {cover && (
                    <ViewTransition name={`cover-${s.slug}`} share="morph" default="none">
                      <div className="absolute inset-0 overflow-clip">
                        <Image
                          src={cover.image}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 58vw, 100vw"
                          className="hero-parallax object-cover"
                        />
                      </div>
                    </ViewTransition>
                  )}
                </Link>
                <div className="flex flex-col items-start gap-3 md:col-span-5 md:pl-4">
                  <p aria-hidden className="font-display text-[6rem] font-semibold leading-none text-stroke">0{i + 1}</p>
                  <p className="text-sm text-muted">{s.kicker} · {shelf.length} ürün</p>
                  <h3 className="font-display text-4xl font-semibold leading-none sm:text-5xl">{s.name}</h3>
                  <p className="max-w-xs text-muted">{s.tagline}</p>
                  <p className="text-sm text-muted">
                    <span className="text-ink">Vitrinde:</span> {shelf.slice(0, 3).map((p) => p.name).join(" · ")}
                  </p>
                  <Link
                    href={`/${s.slug}`}
                    prefetch
                    className="btn-jiggle mt-2 rounded-ctl border border-ink px-6 py-3 text-sm font-semibold transition hover:bg-ink hover:text-canvas active:scale-[0.97]"
                  >
                    Sektöre git →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-4xl font-semibold leading-none sm:text-5xl">Öne çıkanlar</h2>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
